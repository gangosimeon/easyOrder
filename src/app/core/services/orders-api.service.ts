import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

// ── Types ───────────────────────────────────────────────────────────────────

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
  unit: string;
}

export interface Order {
  _id: string;
  shopId: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  whatsappSent: boolean;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderFilters {
  status?: 'pending' | 'confirmed' | 'delivered' | 'cancelled' | 'all';
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface UpdateStatusInput {
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
}

// ── Service ──────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class OrdersApiService {
  private http = inject(HttpClient);

  // ── State ────────────────────────────────────────────────────────────────

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly orders = signal<Order[]>([]);
  readonly totalCount = signal(0);
  readonly currentPage = signal(1);
  readonly pageSize = 20;
  readonly hasMore = signal(true);

  private currentFilters: OrderFilters = {};

  // ── Fetch Orders ────────────────────────────────────────────────────────────

  /**
   * Charge les commandes avec filtres et pagination.
   */
  loadOrders(filters: OrderFilters = {}, page = 1, reset = false): void {
    if (reset) {
      this.currentFilters = filters;
      this.currentPage.set(1);
      this.orders.set([]);
      this.hasMore.set(true);
    }

    this.loading.set(true);
    this.error.set(null);

    const paramsObj = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== undefined && v !== ''),
    );
    const params = new HttpParams({ fromObject: paramsObj });

    this.http
      .get<{ success: boolean; data: Order[]; pagination?: { total: number } }>(
        `${environment.apiUrl}/orders`,
        { params },
      )
      .pipe(
        tap((res: any) => {
          const newOrders = res.data || [];
          this.orders.update(existing => (reset ? newOrders : [...existing, ...newOrders]));
          this.currentPage.set(page);
          this.hasMore.set(newOrders.length === this.pageSize);
          if (res.pagination?.total) {
            this.totalCount.set(res.pagination.total);
          }
          this.loading.set(false);
        }),
        catchError(err => {
          console.error('[OrdersApiService.loadOrders]', err);
          this.error.set('Erreur lors du chargement des commandes');
          this.loading.set(false);
          return of({ success: false, data: [] });
        }),
      )
      .subscribe();
  }

  /**
   * Recharge les commandes (reset pagination).
   */
  reload(): void {
    this.loadOrders(this.currentFilters, 1, true);
  }

  /**
   * Charge la page suivante (infinite scroll).
   */
  loadNext(): void {
    if (!this.hasMore() || this.loading()) return;
    this.loadOrders(this.currentFilters, this.currentPage() + 1, false);
  }

  // ── Update Status ──────────────────────────────────────────────────────────

  updateOrderStatus(orderId: string, status: 'pending' | 'confirmed' | 'delivered' | 'cancelled'): Observable<Order> {
    return this.http.patch<Order>(`${environment.apiUrl}/orders/${orderId}`, { status }).pipe(
      tap(updatedOrder => {
        this.orders.update(orders =>
          orders.map(o => (o._id === orderId ? { ...o, ...updatedOrder } : o)),
        );
      }),
      catchError(err => {
        console.error('[OrdersApiService.updateOrderStatus]', err);
        this.error.set('Erreur lors de la mise à jour du statut');
        throw err;
      }),
    );
  }

  // ── Quick Actions ───────────────────────────────────────────────────────────

  /**
   * Génère l'URL WhatsApp pour une commande.
   */
  buildWhatsAppUrl(order: Order): string {
    const lines = order.items
      .map(i => `• *${i.productName}* ×${i.quantity} — ${this.fmt(i.price * i.quantity)}`)
      .join('\n');

    const msg =
      `🛒 *Commande #${order._id.slice(-6)}*\n` +
      `Client : ${order.customerName}\n` +
      `Tél : ${order.customerPhone}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `${lines}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `💰 *Total : ${this.fmt(order.total)}*\n` +
      `Statut : ${order.status.toUpperCase()}`;

    return `https://wa.me/${order.customerPhone.replace(/[\s\-]/g, '')}?text=${encodeURIComponent(msg)}`;
  }

  /**
   * Génère l'URL d'appel téléphonique.
   */
  buildCallUrl(phone: string): string {
    return `tel:${phone.replace(/[\s\-]/g, '')}`;
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

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
