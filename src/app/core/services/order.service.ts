import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError, timer } from 'rxjs';
import { catchError, map, retry, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CartItem, CompanyRef } from './cart.service';
import {
  mapCartToCreateOrderInput,
  CreateOrderInput,
  OrderItemInput,
} from './order.mapper';

// ── Alias pour compatibilité avec code existant ─────────────────────────────

export type CreateOrderPayload = CreateOrderInput;
export type OrderItem = OrderItemInput;

export interface OrderResult {
  id:           string;   // `_id` renommé par apiResponseInterceptor
  shopId:       string;
  customerName?: string;
  customerPhone?:string;
  items:        OrderItem[];
  total:        number;
  status:       'pending' | 'confirmed' | 'preparing' | 'delivering' | 'delivered' | 'cancelled';
  whatsappSent: boolean;
  note?:        string;
  createdAt:    string;
  updatedAt:    string;
}

export interface PendingOrder {
  shopSlug: string;
  payload:  CreateOrderPayload;
  savedAt:  string;
}

export interface CheckoutForm {
  customerName:  string;
  customerPhone: string;   // indicatif + numéro, chiffres uniquement
  note?:         string;
  website?:      string;   // champ piège anti-robot, toujours vide pour un humain
}

/**
 * Issue d'une commande :
 *  - `saved`    : enregistrée, WhatsApp ouvert avec la référence ;
 *  - `queued`   : réseau indisponible, commande gardée sur l'appareil et
 *                 renvoyée plus tard, WhatsApp ouvert quand même ;
 *  - `rejected` : refusée par le serveur (données, boutique, limite) — rien
 *                 n'est envoyé et le panier est conservé.
 */
export type CheckoutOutcome =
  | { status: 'saved'; reference: string }
  | { status: 'queued' }
  | { status: 'rejected'; message: string };

const PENDING_KEY = 'burkina_shop_pending_orders';

