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

  // Outputs
  readonly onCall = output<string>();
  readonly onWhatsApp = output<Order>();
  readonly onOpenDetail = output<Order>();
  readonly onChangeStatus = output<Order>();

  callClient(): void {
    this.onCall.emit(this.order().customerPhone);
  }

  openWhatsApp(): void {
    this.onWhatsApp.emit(this.order());
  }

  openDetail(): void {
    this.onOpenDetail.emit(this.order());
  }

  cycleStatus(): void {
    const statuses: ('pending' | 'confirmed' | 'delivered' | 'cancelled')[] = ['pending', 'confirmed', 'delivered', 'cancelled'];
    const current = this.order().status;
    const currentIndex = statuses.indexOf(current);
    const nextIndex = (currentIndex + 1) % statuses.length;
    const nextStatus = statuses[nextIndex];
    const updated = { ...this.order(), status: nextStatus };
    console.log('Updated order:', updated);
    this.onChangeStatus.emit(updated);
  }
}
