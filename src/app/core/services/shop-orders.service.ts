import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject, catchError, debounceTime, distinctUntilChanged, interval, of, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

// ── Types ───────────────────────────────────────────────────────────────────

export interface OrderItem {
  productId: string;
  productName?: string;
  price: number;
  quantity: number;
  image: string;
  unit: string;
}

export interface Order {
  _id: string;
  shopId: string;
  customerName?: string;
  customerPhone?: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'delivered' | 'cancelled';
  whatsappSent: boolean;
  note?: string;
  deliveryMode?: 'delivery' | 'pickup';   // absent sur les anciennes commandes
  deliveryAddress?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderFilters {
  status?: 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'delivered' | 'cancelled';
  search?: string;
}

export interface PaginatedResponse {
  data: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// ── JWT Token Extraction ───────────────────────────────────────────────────

export interface JWTPayload {
  userId: string;
  phone: string;
  role: 'admin' | 'user';
  slug: string;
}

/** Identifiant d'une commande : `_id` est renommé en `id` par apiResponseInterceptor. */
export function orderKey(order: Order): string {
  return (order as unknown as { id?: string }).id ?? order._id;
}

// ── Service ──────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class ShopOrdersService {
  private http = inject(HttpClient);

  // ── State ────────────────────────────────────────────────────────────────

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly orders = signal<Order[]>([]);
  readonly totalCount = signal(0);
  readonly currentPage = signal(1);
  readonly pageSize = 20;
  readonly hasMore = computed(() => this.orders().length < this.totalCount());

  private pollingInterval = 30000; // 30 seconds
  /** Chaque nouvelle demande de page annule la précédente (recherche tapée vite, rechargement). */
  private pageRequests = new Subject<{ page: number; reset: boolean }>();
  private searchInput = new Subject<string>();

  // ── Filters ─────────────────────────────────────────────────────────────

  readonly searchQuery = signal('');
  readonly statusFilter = signal<'pending' | 'confirmed' | 'preparing' | 'delivering' | 'delivered' | 'cancelled' | ''>('');

  // ── Computed ─────────────────────────────────────────────────────────────

  // La recherche est faite par le serveur (sur toutes les commandes) ; seul le
  // filtre de statut reste appliqué localement.
  readonly filteredOrders = computed(() => {
    const status = this.statusFilter();
    return status ? this.orders().filter(order => order.status === status) : this.orders();
  });

  readonly displayCount = computed(() => this.filteredOrders().length);

  // ── Initialization ───────────────────────────────────────────────────────

  constructor() {
    this.pageRequests.pipe(
      switchMap(({ page, reset }) => this.fetchPage(page).pipe(
        tap(res => {
          const incoming = res.data || [];
          this.orders.update(existing => (reset ? incoming : this.appendUnique(existing, incoming)));
          this.currentPage.set(res.pagination.page);
          this.totalCount.set(res.pagination.total);
          this.loading.set(false);
        }),
        catchError(() => {
          this.error.set('Erreur lors du chargement des commandes');
          this.loading.set(false);
          return of(null);
        }),
      )),
    ).subscribe();

    this.searchInput.pipe(
      debounceTime(400),
      distinctUntilChanged(),
    ).subscribe(query => {
      this.searchQuery.set(query);
      this.loadOrders(true);
    });

    // Wait for token to be available before loading orders
    const token = localStorage.getItem('bs_token');
    if (token) {
      this.loadOrders();
    } else {
      // Retry after a short delay if token is not yet available
      setTimeout(() => {
        if (localStorage.getItem('bs_token')) {
          this.loadOrders();
        }
      }, 100);
    }
    this.setupAutoRefresh();
  }

  // ── Load Orders ─────────────────────────────────────────────────────────

  /** Recharge depuis la page 1 (le paramètre est conservé pour les appels existants). */
  loadOrders(_reset = true): void {
    this.error.set(null);
    this.loading.set(true);
    this.pageRequests.next({ page: 1, reset: true });
  }

  /** Bouton « Charger plus » : page suivante, ajoutée à la suite de la liste. */
  loadNext(): void {
    if (!this.hasMore() || this.loading()) return;
    this.error.set(null);
    this.loading.set(true);
    this.pageRequests.next({ page: this.currentPage() + 1, reset: false });
  }

  reload(): void {
    this.loadOrders(true);
  }

  private fetchPage(page: number): Observable<PaginatedResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', this.pageSize.toString());
    const search = this.searchQuery().trim();
    if (search) params = params.set('search', search);
    return this.http.get<PaginatedResponse>(`${environment.apiUrl}/orders`, { params });
  }

