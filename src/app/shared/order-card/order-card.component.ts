import { Component, computed, input, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { Order } from '../../core/services/orders-api.service';

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'delivered' | 'cancelled';

interface StatusMeta {
  label:       string;
  color:       string;
  bgLight:     string;
  icon:        string;
  actionLabel: string;
  next:        OrderStatus | null;
}

const STATUS_META: Record<OrderStatus, StatusMeta> = {
  pending:    { label: 'En attente',   color: '#f59e0b', bgLight: '#fffbeb', icon: 'hourglass_empty', actionLabel: 'Confirmer',     next: 'confirmed'  },
  confirmed:  { label: 'Confirmé',     color: '#10b981', bgLight: '#ecfdf5', icon: 'check_circle',    actionLabel: '',              next: null         },
  preparing:  { label: 'En prépa.',    color: '#8b5cf6', bgLight: '#f5f3ff', icon: 'inventory_2',     actionLabel: 'En livraison',  next: 'delivering' },
  delivering: { label: 'En livraison', color: '#3b82f6', bgLight: '#eff6ff', icon: 'local_shipping',  actionLabel: 'Marquer livré', next: 'delivered'  },
  delivered:  { label: 'Livré',        color: '#059669', bgLight: '#ecfdf5', icon: 'done_all',        actionLabel: 'Livrer',        next: null         },
  cancelled:  { label: 'Annulé',       color: '#ef4444', bgLight: '#fef2f2', icon: 'cancel',          actionLabel: 'Annuler',       next: null         },
};

@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatRippleModule],
  templateUrl: './order-card.component.html',
  styleUrls: ['./order-card.component.scss'],
})
export class OrderCardComponent {
  readonly order          = input.required<Order>();
  readonly statusColor    = input.required<string>();
  readonly statusLabel    = input.required<string>();
  readonly formatDate     = input.required<(dateStr: string) => string>();
  readonly fmtPrice       = input.required<(price: number) => string>();
  readonly statusUpdating = input<boolean>(false);

  readonly onCall         = output<string>();
  readonly onWhatsApp     = output<Order>();
  readonly onOpenDetail   = output<Order>();
  readonly onChangeStatus = output<{ orderId: string; status: OrderStatus }>();

  // null = mode normal ; sinon = statut cible en attente de confirmation
  readonly pendingAction = signal<OrderStatus | null>(null);

  readonly confirming     = computed(() => this.pendingAction() !== null);
  readonly showTwoActions = computed(() => this.order().status === 'confirmed');

  readonly currentMeta = computed(() =>
    STATUS_META[this.order().status as OrderStatus] ?? STATUS_META.pending
  );

  readonly nextStatus = computed(() => this.currentMeta().next);

  readonly nextMeta = computed(() => {
    const n = this.nextStatus();
    return n ? STATUS_META[n] : null;
  });

  readonly isTerminal = computed(() =>
    !this.showTwoActions() && this.nextStatus() === null
  );

  readonly pendingMeta = computed(() => {
    const p = this.pendingAction();
    return p ? STATUS_META[p] : null;
  });

  callClient(): void {
    const phone = this.order().customerPhone;
    if (phone) this.onCall.emit(phone);
  }

  openWhatsApp(): void {
    this.onWhatsApp.emit(this.order());
  }

  openDetail(): void {
    if (this.pendingAction()) { this.pendingAction.set(null); return; }
    this.onOpenDetail.emit(this.order());
  }

  requestChange(): void {
    if (this.isTerminal() || this.statusUpdating()) return;
    this.pendingAction.set(this.nextStatus());
  }

  requestSpecificChange(target: OrderStatus): void {
    if (this.statusUpdating()) return;
    this.pendingAction.set(target);
  }

  confirmChange(): void {
    const order   = this.order();
    const orderId = order._id || (order as any).id;
    const target  = this.pendingAction();
    if (!orderId || !target) return;
    this.pendingAction.set(null);
    this.onChangeStatus.emit({ orderId, status: target });
  }

  cancelChange(): void {
    this.pendingAction.set(null);
  }
}
