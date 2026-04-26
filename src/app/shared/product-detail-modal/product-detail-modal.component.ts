import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-product-detail-modal',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './product-detail-modal.component.html',
  styleUrls: ['./product-detail-modal.component.scss'],
})
export class ProductDetailModalComponent {
  @Input() product: Product | null = null;
  @Input() category: Category | undefined = undefined;
  @Input() coverColor: string | undefined = undefined;

  @Output() closed = new EventEmitter<void>();

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
    return this.coverColor ?? this.category?.color ?? '#4f46e5';
  }

  get discountedPrice(): number | null {
    if (!this.product?.promotion || !this.product?.originalPrice) return null;
    return this.product.originalPrice * (1 - this.product.promotion / 100);
  }
}
