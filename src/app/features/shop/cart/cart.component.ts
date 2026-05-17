import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CartService, CartItem } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatDialogModule, MatProgressSpinnerModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent {
  private router       = inject(Router);
  private dialog       = inject(MatDialog);
  readonly cartService = inject(CartService);
  readonly orderService = inject(OrderService);
  private snackBar     = inject(MatSnackBar);
  readonly cartItems = toSignal(this.cartService.items$, { initialValue: [] });

  readonly company = this.cartService.company;

  // ── Customer form state ──────────────────────────────────────────────
  readonly showOrderForm  = signal(false);
  readonly customerName   = signal('');
  readonly customerPhone  = signal('');
  readonly customerNote   = signal('');

  get formValid(): boolean {
    return this.customerName().trim().length >= 2 &&
           this.customerPhone().trim().replace(/\D/g, '').length >= 8;
  }

  getTotal(): number {
    return this.cartItems().reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }

  openOrderForm(): void {
    this.showOrderForm.set(true);
    // scroll to form on mobile
    setTimeout(() => {
      document.querySelector('.customer-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }

  cancelOrderForm(): void {
    this.showOrderForm.set(false);
    this.orderService.submitError.set(null);
  }

  submitOrder(): void {
    const company = this.cartService.company();
    const items   = this.cartItems();
    // || !this.formValid
    if (!company || items.length === 0 ) return;

    this.orderService
      .createOrderFromCart(
        this.customerName(),
        this.customerPhone(),
        items,
        company.slug,
        { note: this.customerNote(), whatsappSent: true },
      )
      .subscribe({
        next: () => {
          this.snack('✅ Commande enregistrée !');
          this.openWhatsApp(items, company);
          this.cartService.clearCart();
          this.showOrderForm.set(false);
        },
        error: () => {
          // API failed but saved locally — still open WhatsApp
          this.snack('⚠️ Hors-ligne : commande sauvegardée localement');
          this.openWhatsApp(items, company);
          this.cartService.clearCart();
          this.showOrderForm.set(false);
        },
      });
  }

  private openWhatsApp(items: CartItem[], company: { phone: string; name: string }): void {
    const url = this.orderService.buildWhatsAppUrl(company.phone, items, company.name);
    window.open(url, '_blank');
  }
  clearCart(): void {
    this.dialog.open<ConfirmDialogComponent, ConfirmDialogData, boolean>(
      ConfirmDialogComponent,
      { data: { title: 'Vider le panier', message: 'Supprimer tous les articles du panier ?', confirmLabel: 'Confirmer', icon: 'delete_sweep', color: '#c62828' }, width: '360px', autoFocus: false }
    ).afterClosed().subscribe(ok => {
      if (!ok) return;
      this.cartService.clearCart();
      // this.snack('Panier vidé');
    });
  }
  orderViaWhatsApp(): void {
    this.openOrderForm();
  }

  goBack(): void {
    const slug = this.cartService.company()?.slug;
    if (slug) {
      this.router.navigate(['/shop', slug]);
    } else {
      this.router.navigate(['/']);
    }
  }

  updateQty(productId: string, delta: number): void {
    const current = this.cartService.getItemQuantity(productId);
    this.cartService.updateQuantity(productId, current + delta);
  }

  remove(productId: string): void {
    this.cartService.removeProduct(productId);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  }

  
  private snack(msg: string): void {
    this.snackBar.open(msg, '', { duration: 2000, horizontalPosition: 'center', verticalPosition: 'top' });
  }

  isUrl(value?: string): boolean {
    return !!value && (value.startsWith('http') || value.startsWith('data:'));
  }

  onImgError(event: Event): void {
    const el = event.target as HTMLImageElement;
    el.style.display = 'none';
    const parent = el.parentElement;
    if (parent) {
      const span = document.createElement('span');
      span.className = 'product-emoji';
      span.textContent = '🛍️';
      parent.appendChild(span);
    }
  }
}
