import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Order } from '../../core/services/orders-api.service';

interface DrawerData {
  order: Order;
  statusColor: string;
  statusLabel: string;
  formatDate: (dateStr: string) => string;
  fmtPrice: (price: number) => string;
}

@Component({
  selector: 'app-order-detail-drawer',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatRippleModule],
  templateUrl: './order-detail-drawer.component.html',
  styleUrls: ['./order-detail-drawer.component.scss'],
})
export class OrderDetailDrawerComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<OrderDetailDrawerComponent>);
  readonly data = inject<DrawerData>(MAT_DIALOG_DATA);

  readonly order = signal<Order | null>(null);
  readonly statusColor = signal('');
  readonly statusLabel = signal('');
  readonly formatDate = signal<(dateStr: string) => string>(() => '');
  readonly fmtPrice = signal<(price: number) => string>(() => '');

  readonly selectedStatus = signal<'pending' | 'confirmed' | 'delivered' | 'cancelled'>('pending');
  showStatusMenu = false;

  readonly displayOrderId = computed(() => {
    const order = this.order();
    if (!order?._id) return '---';
    return `#${order._id.slice(-6)}`;
  });

  ngOnInit(): void {
    this.order.set(this.data.order ?? null);
    this.statusColor.set(this.data.statusColor ?? '');
    this.statusLabel.set(this.data.statusLabel ?? '');
    this.formatDate.set(this.data.formatDate ?? (() => ''));
    this.fmtPrice.set(this.data.fmtPrice ?? (() => ''));
    this.selectedStatus.set(this.data.order?.status ?? 'pending');
  }

  close(): void {
    this.dialogRef.close();
  }

  callClient(): void {
    const order = this.order();
    if (!order?.customerPhone) return;
    window.open(`tel:${order.customerPhone.replace(/[\s\-]/g, '')}`, '_self');
  }

  openWhatsApp(): void {
    const order = this.order();
    if (!order) return;
    const lines = order.items
      .map((i: any) => `• *${i.productName}* ×${i.quantity} — ${this.fmtPrice()(i.price * i.quantity)}`)
      .join('\n');

    const msg =
      `🛒 *Commande #${order._id.slice(-6)}*\n` +
      `Client : ${order.customerName}\n` +
      `Tél : ${order.customerPhone}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `${lines}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `💰 *Total : ${this.fmtPrice()(order.total)}*\n` +
      `Statut : ${this.statusLabel()}`;

    window.open(`https://wa.me/${order.customerPhone.replace(/[\s\-]/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  toggleStatusMenu(): void {
    this.showStatusMenu = !this.showStatusMenu;
  }

  selectStatus(status: 'pending' | 'confirmed' | 'delivered' | 'cancelled'): void {
    this.selectedStatus.set(status);
    this.showStatusMenu = false;
    const order = this.order();
    const orderId = (order as any)._id || (order as any).id;
    if (!orderId) return;
    this.dialogRef.close({ action: 'updateStatus', status, orderId });
  }

  statuses: { value: 'pending' | 'confirmed' | 'delivered' | 'cancelled'; label: string; color: string }[] = [
    { value: 'pending', label: 'En attente', color: '#f59e0b' },
    { value: 'confirmed', label: 'Confirmé', color: '#10b981' },
    { value: 'delivered', label: 'Livré', color: '#3b82f6' },
    { value: 'cancelled', label: 'Annulé', color: '#ef4444' },
  ];
}
