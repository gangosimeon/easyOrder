import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CartService, CartItem } from '../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent {
  private router = inject(Router);
  readonly cartService = inject(CartService);

  readonly cartItems = toSignal(this.cartService.items$, { initialValue: [] });

  getTotal(): number {
    return this.cartItems().reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }

  generateWhatsAppMessage(items: CartItem[], companyName: string): string {
    let msg = `Bonjour, je souhaite commander chez ${companyName} :\n`;
    for (const item of items) {
      msg += `• ${item.product.name} (${item.quantity}x) : ${this.formatPrice(item.product.price * item.quantity)}\n`;
    }
    msg += `\nTotal : ${this.formatPrice(this.getTotal())}`;
    return msg;
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
}
