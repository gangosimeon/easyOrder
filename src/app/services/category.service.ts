import { Injectable, signal, computed } from '@angular/core';
import { Category } from '../models/category.model';

const STORAGE_KEY = 'burkina_shop_categories';

const MOCK_CATEGORIES: Category[] = [
  { id:'cat-1', name:'Alimentation', icon:'lunch_dining', color:'#FF6B35', description:'Nourriture et épicerie', createdAt: new Date('2024-01-01') },
  { id:'cat-2', name:'Boissons',     icon:'local_drink',  color:'#1E88E5', description:'Eau, jus, sodas',       createdAt: new Date('2024-01-02') },
  { id:'cat-3', name:'Vêtements',   icon:'checkroom',    color:'#8E24AA', description:'Habits et tissus',      createdAt: new Date('2024-01-03') },
  { id:'cat-4', name:'Électronique', icon:'devices',      color:'#00ACC1', description:'Téléphones et appareils', createdAt: new Date('2024-01-04') },
  { id:'cat-5', name:'Agriculture',  icon:'grass',        color:'#43A047', description:'Semences et engrais',   createdAt: new Date('2024-01-05') },
  { id:'cat-6', name:'Beauté',       icon:'face',         color:'#E91E63', description:'Cosmétiques et soins',  createdAt: new Date('2024-01-06') },
];

@Injectable({ providedIn: 'root' })
export class CategoryService {
  // ✅ Angular 20 — Signals API stable
  private _categories = signal<Category[]>(this.loadFromStorage());

  /** Signal en lecture seule exposé aux composants */
  readonly categories = this._categories.asReadonly();

  /** Signal calculé : nombre total de catégories */
  readonly count = computed(() => this._categories().length);

  private loadFromStorage(): Category[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return (JSON.parse(stored) as Category[]).map(c => ({
          ...c, createdAt: new Date(c.createdAt),
        }));
      }
    } catch { /* ignore */ }
    const init = MOCK_CATEGORIES;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(init));
    return init;
  }

  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._categories()));
  }

  getById(id: string): Category | undefined {
    return this._categories().find(c => c.id === id);
  }

  add(data: Omit<Category, 'id' | 'createdAt'>): Category {
    const cat: Category = { ...data, id: `cat-${Date.now()}`, createdAt: new Date() };
    this._categories.update(list => [...list, cat]);
    this.persist();
    return cat;
  }

  update(id: string, changes: Partial<Category>): void {
    this._categories.update(list =>
      list.map(c => c.id === id ? { ...c, ...changes } : c)
    );
    this.persist();
  }

  delete(id: string): void {
    this._categories.update(list => list.filter(c => c.id !== id));
    this.persist();
  }
}
