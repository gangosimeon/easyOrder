import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Annonce } from '../../models/annonce.model';
import { AuthService } from './auth.service';

function parseAnnonce(a: Annonce): Annonce {
  return {
    ...a,
    createdAt: new Date(a.createdAt),
    dateDebut: new Date(a.dateDebut),
    dateFin:   a.dateFin ? new Date(a.dateFin) : undefined,
  };
}

@Injectable({ providedIn: 'root' })
export class AnnonceService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  private _annonces = signal<Annonce[]>([]);

  readonly annonces     = this._annonces.asReadonly();
  readonly actives      = computed(() => this._annonces().filter(a => a.active));
  readonly epinglees    = computed(() => this._annonces().filter(a => a.epinglee && a.active));
  readonly count        = computed(() => this._annonces().length);
  readonly countActives = computed(() => this.actives().length);

  constructor() {
    effect(() => {
      if (this.auth.isLoggedIn()) {
        this.loadAll();
      } else {
        this._annonces.set([]);
      }
    });
  }

  private loadAll(): void {
    this.http.get<Annonce[]>('/api/annonces').subscribe({
      next: list => this._annonces.set(list.map(parseAnnonce)),
      error: ()  => this._annonces.set([]),
    });
  }

  add(data: Omit<Annonce, 'id' | 'createdAt'>): void {
    this.http.post<Annonce>('/api/annonces', data).subscribe({
      next: ann => this._annonces.update(list => [parseAnnonce(ann), ...list]),
    });
  }

  update(id: string, changes: Partial<Annonce>): void {
    this.http.put<Annonce>(`/api/annonces/${id}`, changes).subscribe({
      next: ann => this._annonces.update(list =>
        list.map(a => a.id === id ? parseAnnonce(ann) : a)
      ),
    });
  }

  toggleActive(id: string): void {
    this.http.patch<Annonce>(`/api/annonces/${id}/toggle-active`, {}).subscribe({
      next: ann => this._annonces.update(list =>
        list.map(a => a.id === id ? parseAnnonce(ann) : a)
      ),
    });
  }

  toggleEpinglee(id: string): void {
    this.http.patch<Annonce>(`/api/annonces/${id}/toggle-epinglee`, {}).subscribe({
      next: ann => this._annonces.update(list =>
        list.map(a => a.id === id ? parseAnnonce(ann) : a)
      ),
    });
  }

  delete(id: string): void {
    this.http.delete(`/api/annonces/${id}`).subscribe({
      next: () => this._annonces.update(list => list.filter(a => a.id !== id)),
    });
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
  }

  isExpired(annonce: Annonce): boolean {
    if (!annonce.dateFin) return false;
    return annonce.dateFin < new Date();
  }
}
