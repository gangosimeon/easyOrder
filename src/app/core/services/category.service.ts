import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../../models/category.model';
import { AuthService } from './auth.service';

function parseCategory(c: Category): Category {
  return { ...c, createdAt: new Date(c.createdAt) };
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  private _categories = signal<Category[]>([]);

  readonly categories = this._categories.asReadonly();
  readonly count      = computed(() => this._categories().length);

  constructor() {
    effect(() => {
      if (this.auth.isLoggedIn()) {
        this.loadAll();
      } else {
        this._categories.set([]);
      }
    });
  }

  private loadAll(): void {
    this.http.get<Category[]>('/api/categories').subscribe({
      next: cats => this._categories.set(cats.map(parseCategory)),
      error: ()  => this._categories.set([]),
    });
  }

  getById(id: string): Category | undefined {
    return this._categories().find(c => c.id === id);
  }

  add(data: Omit<Category, 'id' | 'createdAt'>): void {
    this.http.post<Category>('/api/categories', data).subscribe({
      next: cat => this._categories.update(list => [...list, parseCategory(cat)]),
    });
  }

  update(id: string, changes: Partial<Category>): void {
    this.http.put<Category>(`/api/categories/${id}`, changes).subscribe({
      next: cat => this._categories.update(list =>
        list.map(c => c.id === id ? parseCategory(cat) : c)
      ),
    });
  }

  delete(id: string): void {
    this.http.delete(`/api/categories/${id}`).subscribe({
      next: () => this._categories.update(list => list.filter(c => c.id !== id)),
    });
  }
}
