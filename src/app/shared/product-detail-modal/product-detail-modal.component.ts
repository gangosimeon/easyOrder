import { Component, Input, Output, EventEmitter, inject, signal, computed } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { toSignal } from '@angular/core/rxjs-interop';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-product-detail-modal',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './product-detail-modal.component.html',
  styleUrls: ['./product-detail-modal.component.scss'],
})
export class ProductDetailModalComponent {
  private _product = signal<Product | null>(null);
  private _category = signal<Category | undefined>(undefined);
  private _coverColor = signal<string | undefined>(undefined);

  @Input() set product(val: Product | null) { this._product.set(val); }
  get product(): Product | null { return this._product(); }

  @Input() set category(val: Category | undefined) { this._category.set(val); }
  get category(): Category | undefined { return this._category(); }

  @Input() set coverColor(val: string | undefined) { this._coverColor.set(val); }
  get coverColor(): string | undefined { return this._coverColor(); }

  @Output() closed = new EventEmitter<void>();

  private cartService = inject(CartService);
  private cartItems = toSignal(this.cartService.items$, { initialValue: [] });

  isInCart = computed(() =>
    this._product() ? this.cartItems().some(i => i.product.id === this._product()!.id) : false
  );

  cartQuantity = computed(() =>
    this._product() ? (this.cartItems().find(i => i.product.id === this._product()!.id)?.quantity ?? 0) : 0
  );

  addedFeedback = signal(false);

  addToCart(): void {
    const p = this._product();
    if (!p || !p.inStock) return;
    this.cartService.addProduct(p);
    this.addedFeedback.set(true);
    setTimeout(() => this.addedFeedback.set(false), 1500);
  }

  increment(): void {
    const p = this._product();
    if (!p) return;
    this.cartService.addProduct(p);
  }

  decrement(): void {
    const p = this._product();
    if (!p) return;
    this.cartService.updateQuantity(p.id, this.cartQuantity() - 1);
  }

  close(): void {
    this.closed.emit();
  }

  stopProp(e: MouseEvent): void {
    e.stopPropagation();
  }

  isUrl(value: string): boolean {
    return !!value && (value.startsWith('http') || value.startsWith('data:'));
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  }

  get accentColor(): string {
    return this._coverColor() ?? this._category()?.color ?? '#4f46e5';
  }

  get discountedPrice(): number | null {
    const p = this._product();
    if (!p?.promotion || !p?.originalPrice) return null;
    return p.originalPrice * (1 - p.promotion / 100);
  }
}
