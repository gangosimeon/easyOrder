import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CompanyRef {
  name: string;
  phone: string;
  slug: string;
  coverColor: string;
  description?: string;
  address?: string;
  logo?: string;   
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private _items = new BehaviorSubject<CartItem[]>([]);
  readonly items$ = this._items.asObservable();

  private _company = signal<CompanyRef | null>(null);
  readonly company = this._company.asReadonly();

  setCompany(info: CompanyRef): void {
    this._company.set(info);
  }

  private _categories = signal<Category[]>([]);
  readonly categories = this._categories.asReadonly();

  private _selectedCategoryId = signal<string | null>(null);
  readonly selectedCategoryId = this._selectedCategoryId.asReadonly();

  setCategories(cats: Category[]): void {
    this._categories.set(cats);
  }

  selectCategory(id: string | null): void {
    this._selectedCategoryId.set(id);
  }

  getItems(): CartItem[] {
    return this._items.getValue();
  }

  getTotal(): number {
    return this._items.getValue().reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }

  addProduct(product: Product): void {
    const current = this._items.getValue();
    const existing = current.find(i => i.product.id === product.id);
    if (existing) {
      this._items.next(
        current.map(i =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      this._items.next([...current, { product, quantity: 1 }]);
    }
  }

  removeProduct(productId: string): void {
    this._items.next(this._items.getValue().filter(i => i.product.id !== productId));
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeProduct(productId);
      return;
    }
    this._items.next(
      this._items.getValue().map(i =>
        i.product.id === productId ? { ...i, quantity } : i
      )
    );
  }

  clearCart(): void {
    this._items.next([]);
  }

  isInCart(productId: string): boolean {
    return this._items.getValue().some(i => i.product.id === productId);
  }

  getItemQuantity(productId: string): number {
    return this._items.getValue().find(i => i.product.id === productId)?.quantity ?? 0;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  }
}
