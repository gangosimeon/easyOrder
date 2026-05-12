import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CartItem } from './cart.service';
import {
  mapCartToCreateOrderInput,
  CreateOrderInput,
  OrderItemInput,
  MapCartToOrderOptions,
} from './order.mapper';

// ── Alias pour compatibilité avec code existant ─────────────────────────────

export type CreateOrderPayload = CreateOrderInput;
export type OrderItem = OrderItemInput;

export interface OrderResult {
  _id:          string;
  shopId:       string;
  customerName: string;
  customerPhone:string;
  items:        OrderItem[];
  total:        number;
  status:       'pending' | 'confirmed' | 'delivered' | 'cancelled';
  whatsappSent: boolean;
  note?:        string;
  createdAt:    string;
}

export interface PendingOrder {
  shopSlug: string;
  payload:  CreateOrderPayload;
  savedAt:  string;
}

const PENDING_KEY = 'burkina_shop_pending_orders';

// ── Service ──────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);

  // ── State global (consommé par tous les composants) ─────────────────────
  readonly submitting  = signal(false);
  readonly submitError = signal<string | null>(null);
  readonly lastOrder   = signal<OrderResult | null>(null);
  readonly hasPending  = signal(this.getPending().length > 0);

  // ── Flux principal ──────────────────────────────────────────────────────

  /**
   * Construit le payload depuis le panier et POST vers /api/orders.
   * Retry automatique x2 (1.5s entre tentatives).
   * Fallback localStorage si toutes les tentatives échouent.
   */
  createOrderFromCart(
    customerName:  string,
    customerPhone: string,
    items:         CartItem[],
    shopSlug:      string,
    opts: { note?: string; whatsappSent?: boolean } = {},
  ): Observable<{ success: boolean; data: OrderResult }> {
    this.submitting.set(true);
    this.submitError.set(null);

    const mapped = mapCartToCreateOrderInput(items, {
      customerName,
      customerPhone,
      note: opts.note,
      whatsappSent: opts.whatsappSent ?? false,
    });

    if (!mapped.success) {
      this.submitting.set(false);
      const errorMsg = mapped.errors?.map(e => `${e.field}: ${e.message}`).join('; ') ?? 'Données invalides';
      this.submitError.set(errorMsg);
      return throwError(() => new Error(errorMsg));
    }

    const payload = mapped.payload!;

    return this.http
      .post<{ success: boolean; data: OrderResult }>(
        `${environment.apiUrl}/orders?shopSlug=${encodeURIComponent(shopSlug)}`,
        payload,
      )
      .pipe(
        retry({ count: 2, delay: 1500 }),
        tap(res => {
          this.lastOrder.set(res.data);
          this.submitting.set(false);
          this.submitError.set(null);
          this.removePendingMatch(shopSlug, payload);
        }),
        catchError((err: HttpErrorResponse) => {
          this.submitting.set(false);
          const msg = err.error?.message ?? 'Commande non enregistrée — connexion lente';
          this.submitError.set(msg);
          this.savePending(shopSlug, payload);
          return throwError(() => new Error(msg));
        }),
      );
  }

  /**
   * Construit le deep-link WhatsApp avec un message formaté.
   * Optimisé mobile : compact, lisible sur petit écran.
   */
  buildWhatsAppUrl(phone: string, items: CartItem[], shopName: string): string {
    const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
    const lines = items
      .map(i => `• *${i.product.name}* ×${i.quantity} — ${this.fmt(i.product.price * i.quantity)}`)
      .join('\n');
    const phoneNumber = phone.replace(/[\s\-\+]/g, '');
    const msg =
      `🛒 *Commande — ${shopName}*\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `${lines}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `💰 *Total : ${this.fmt(total)}*\n\n` +
      `Merci de confirmer ma commande 🙏`;

    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`;
  }

  /**
   * Rejoue toutes les commandes en attente dans localStorage.
   * À appeler au démarrage de l'app ou sur reconnexion réseau.
   */
  retryPending(): void {
    for (const p of this.getPending()) {
      this.http
        .post(
          `${environment.apiUrl}/orders?shopSlug=${encodeURIComponent(p.shopSlug)}`,
          p.payload,
        )
        .pipe(retry({ count: 1, delay: 3000 }))
        .subscribe({
          next: () => this.removePendingMatch(p.shopSlug, p.payload),
          error: () => {},
        });
    }
  }

  getPending(): PendingOrder[] {
    try { return JSON.parse(localStorage.getItem(PENDING_KEY) ?? '[]'); }
    catch { return []; }
  }

  fmt(price: number): string {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  }

  // ── Privé ────────────────────────────────────────────────────────────────

  private savePending(shopSlug: string, payload: CreateOrderInput): void {
    const list: PendingOrder[] = [
      ...this.getPending(),
      { shopSlug, payload, savedAt: new Date().toISOString() },
    ];
    localStorage.setItem(PENDING_KEY, JSON.stringify(list));
    this.hasPending.set(true);
  }

  private removePendingMatch(shopSlug: string, payload: CreateOrderPayload): void {
    const filtered = this.getPending().filter(
      p => !(
        p.shopSlug === shopSlug &&
        p.payload.customerPhone === payload.customerPhone &&
        p.payload.total === payload.total
      ),
    );
    localStorage.setItem(PENDING_KEY, JSON.stringify(filtered));
    this.hasPending.set(filtered.length > 0);
  }
}
