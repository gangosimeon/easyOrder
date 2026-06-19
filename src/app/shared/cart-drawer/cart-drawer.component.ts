import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatRippleModule } from '@angular/material/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CartService, CartItem } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { CartDrawerService } from '../../core/services/cart-drawer.service';
import { PhoneInputComponent } from '../phone-input/phone-input.component';
import { isValidPhone } from '../phone-input/phone-validator';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [MatIconModule, MatProgressSpinnerModule, MatRippleModule, FormsModule, PhoneInputComponent],
  templateUrl: './cart-drawer.component.html',
  styleUrl:    './cart-drawer.component.scss',
})
export class CartDrawerComponent {
  readonly drawerService = inject(CartDrawerService);
  readonly cartService   = inject(CartService);
  readonly orderService  = inject(OrderService);
  private  snackBar      = inject(MatSnackBar);

  readonly cartItems = toSignal(this.cartService.items$, { initialValue: [] });
  readonly company   = this.cartService.company;

  readonly showOrderForm = signal(false);
  readonly customerName  = signal('');
  readonly customerPhone = signal('');
  readonly countryCode   = signal('226');
  readonly customerNote  = signal('');
  readonly submitted     = signal(false);

  onPhoneChange(val: string): void {
    this.customerPhone.set(val);
    this.submitted.set(false);
  }

  get isPhoneValid(): boolean { return isValidPhone(this.countryCode(), this.customerPhone()); }
  get formValid():    boolean { return this.customerName().trim().length >= 2 && this.isPhoneValid; }

  getTotal(): number {
    return this.cartItems().reduce((s, i) => s + i.product.price * i.quantity, 0);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  }

  updateQty(productId: string, delta: number): void {
    const cur = this.cartService.getItemQuantity(productId);
    this.cartService.updateQuantity(productId, cur + delta);
  }

  remove(productId: string): void { this.cartService.removeProduct(productId); }

  clearCart(): void { this.cartService.clearCart(); }

  orderViaWhatsApp(): void { this.showOrderForm.set(true); }

  cancelOrderForm(): void {
    this.showOrderForm.set(false);
    this.orderService.submitError.set(null);
  }

  submitOrder(): void {
    this.submitted.set(true);
    const company = this.cartService.company();
    const items   = this.cartItems();
    if (!company || items.length === 0 || !this.formValid) return;

    const fullPhone = this.countryCode() + this.customerPhone();

    this.orderService
      .createOrderFromCart(this.customerName(), fullPhone, items, company.slug,
        { note: this.customerNote(), whatsappSent: true })
      .subscribe({
        next:  () => this.afterOrder(items, company),
        error: () => {
          this.snack('⚠️ Hors-ligne : commande sauvegardée localement');
          this.afterOrder(items, company);
        },
      });
  }

  private afterOrder(items: CartItem[], company: { phone: string; fullPhone?: string; name: string }): void {
    this.snack('✅ Commande enregistrée !');
    const phone = (company.fullPhone ?? company.phone).replace(/\D/g, '');
    window.open(this.orderService.buildWhatsAppUrl(phone, items, company.name), '_blank');
    this.cartService.clearCart();
    this.showOrderForm.set(false);
    this.drawerService.close();
  }

  private snack(msg: string): void {
    this.snackBar.open(msg, '', { duration: 2500, horizontalPosition: 'center', verticalPosition: 'top' });
  }
}