// ── Service ──────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);

  // ── State global (consommé par tous les composants) ─────────────────────
  readonly submitting  = signal(false);
  readonly submitError = signal<string | null>(null);

  // ── Flux principal ──────────────────────────────────────────────────────

  /**
   * Enregistre la commande puis ouvre WhatsApp avec un récapitulatif complet.
   *
   * Doit être appelé directement depuis le gestionnaire de clic : l'onglet
   * WhatsApp est ouvert *avant* l'appel réseau, sinon les navigateurs mobiles
   * le bloquent comme popup (ouverture hors geste utilisateur).
   */
  checkout(items: CartItem[], company: CompanyRef, form: CheckoutForm): Observable<CheckoutOutcome> {
    const mapped = mapCartToCreateOrderInput(items, {
      customerName:  form.customerName,
      customerPhone: form.customerPhone,
      note:          form.note,
      website:       form.website,
      whatsappSent:  true,
    });
    if (!mapped.success) {
      const message = mapped.errors?.map(e => e.message).join(' · ') ?? 'Données invalides';
      this.submitError.set(message);
      return of({ status: 'rejected', message });
    }
    const payload = mapped.payload!;

    const waWindow = window.open('', '_blank');
    this.submitting.set(true);
    this.submitError.set(null);

    return this.postOrder(company.slug, payload).pipe(
      map((order): CheckoutOutcome => ({ status: 'saved', reference: this.reference(order.id) })),
      catchError((err: HttpErrorResponse) => {
        if (this.isNetworkError(err)) {
          this.savePending(company.slug, payload);
          return of<CheckoutOutcome>({ status: 'queued' });
        }
        return of<CheckoutOutcome>({ status: 'rejected', message: this.errorMessage(err) });
      }),
      tap(outcome => {
        this.submitting.set(false);
        if (outcome.status === 'rejected') {
          this.submitError.set(outcome.message);
          waWindow?.close();
          return;
        }
        const url = this.buildWhatsAppUrl(company, items, payload, outcome.status === 'saved' ? outcome.reference : undefined);
        if (waWindow) {
          waWindow.location.href = url;
        } else {
          // Onglet bloqué malgré tout : on bascule la page courante vers WhatsApp.
          window.location.href = url;
        }
      }),
    );
  }

  /** Référence courte affichée au client et au commerçant (même format que la liste des commandes). */
  reference(orderId: string): string {
    return `#${orderId.slice(-6)}`;
  }

  /**
   * Message WhatsApp envoyé au commerçant : tout ce qu'il faut pour traiter la
   * commande sans ouvrir l'application (référence, articles, client, note).
   */
  buildWhatsAppUrl(company: CompanyRef, items: CartItem[], payload: CreateOrderInput, reference?: string): string {
    const lines = items
      .map(i => `• *${i.product.name}* ×${i.quantity} — ${this.fmt(i.product.price * i.quantity)}`)
      .join('\n');
    const header = reference
      ? `🛒 *Commande ${reference} — ${company.name}*`
      : `🛒 *Commande — ${company.name}*`;

    const msg =
      `${header}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `${lines}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `💰 *Total : ${this.fmt(payload.total)}*\n\n` +
      `👤 ${payload.customerName}\n` +
      `📞 +${payload.customerPhone}\n` +
      (payload.note ? `📝 ${payload.note}\n` : '') +
      `\nMerci de confirmer ma commande 🙏`;

    const phoneNumber = (company.fullPhone ?? company.phone).replace(/\D/g, '');
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`;
  }

  /**
   * Renvoie les commandes gardées sur l'appareil faute de réseau.
   * Appelé au démarrage de l'application et au retour de la connexion.
   * Une commande refusée par le serveur (4xx) est abandonnée : la renvoyer
   * indéfiniment ne la ferait pas accepter.
   */
  retryPending(): void {
    for (const p of this.getPending()) {
      this.http
        .post(`${environment.apiUrl}/orders?shopSlug=${encodeURIComponent(p.shopSlug)}`, p.payload)
        .subscribe({
          next: () => this.removePending(p),
          error: (err: HttpErrorResponse) => {
            if (!this.isNetworkError(err)) this.removePending(p);
          },
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

  /** POST avec nouvelles tentatives sur erreur réseau ou serveur uniquement. */
  private postOrder(shopSlug: string, payload: CreateOrderInput): Observable<OrderResult> {
    return this.http
      .post<OrderResult>(`${environment.apiUrl}/orders?shopSlug=${encodeURIComponent(shopSlug)}`, payload)
      .pipe(
        retry({
          count: 2,
          delay: (err: HttpErrorResponse) => this.isNetworkError(err) ? timer(1500) : throwError(() => err),
        }),
      );
  }

  /** Réseau coupé (status 0) ou serveur en panne : la commande vaut d'être renvoyée plus tard. */
  private isNetworkError(err: HttpErrorResponse): boolean {
    return err.status === 0 || err.status >= 500;
  }

  private errorMessage(err: HttpErrorResponse): string {
    if (err.status === 429) return 'Trop de commandes en peu de temps. Réessayez dans quelques minutes.';
    if (err.status === 404) return 'Cette boutique n\'est plus disponible.';
    const details = err.error?.details as Record<string, string[]> | undefined;
    const firstDetail = details ? Object.values(details).flat()[0] : undefined;
    return firstDetail ?? err.error?.message ?? 'Commande refusée. Vérifiez vos informations.';
  }

  private savePending(shopSlug: string, payload: CreateOrderInput): void {
    const list: PendingOrder[] = [
      ...this.getPending(),
      { shopSlug, payload, savedAt: new Date().toISOString() },
    ];
    localStorage.setItem(PENDING_KEY, JSON.stringify(list));
  }

  private removePending(order: PendingOrder): void {
    const filtered = this.getPending().filter(p => p.savedAt !== order.savedAt || p.shopSlug !== order.shopSlug);
    localStorage.setItem(PENDING_KEY, JSON.stringify(filtered));
  }
}
