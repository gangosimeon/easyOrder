import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of, tap, interval, switchMap, startWith, Subject } from 'rxjs';
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
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  whatsappSent: boolean;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderFilters {
  status?: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
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
  readonly hasMore = signal(true);

  private refreshTrigger = new Subject<void>();
  private pollingInterval = 30000; // 30 seconds

  // ── Computed ─────────────────────────────────────────────────────────────

  readonly filteredOrders = computed(() => {
    const orders = this.orders();
    const search = this.searchQuery().toLowerCase();
    const status = this.statusFilter();

    return orders.filter(order => {
      // Search filter
      if (search) {
        const matchName = order.customerName?.toLowerCase().includes(search) ?? false;
        const matchPhone = order.customerPhone?.includes(search) ?? false;
        if (!matchName && !matchPhone) return false;
      }

      // Status filter
      if (status && order.status !== status) return false;

      return true;
    });
  });

  readonly displayCount = computed(() => this.filteredOrders().length);

  // ── Filters ─────────────────────────────────────────────────────────────

  readonly searchQuery = signal('');
  readonly statusFilter = signal<'pending' | 'confirmed' | 'delivered' | 'cancelled' | ''>('');

  // ── Initialization ───────────────────────────────────────────────────────

  constructor() {
    // Wait for token to be available before loading orders
    const token = sessionStorage.getItem('bs_token');
    if (token) {
      this.loadOrders();
    } else {
      // Retry after a short delay if token is not yet available
      setTimeout(() => {
        if (sessionStorage.getItem('bs_token')) {
          this.loadOrders();
        }
      }, 100);
    }
    this.setupAutoRefresh();
  }

  // ── Load Orders ─────────────────────────────────────────────────────────

  loadOrders(reset = false): void {
    this.error.set(null);
    if (reset) {
      this.currentPage.set(1);
      this.orders.set([]);
      this.hasMore.set(true);
    }

    this.loading.set(true);
    this.error.set(null);

    const params = new HttpParams()
      .set('page', this.currentPage().toString())
      .set('limit', this.pageSize.toString());

    this.http
      .get<PaginatedResponse>(`${environment.apiUrl}/orders`, { params })
      .pipe(
        tap(res => {
          const newOrders = res.data || [];
          this.orders.update(existing => (reset ? newOrders : [...existing, ...newOrders]));
          this.currentPage.set(res.pagination.page);
          this.hasMore.set(newOrders.length === this.pageSize);
          this.totalCount.set(res.pagination.total);
          this.loading.set(false);
        }),
        catchError(err => {
          console.error('[ShopOrdersService.loadOrders]', err);
          this.error.set('Erreur lors du chargement des commandes');
          this.loading.set(false);
          return of(null);
        }),
      )
      .subscribe();
  }

  loadNext(): void {
    if (!this.hasMore() || this.loading()) return;
    this.currentPage.set(this.currentPage() + 1);
    this.loadOrders(false);
  }

  reload(): void {
    this.loadOrders(true);
  }

  // ── Filter Actions ─────────────────────────────────────────────────────

  onSearchChange(query: string): void {
    this.searchQuery.set(query);
  }

  onStatusChange(status: 'pending' | 'confirmed' | 'delivered' | 'cancelled' | ''): void {
    this.statusFilter.set(status);
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.statusFilter.set('');
  }

  // ── Auto Refresh (Polling) ───────────────────────────────────────────────

  private setupAutoRefresh(): void {
    // Auto-refresh every 30 seconds when page is visible
    interval(this.pollingInterval).pipe(
      switchMap(() => {
        if (document.hidden) return of(null);
        const token = sessionStorage.getItem('bs_token');
        if (!token) return of(null);
        this.refreshTrigger.next();
        return this.http.get<PaginatedResponse>(`${environment.apiUrl}/orders`, {
          params: new HttpParams().set('page', '1').set('limit', this.pageSize.toString()),
        });
      }),
      tap(res => {
        if (res) {
          this.orders.set(res.data || []);
          this.totalCount.set(res.pagination.total);
        }
      }),
      catchError(err => {
        console.error('[ShopOrdersService.autoRefresh]', err);
        return of(null);
      }),
    ).subscribe();
  }

  manualRefresh(): void {
    this.refreshTrigger.next();
    this.reload();
  }

  // ── Update Status ─────────────────────────────────────────────────────

  updateOrderStatus(orderId: string, status: 'pending' | 'confirmed' | 'delivered' | 'cancelled'): Observable<Order> {
    return this.http.patch<Order>(`${environment.apiUrl}/orders/${orderId}`, { status }).pipe(
      tap(updatedOrder => {
        this.orders.update(orders =>
          orders.map(o => (o._id === orderId ? { ...o, ...updatedOrder } : o)),
        );
      }),
      catchError(err => {
        console.error('[ShopOrdersService.updateOrderStatus]', err);
        this.error.set('Erreur lors de la mise à jour du statut');
        throw err;
      }),
    );
  }

  // ── Quick Actions ───────────────────────────────────────────────────────

  buildWhatsAppUrl(order: Order): string {
    console.log('Order data:', order);
    const orderId = (order as any)._id || (order as any).id || '';
    const lines = order.items
      .map(i => `• *${i.productName}* ×${i.quantity} — ${this.fmt(i.price * i.quantity)}`)
      .join('\n');

    const msg =
      `🛒 *Commande #${orderId.slice(-6)}*\n` +
      `Client : ${order.customerName}\n` +
      `Tél : ${order.customerPhone}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `${lines}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `💰 *Total : ${this.fmt(order.total)}*\n` +
      `Statut : ${this.getStatusLabel(order.status)}`;

    const cleanPhone = order.customerPhone?.replace(/[\s\-\+]/g, '') || '';
    console.log('Clean phone:', cleanPhone);
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
