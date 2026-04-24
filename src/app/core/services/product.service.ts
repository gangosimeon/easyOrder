import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Product } from '../../models/product.model';

function parseProduct(p: Product): Product {
  return { ...p, createdAt: new Date(p.createdAt) };
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  private _products = signal<Product[]>([]);

  readonly products = this._products.asReadonly();

  readonly countByCategory = computed(() => {
    const map = new Map<string, number>();
    for (const p of this._products()) {
      map.set(p.categoryId, (map.get(p.categoryId) ?? 0) + 1);
    }
    return map;
  });

  constructor() {
    effect(() => {
      if (this.auth.isLoggedIn()) {
        this.loadAll();
      } else {
        this._products.set([]);
      }
    });
  }

  private loadAll(): void {
    this.http.get<Product[]>('/api/products').subscribe({
      next: prods => this._products.set(prods.map(parseProduct)),
      error: ()   => this._products.set([]),
    });
  }

  getByCategory(categoryId: string): Product[] {
    return this._products().filter(p => p.categoryId === categoryId);
  }

  countForCategory(categoryId: string): number {
    return this.countByCategory().get(categoryId) ?? 0;
  }

  add(data: Omit<Product, 'id' | 'createdAt'>): void {
    this.http.post<Product>('/api/products', data).subscribe({
      next: prod => this._products.update(list => [...list, parseProduct(prod)]),
    });
  }

  update(id: string, changes: Partial<Product>): void {
    this.http.put<Product>(`/api/products/${id}`, changes).subscribe({
      next: prod => this._products.update(list =>
        list.map(p => p.id === id ? parseProduct(prod) : p)
      ),
    });
  }

  delete(id: string): void {
    this.http.delete(`/api/products/${id}`).subscribe({
      next: () => this._products.update(list => list.filter(p => p.id !== id)),
    });
  }

  deleteByCategory(categoryId: string): void {
    this._products.update(list => list.filter(p => p.categoryId !== categoryId));
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  }
}
