import { Injectable, signal, computed } from '@angular/core';
import { Annonce } from '../../models/annonce.model';

const STORAGE_KEY = 'burkina_shop_annonces';

const today    = new Date();
const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
const nextWeek = new Date(today); nextWeek.setDate(today.getDate() + 7);

const MOCK_ANNONCES: Annonce[] = [
  {
    id: 'ann-1',
    titre: 'Grande Promotion du Vendredi !',
    message: '🔥 Jusqu\'à -30% sur tous les produits alimentaires ce vendredi. Ne manquez pas cette offre exceptionnelle !',
    type: 'promo',
    emoji: '🔥',
    dateDebut: today,
    dateFin: nextWeek,
    active: true,
    epinglee: true,
    createdAt: new Date(),
  },
  {
    id: 'ann-2',
    titre: 'Nouveaux arrivages de tissus wax',
    message: '🎉 Nouveaux modèles de tissu wax disponibles ! Venez découvrir notre nouvelle collection de pagnes 100% coton.',
    type: 'info',
    emoji: '🎉',
    dateDebut: today,
    active: true,
    epinglee: false,
    createdAt: new Date(),
  },
  {
    id: 'ann-3',
    titre: 'Fermeture exceptionnelle demain',
    message: '⚠️ La boutique sera fermée demain pour fête nationale. Nous reprenons le service après-demain. Merci de votre compréhension.',
    type: 'alerte',
    emoji: '⚠️',
    dateDebut: today,
    dateFin: tomorrow,
    active: true,
    epinglee: true,
    createdAt: new Date(),
  },
  {
    id: 'ann-4',
    titre: 'Foire Agricole de Ouagadougou',
    message: '🌾 Participez à la Foire Agricole ! Retrouvez-nous au stand B12 avec nos meilleurs semences et engrais.',
    type: 'evenement',
    emoji: '🌾',
    dateDebut: nextWeek,
    active: true,
    epinglee: false,
    createdAt: new Date(),
  },
];

@Injectable({ providedIn: 'root' })
export class AnnonceService {
  private _annonces = signal<Annonce[]>(this.loadFromStorage());

  readonly annonces = this._annonces.asReadonly();

  // ✅ Signals calculés
  readonly actives  = computed(() => this._annonces().filter(a => a.active));
  readonly epinglees = computed(() => this._annonces().filter(a => a.epinglee && a.active));
  readonly count    = computed(() => this._annonces().length);
  readonly countActives = computed(() => this.actives().length);

  private loadFromStorage(): Annonce[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return (JSON.parse(stored) as Annonce[]).map(a => ({
          ...a,
          createdAt:  new Date(a.createdAt),
          dateDebut:  new Date(a.dateDebut),
          dateFin:    a.dateFin ? new Date(a.dateFin) : undefined,
        }));
      }
    } catch { /* ignore */ }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_ANNONCES));
    return MOCK_ANNONCES;
  }

  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._annonces()));
  }

  add(data: Omit<Annonce, 'id' | 'createdAt'>): Annonce {
    const annonce: Annonce = { ...data, id: `ann-${Date.now()}`, createdAt: new Date() };
    this._annonces.update(list => [annonce, ...list]);
    this.persist();
    return annonce;
  }

  update(id: string, changes: Partial<Annonce>): void {
    this._annonces.update(list =>
      list.map(a => a.id === id ? { ...a, ...changes } : a)
    );
    this.persist();
  }

  toggleActive(id: string): void {
    this._annonces.update(list =>
      list.map(a => a.id === id ? { ...a, active: !a.active } : a)
    );
    this.persist();
  }

  toggleEpinglee(id: string): void {
    this._annonces.update(list =>
      list.map(a => a.id === id ? { ...a, epinglee: !a.epinglee } : a)
    );
    this.persist();
  }

  delete(id: string): void {
    this._annonces.update(list => list.filter(a => a.id !== id));
    this.persist();
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
  }

  isExpired(annonce: Annonce): boolean {
    if (!annonce.dateFin) return false;
    return annonce.dateFin < new Date();
  }
}