  /** Ajoute une page en ignorant les commandes déjà présentes (une nouvelle commande décale les pages). */
  private appendUnique(existing: Order[], incoming: Order[]): Order[] {
    const known = new Set(existing.map(orderKey));
    return [...existing, ...incoming.filter(o => !known.has(orderKey(o)))];
  }

  // ── Filter Actions ─────────────────────────────────────────────────────

  /** Recherche côté serveur, déclenchée 400 ms après la dernière frappe. */
  onSearchChange(query: string): void {
    this.searchInput.next(query.trim());
  }

  onStatusChange(status: 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'delivered' | 'cancelled' | ''): void {
    this.statusFilter.set(status);
  }

  clearFilters(): void {
    this.statusFilter.set('');
    this.searchInput.next('');
  }

  // ── Auto Refresh (Polling) ───────────────────────────────────────────────

  /**
   * Toutes les 30 s : récupère la première page et fusionne — nouvelles
   * commandes ajoutées en haut, commandes connues mises à jour — sans toucher
   * aux pages déjà chargées ni ramener le commerçant en haut de la liste.
   */
  private setupAutoRefresh(): void {
    interval(this.pollingInterval).pipe(
      switchMap(() => {
        if (document.hidden || !localStorage.getItem('bs_token')) return of(null);
        // Une erreur ponctuelle (réseau) ne doit pas arrêter l'actualisation.
        return this.fetchPage(1).pipe(catchError(() => of(null)));
      }),
    ).subscribe(res => {
      if (!res) return;
      const fresh = res.data || [];
      const freshById = new Map(fresh.map(o => [orderKey(o), o]));
      this.orders.update(existing => {
        const known = new Set(existing.map(orderKey));
        const added = fresh.filter(o => !known.has(orderKey(o)));
        return [...added, ...existing.map(o => freshById.get(orderKey(o)) ?? o)];
      });
      this.totalCount.set(res.pagination.total);
    });
  }

  manualRefresh(): void {
    this.reload();
  }

  // ── Update Status ─────────────────────────────────────────────────────

  updateOrderStatus(orderId: string, status: 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'delivered' | 'cancelled'): Observable<Order> {
    return this.http.patch<Order>(`${environment.apiUrl}/orders/${orderId}`, { status }).pipe(
      tap(updatedOrder => {
        this.orders.update(orders =>
          orders.map(o => (orderKey(o) === orderId ? { ...o, ...updatedOrder } : o)),
        );
      }),
      catchError(err => {
        this.error.set('Erreur lors de la mise à jour du statut');
        throw err;
      }),
    );
  }

  // ── Quick Actions ───────────────────────────────────────────────────────

  buildWhatsAppUrl(order: Order): string {
    const orderId = (order as any)._id || (order as any).id || '';
    const lines = order.items
      .map(i => `• *${i.productName}* ×${i.quantity} — ${this.fmt(i.price * i.quantity)}`)
      .join('\n');

    const msg =
      `🛒 *Commande #${orderId.slice(-6)}*\n` +
      `Client : ${order.customerName}\n` +
      `Tél : ${order.customerPhone}\n` +
      (order.deliveryMode === 'delivery' ? `Livraison : ${order.deliveryAddress}\n` : '') +
      (order.deliveryMode === 'pickup' ? `Retrait en boutique\n` : '') +
      `━━━━━━━━━━━━━━━━━━\n` +
      `${lines}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `💰 *Total : ${this.fmt(order.total)}*\n` +
      `Statut : ${this.getStatusLabel(order.status)}`;

    const cleanPhone = order.customerPhone?.replace(/[\s\-\+]/g, '') || '';
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
  }

  buildCallUrl(phone: string): string {
    return `tel:${phone.replace(/[\s\-\+]/g, '')}`;
  }

  // ── Helpers ────────────────────────────────────────────────────────────

  fmt(price: number): string {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    if (diffDays < 7) return `Il y a ${diffDays} j`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  }

  getStatusColor(status: string): string {
    const colors = {
      pending: '#f59e0b',
      confirmed: '#10b981',
      delivered: '#3b82f6',
      cancelled: '#ef4444',
    };
    return colors[status as keyof typeof colors] || '#6b7280';
  }

  getStatusLabel(status: string): string {
    const labels = {
      pending: 'En attente',
      confirmed: 'Confirmé',
      delivered: 'Livré',
      cancelled: 'Annulé',
    };
    return labels[status as keyof typeof labels] || status;
  }
}
