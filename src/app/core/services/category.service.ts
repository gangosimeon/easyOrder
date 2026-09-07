import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Category } from '../../models/category.model';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

function parseCategory(c: Category): Category {
  return { ...c, createdAt: new Date(c.createdAt) };
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  private _categories = signal<Category[]>([]);
  private _loading    = signal(false);

  private readonly apiUrl = environment.apiUrl;
  readonly categories = this._categories.asReadonly();
  readonly loading    = this._loading.asReadonly();
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
    this._loading.set(true);
    this.http.get<Category[]>(`${this.apiUrl}/categories`).subscribe({
      next: cats => { this._categories.set(cats.map(parseCategory)); this._loading.set(false); },
      error: ()  => { this._categories.set([]); this._loading.set(false); },
    });
  }

  reload(): void {
    if (this.auth.isLoggedIn()) {
      this.loadAll();
    }
  }

  getById(id: string): Category | undefined {
    return this._categories().find(c => c.id === id);
  }

  add(data: Omit<Category, 'id' | 'createdAt'>) {
    return this.http.post<Category>(`${this.apiUrl}/categories`, data).pipe(
      tap(cat => this._categories.update(list => [...list, parseCategory(cat)]))
    );
  }

  update(id: string, changes: Partial<Category>) {
    return this.http.put<Category>(`${this.apiUrl}/categories/${id}`, changes).pipe(
      tap(cat => this._categories.update(list =>
        list.map(c => c.id === id ? parseCategory(cat) : c)
      ))
    );
  }

  delete(id: string) {
    return this.http.delete(`${this.apiUrl}/categories/${id}`).pipe(
      tap(() => this._categories.update(list => list.filter(c => c.id !== id)))
    );
  }

  /**
   * Vérification côté client (UX rapide) : le backend reste la seule
   * source de vérité — voir POST/PUT /api/categories, contrainte d'unicité
   * {shopId, normalizedName}.
   */
  isNameTaken(name: string, excludeId?: string): boolean {
    const normalized = name.trim().toLowerCase();
    if (!normalized) return false;
    return this._categories().some(c =>
      c.id !== excludeId && c.name.trim().toLowerCase() === normalized
    );
  }
}
