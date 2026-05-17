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
  private readonly COMPANY_KEY = 'shop_company_ref';
  private readonly CART_KEY    = 'shop_cart_items';

  private _items = new BehaviorSubject<CartItem[]>(this._restoreItems());
  readonly items$ = this._items.asObservable();

  constructor() {
    this._items.subscribe(items => {
      try { localStorage.setItem(this.CART_KEY, JSON.stringify(items)); } catch { /* ignore */ }
    });
  }

  private _restoreItems(): CartItem[] {
    try {
      const raw = localStorage.getItem(this.CART_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  }

  private _company = signal<CompanyRef | null>(this._restoreCompany());
  readonly company = this._company.asReadonly();

  private _restoreCompany(): CompanyRef | null {
    try {
      const raw = localStorage.getItem(this.COMPANY_KEY);
      return raw ? (JSON.parse(raw) as CompanyRef) : null;
    } catch {
      return null;
    }
  }

  setCompany(info: CompanyRef): void {
    this._company.set(info);
    try { localStorage.setItem(this.COMPANY_KEY, JSON.stringify(info)); } catch { /* ignore */ }
  }

  private readonly CATEGORIES_KEY = 'shop_categories';

  private _categories = signal<Category[]>(this._restoreCategories());
  readonly categories = this._categories.asReadonly();

  private _restoreCategories(): Category[] {
    try {
      const raw = localStorage.getItem(this.CATEGORIES_KEY);
      return raw ? (JSON.parse(raw) as Category[]) : [];
    } catch {
      return [];
    }
  }

  private _selectedCategoryId = signal<string | null>(null);
  readonly selectedCategoryId = this._selectedCategoryId.asReadonly();

  setCategories(cats: Category[]): void {
    this._categories.set(cats);
    try { localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(cats)); } catch { /* ignore */ }
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
