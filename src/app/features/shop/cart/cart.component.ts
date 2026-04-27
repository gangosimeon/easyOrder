import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService, CartItem } from '../../../core/services/cart.service';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatDialogModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent {
  private router  = inject(Router);
  private dialog  = inject(MatDialog);
  readonly cartService = inject(CartService);
  private snackBar    = inject(MatSnackBar);
  readonly cartItems = toSignal(this.cartService.items$, { initialValue: [] });

  readonly company = this.cartService.company;

  getTotal(): number {
    return this.cartItems().reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }

  generateWhatsAppMessage(items: CartItem[], companyName: string): string {
    let msg = `Bonjour, je souhaite commander chez *${companyName}* :\n\n`;

    let total = 0;

    for (const item of items) {
      const productTotal = item.product.price * item.quantity;
      total += productTotal;
      msg += `*${item.product.name}*\n`;
      msg += `    Quantité : ${item.quantity}x\n`;
      msg += `    Prix : ${this.formatPrice(productTotal)}\n`;

      if (item.product.image) {
        msg += `    Image : ${item.product.image}\n`;
      }
      msg += `\n`;
    }
    msg += ` *TOTAL : ${this.formatPrice(total)}*\n\n`;
    msg += `Merci de me confirmer la disponibilité 🙏`;
    return msg;
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
    const company = this.cartService.company();
    const items = this.cartItems();
    if (!company || items.length === 0) return;
    const message = this.generateWhatsAppMessage(items, company.name);
    const url = `https://wa.me/${company.phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
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
