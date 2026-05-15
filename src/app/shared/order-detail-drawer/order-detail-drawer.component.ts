import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { Order } from '../../core/services/orders-api.service';

@Component({
  selector: 'app-order-detail-drawer',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatRippleModule],
  templateUrl: './order-detail-drawer.component.html',
  styleUrls: ['./order-detail-drawer.component.scss'],
})
export class OrderDetailDrawerComponent {
  @Input() order: Order | null = null;
  @Input() statusColor = '';
  @Input() statusLabel = '';
  @Input() formatDate: (dateStr: string) => string = () => '';
  @Input() fmtPrice: (price: number) => string = () => '';

  @Output() closed = new EventEmitter<void>();
  @Output() statusChanged = new EventEmitter<{
    orderId: string;
    status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  }>();

  showStatusMenu = false;

  get displayOrderId(): string {
    const id = (this.order as any)?._id;
    if (!id) return '---';
    return `#${id.slice(-6)}`;
  }

  close(): void {
    this.closed.emit();
  }

  stopProp(e: MouseEvent): void {
    e.stopPropagation();
  }

  callClient(): void {
    const phone = this.order?.customerPhone;
    if (!phone) return;
    window.open(`tel:${phone.replace(/[\s\-\+]/g, '')}`, '_self');
  }

  openWhatsApp(): void {
    const order = this.order;
    if (!order) return;
    const orderId = (order as any)._id || (order as any).id || '';
    const lines = order.items
      .map(i => `• *${i.productName}* ×${i.quantity} — ${this.fmtPrice(i.price * i.quantity)}`)
      .join('\n');

    const msg =
      `🛒 *Commande #${orderId.slice(-6)}*\n` +
      `Client : ${order.customerName}\n` +
      `Tél : ${order.customerPhone}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `${lines}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `💰 *Total : ${this.fmtPrice(order.total)}*\n` +
      `Statut : ${this.statusLabel}`;

    window.open(
      `https://wa.me/${order.customerPhone?.replace(/[\s\-\+]/g, '') ?? ''}?text=${encodeURIComponent(msg)}`,
      '_blank',
    );
  }

  toggleStatusMenu(): void {
    this.showStatusMenu = !this.showStatusMenu;
  }

  selectStatus(status: 'pending' | 'confirmed' | 'delivered' | 'cancelled'): void {
    this.showStatusMenu = false;
    const orderId = (this.order as any)?._id || (this.order as any)?.id;
    if (!orderId) return;
    this.statusChanged.emit({ orderId, status });
    this.closed.emit();
  }

  readonly statuses: { value: 'pending' | 'confirmed' | 'delivered' | 'cancelled'; label: string; color: string }[] = [
    { value: 'pending',   label: 'En attente', color: '#f59e0b' },
    { value: 'confirmed', label: 'Confirmé',   color: '#10b981' },
    { value: 'delivered', label: 'Livré',       color: '#3b82f6' },
    { value: 'cancelled', label: 'Annulé',      color: '#ef4444' },
  ];
}
