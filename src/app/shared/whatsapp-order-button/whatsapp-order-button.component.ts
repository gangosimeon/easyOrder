import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CartService, CartItem } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { PhoneInputComponent } from '../phone-input/phone-input.component';

@Component({
  selector: 'app-whatsapp-order-button',
  standalone: true,
  imports: [FormsModule, MatDialogModule, MatProgressSpinnerModule, PhoneInputComponent],
  templateUrl: './whatsapp-order-button.component.html',
  styleUrls: ['./whatsapp-order-button.component.scss'],
})
export class WhatsAppOrderButtonComponent {
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  // ── State ────────────────────────────────────────────────────────────────

  readonly cartItems = toSignal(this.cartService.items$, { initialValue: [] });
  readonly company = this.cartService.company;

  readonly showForm = signal(false);
  readonly customerName = signal('');
  readonly customerPhone = signal('');
  readonly countryCode = signal('226');
  readonly customerNote = signal('');
  readonly submitted = signal(false);

  readonly submitting = this.orderService.submitting;
  readonly submitError = this.orderService.submitError;

  // ── Computed ─────────────────────────────────────────────────────────────

  readonly itemCount = signal(0);
  readonly total = signal(0);
  readonly isEmpty = signal(true);
  readonly isDisabled = signal(true);

  constructor() {
    // Computed values from cart items
    this.updateComputed();
  }

  private updateComputed(): void {
    const items = this.cartItems();
    const count = items.length;
    const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0);

    this.itemCount.set(count);
    this.total.set(total);
    this.isEmpty.set(count === 0);
    this.isDisabled.set(count === 0);
  }

  // ── Form validation ───────────────────────────────────────────────────────

  get phoneDigits(): number {
    return this.customerPhone().replace(/\D/g, '').length;
  }

  get formValid(): boolean {
    return this.customerName().trim().length >= 2 && this.phoneDigits >= 5;
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  openForm(): void {
    this.showForm.set(true);
    // Scroll to form on mobile
    setTimeout(() => {
      document.querySelector('.wa-order-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.customerName.set('');
    this.customerPhone.set('');
    this.countryCode.set('226');
    this.customerNote.set('');
    this.submitted.set(false);
    this.orderService.submitError.set(null);
  }

  submitOrder(): void {
    this.submitted.set(true);
    const company = this.company();
    const items = this.cartItems();
    if (!company || items.length === 0 || !this.formValid) return;

    const fullPhone = this.countryCode() + this.customerPhone();

    this.orderService
      .createOrderFromCart(
        this.customerName(),
        fullPhone,
        items,
        company.slug,
        { note: this.customerNote(), whatsappSent: true },
      )
      .subscribe({
        next: () => {
          this.snack('✅ Commande enregistrée !');
          this.openWhatsApp(items, company);
          this.cartService.clearCart();
          this.closeForm();
        },
        error: () => {
          // API failed but saved locally — still open WhatsApp
          this.snack('⚠️ Hors-ligne : commande sauvegardée localement');
          this.openWhatsApp(items, company);
          this.cartService.clearCart();
          this.closeForm();
        },
      });
  }

  private openWhatsApp(items: CartItem[], company: { phone: string; name: string }): void {
    const url = this.orderService.buildWhatsAppUrl(company.phone, items, company.name);
    window.open(url, '_blank');
  }

  private snack(message: string): void {
    this.snackBar.open(message, '', { duration: 3000, panelClass: ['wa-snackbar'] });
  }

  // ── Format helpers ────────────────────────────────────────────────────────

  fmt(price: number): string {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  }
}
