import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { Order } from '../../core/services/orders-api.service';

@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatRippleModule],
  templateUrl: './order-card.component.html',
  styleUrls: ['./order-card.component.scss'],
})
export class OrderCardComponent {
  readonly order = input.required<Order>();
  readonly statusColor = input.required<string>();
  readonly statusLabel = input.required<string>();
  readonly formatDate = input.required<(dateStr: string) => string>();
  readonly fmtPrice = input.required<(price: number) => string>();
  readonly statusUpdating = input<boolean>(false);

  // Outputs
  readonly onCall = output<string>();
  readonly onWhatsApp = output<Order>();
  readonly onOpenDetail = output<Order>();
  readonly onChangeStatus = output<{ orderId: string; status: 'pending' | 'confirmed' | 'delivered' | 'cancelled' }>();

  callClient(): void {
    const phone = this.order().customerPhone;
    if (phone) this.onCall.emit(phone);
  }

  openWhatsApp(): void {
    this.onWhatsApp.emit(this.order());
  }

  openDetail(): void {
    this.onOpenDetail.emit(this.order());
  }

  cycleStatus(): void {
    const order = this.order();
    // Interceptor renames _id → id; handle both cases
    const orderId = order._id || (order as any).id;
    if (!orderId) return;
    const statuses: ('pending' | 'confirmed' | 'delivered' | 'cancelled')[] = ['pending', 'confirmed', 'delivered', 'cancelled'];
    const nextIndex = (statuses.indexOf(order.status) + 1) % statuses.length;
    this.onChangeStatus.emit({ orderId, status: statuses[nextIndex] });
  }
}
