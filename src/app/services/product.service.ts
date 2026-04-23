import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../models/product.model';

const STORAGE_KEY = 'burkina_shop_products';

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    categoryId: 'cat-1',
    name: 'Riz local 5kg',
    price: 3500,
    originalPrice: 4200,
    promotion: 17,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop%27',
    unit: 'sachet',
    stock: 50,
    createdAt: new Date('2024-01-10'),
    inStock: true
  },
  {
    id: 'prod-2',
    categoryId: 'cat-1',
    name: 'Huile de palme 1L',
    price: 1200,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwRpQAQaBK5UW_3LTnKO1xa9tARmwZVoFcmA&s',
    unit: 'litre',
    stock: 30,
    createdAt: new Date('2024-01-11'),
    inStock: true
  },
  {
    id: 'prod-3',
    categoryId: 'cat-1',
    name: 'Farine de maïs 2kg',
    price: 1800,
    originalPrice: 2200,
    promotion: 18,
    image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=600&auto=format&fit=crop',
    unit: 'sachet',
    stock: 25,
    createdAt: new Date('2024-01-12'),
    inStock: true
  },
  {
    id: 'prod-4',
    categoryId: 'cat-2',
    name: 'Eau minérale 1.5L',
    price: 500,
    image: 'https://images.unsplash.com/photo-1564419320461-6870880221ad?w=600&auto=format&fit=crop',
    unit: 'bouteille',
    stock: 100,
    createdAt: new Date('2024-01-10'),
    inStock: true
  },
  {
    id: 'prod-5',
    categoryId: 'cat-2',
    name: 'Jus de bissap',
    price: 350,
    image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=600&auto=format&fit=crop',
    unit: 'bouteille',
    stock: 45,
    createdAt: new Date('2024-01-11'),
    inStock: true
  },
  {
    id: 'prod-6',
    categoryId: 'cat-3',
    name: 'Tissu wax 6 yards',
    price: 8500,
    originalPrice: 10000,
    promotion: 15,
    image: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=600&auto=format&fit=crop',
    unit: 'pièce',
    stock: 15,
    createdAt: new Date('2024-01-13'),
    inStock: true
  },
  {
    id: 'prod-7',
    categoryId: 'cat-4',
    name: 'Téléphone basique',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop',
    unit: 'pièce',
    stock: 8,
    createdAt: new Date('2024-01-14'),
    inStock: true
  },
  {
    id: 'prod-8',
    categoryId: 'cat-5',
    name: 'Semences de sorgho',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1592928302636-c83cf1e1d7f3?w=600&auto=format&fit=crop',
    unit: 'kg',
    stock: 60,
    createdAt: new Date('2024-01-15'),
    inStock: true
  },
  {
    id: 'prod-9',
    categoryId: 'cat-6',
    name: 'Savon de karité',
    price: 500,
    originalPrice: 700,
    promotion: 29,
    image: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&auto=format&fit=crop',
    unit: 'pièce',
    stock: 40,
    createdAt: new Date('2024-01-16'),
    inStock: true
  }
];

@Injectable({ providedIn: 'root' })
export class ProductService {
  // ✅ Angular 20 — Signals API stable
  private _products = signal<Product[]>(this.loadFromStorage());

  /** Signal en lecture seule */
  readonly products = this._products.asReadonly();

  /** Signal calculé : compte par catégorie */
  readonly countByCategory = computed(() => {
    const map = new Map<string, number>();
    for (const p of this._products()) {
      map.set(p.categoryId, (map.get(p.categoryId) ?? 0) + 1);
    }
    return map;
  });

  private loadFromStorage(): Product[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return (JSON.parse(stored) as Product[]).map(p => ({
          ...p, createdAt: new Date(p.createdAt),
        }));
      }
    } catch { /* ignore */ }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_PRODUCTS));
    return MOCK_PRODUCTS;
  }

  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._products()));
  }

  getByCategory(categoryId: string): Product[] {
    return this._products().filter(p => p.categoryId === categoryId);
  }

  countForCategory(categoryId: string): number {
    return this.countByCategory().get(categoryId) ?? 0;
  }

  add(data: Omit<Product, 'id' | 'createdAt'>): Product {
    const prod: Product = { ...data, id: `prod-${Date.now()}`, createdAt: new Date() };
    this._products.update(list => [...list, prod]);
    this.persist();
    return prod;
  }

  update(id: string, changes: Partial<Product>): void {
    this._products.update(list =>
      list.map(p => p.id === id ? { ...p, ...changes } : p)
    );
    this.persist();
  }

  delete(id: string): void {
    this._products.update(list => list.filter(p => p.id !== id));
    this.persist();
  }

  deleteByCategory(categoryId: string): void {
    this._products.update(list => list.filter(p => p.categoryId !== categoryId));
    this.persist();
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  }
}
