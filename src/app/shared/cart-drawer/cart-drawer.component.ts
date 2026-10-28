import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatRippleModule } from '@angular/material/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CartService, CartItem } from '../../core/services/cart.service';
import { DeliveryMode } from '../../core/services/order.mapper';
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
  readonly countryCode   = signal(this.cartService.company()?.countryCode || '226');
  readonly customerNote  = signal('');
  readonly submitted     = signal(false);
  readonly honeypot      = signal('');   // champ caché anti-robot
  readonly deliveryMode    = signal<DeliveryMode>('delivery');
  readonly deliveryAddress = signal('');

  onPhoneChange(val: string): void {
    this.customerPhone.set(val);
    this.submitted.set(false);
  }

  get isPhoneValid(): boolean { return isValidPhone(this.countryCode(), this.customerPhone()); }
  /** En livraison, un quartier ou repère est indispensable : les adresses postales sont rares. */
  get isAddressValid(): boolean {
    return this.deliveryMode() === 'pickup' || this.deliveryAddress().trim().length >= 3;
  }

  get formValid():    boolean { return this.customerName().trim().length >= 2 && this.isPhoneValid && this.isAddressValid; }

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

    this.orderService
      .checkout(items, company, {
        customerName:  this.customerName().trim(),
        customerPhone: this.countryCode() + this.customerPhone(),
        note:          this.customerNote(),
        deliveryMode:  this.deliveryMode(),
        deliveryAddress: this.deliveryAddress(),
        website:       this.honeypot(),
      })
      .subscribe(outcome => {
        if (outcome.status === 'rejected') return;   // message affiché par submitError
        this.snack(outcome.status === 'saved'
          ? `✅ Commande ${outcome.reference} enregistrée`
          : '📶 Connexion faible : commande gardée sur cet appareil, elle sera envoyée automatiquement');
        this.cartService.clearCart();
        this.showOrderForm.set(false);
        this.drawerService.close();
      });
  }

  private snack(msg: string): void {
    this.snackBar.open(msg, '', { duration: 4000, horizontalPosition: 'center', verticalPosition: 'top' });
  }
}
