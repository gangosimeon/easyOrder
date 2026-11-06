import { Component, Input, Output, EventEmitter, inject, signal, computed, effect, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { toSignal } from '@angular/core/rxjs-interop';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { CartService } from '../../core/services/cart.service';
import { cloudinaryThumb } from '../../core/utils/cloudinary.util';

@Component({
  selector: 'app-product-detail-modal',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './product-detail-modal.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
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

  private _relatedProducts = signal<Product[]>([]);

  @Input() set relatedProducts(val: Product[] | null | undefined) { this._relatedProducts.set(val ?? []); }
  get relatedProducts(): Product[] { return this._relatedProducts(); }

  /** Boutique publique : affiche « Partager » et « Commander ». Désactivé côté commerçant. */
  @Input() buyerActions = false;

  @Output() closed = new EventEmitter<void>();
  @Output() share = new EventEmitter<Product>();
  @Output() orderNow = new EventEmitter<Product>();
  @Output() productSelected = new EventEmitter<Product>();
  @Output() viewCategory = new EventEmitter<string>();
  @Output() cartClicked = new EventEmitter<void>();

  @ViewChild('scrollArea') private scrollAreaRef?: ElementRef<HTMLElement>;

  private cartService = inject(CartService);

  constructor() {
    effect(() => {
      this._product(); // s'abonne au signal
      this.descExpanded.set(false);
      this.scrollAreaRef?.nativeElement.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  private cartItems = toSignal(this.cartService.items$, { initialValue: [] });

  isInCart = computed(() =>
    this._product() ? this.cartItems().some(i => i.product.id === this._product()!.id) : false
  );

  cartQuantity = computed(() =>
    this._product() ? (this.cartItems().find(i => i.product.id === this._product()!.id)?.quantity ?? 0) : 0
  );

  cartTotalItems = computed(() =>
    this.cartItems().reduce((sum, i) => sum + i.quantity, 0)
  );

  addedFeedback = signal(false);
  descExpanded = signal(false);

  readonly isDescLong = computed(() => (this._product()?.description?.length ?? 0) > 160);

  toggleDesc(): void { this.descExpanded.update(v => !v); }

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

  onShare(): void {
    const p = this._product();
    if (p) this.share.emit(p);
  }

  onOrderNow(): void {
    const p = this._product();
    if (p?.inStock) this.orderNow.emit(p);
  }

  close(): void {
    this.closed.emit();
  }

  stopProp(e: MouseEvent): void {
    e.stopPropagation();
  }

  onCartClick(): void {
    this.cartClicked.emit();
  }

  selectRelated(product: Product): void {
    this.productSelected.emit(product);
  }

  onViewCategory(): void {
    const catId = this._product()?.categoryId;
    if (catId) this.viewCategory.emit(catId);
  }

  isUrl(value: string): boolean {
    return !!value && (value.startsWith('http') || value.startsWith('data:'));
  }

  thumbUrl(url: string): string {
    return cloudinaryThumb(url, 160, 160);
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
