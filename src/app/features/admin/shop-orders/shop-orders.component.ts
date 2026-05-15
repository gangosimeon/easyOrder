import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { ShopOrdersService, Order } from '../../../core/services/shop-orders.service';
import { OrderCardComponent } from '../../../shared/order-card/order-card.component';
import { OrderDetailDrawerComponent } from '../../../shared/order-detail-drawer/order-detail-drawer.component';

@Component({
  selector: 'app-shop-orders',
  standalone: true,
  imports: [
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    OrderCardComponent,
    OrderDetailDrawerComponent,
  ],
  templateUrl: './shop-orders.component.html',
  styleUrls: ['./shop-orders.component.scss'],
})
export class ShopOrdersComponent implements OnInit {
  private ordersService = inject(ShopOrdersService);

  // ── State from service ───────────────────────────────────────────────────

  readonly loading = this.ordersService.loading;
  readonly error = this.ordersService.error;
  readonly orders = this.ordersService.orders;
  readonly filteredOrders = this.ordersService.filteredOrders;
  readonly hasMore = this.ordersService.hasMore;
  readonly totalCount = this.ordersService.totalCount;
  readonly displayCount = this.ordersService.displayCount;

  // ── Filters from service ─────────────────────────────────────────────────

  readonly searchQuery = this.ordersService.searchQuery;
  readonly statusFilter = this.ordersService.statusFilter;

  // ── Detail drawer ────────────────────────────────────────────────────────

  readonly selectedOrder = signal<Order | null>(null);
  readonly selectedOrderStatusColor = computed(() => {
    const o = this.selectedOrder();
    return o ? this.ordersService.getStatusColor(o.status) : '';
  });
  readonly selectedOrderStatusLabel = computed(() => {
    const o = this.selectedOrder();
    return o ? this.ordersService.getStatusLabel(o.status) : '';
  });

  // ── Initialization ───────────────────────────────────────────────────────

  ngOnInit(): void {
    // Orders loaded automatically by service constructor
  }

  // ── Load More (Infinite Scroll) ────────────────────────────────────────

  loadNext(): void {
    this.ordersService.loadNext();
  }

  onScroll(event: Event): void {
    const element = event.target as HTMLElement;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;

    // Load more when 100px from bottom
    if (scrollHeight - scrollTop - clientHeight < 100) {
      this.loadNext();
    }
  }

  // ── Filter Actions ─────────────────────────────────────────────────────

  onSearchChange(query: string): void {
    this.ordersService.onSearchChange(query);
  }

  onStatusChange(status: 'pending' | 'confirmed' | 'delivered' | 'cancelled' | ''): void {
    this.ordersService.onStatusChange(status);
  }

  clearFilters(): void {
    this.ordersService.clearFilters();
  }

  manualRefresh(): void {
    this.ordersService.manualRefresh();
  }

  // ── Order Actions ───────────────────────────────────────────────────────

  onCallClient(phone: string): void {
    window.open(this.ordersService.buildCallUrl(phone), '_self');
  }

  onOpenWhatsApp(order: Order): void {
    const url = this.ordersService.buildWhatsAppUrl(order);
    window.open(url, '_blank');
  }

  onOpenDetail(order: Order): void {
    this.selectedOrder.set(order);
  }

  closeOrderDetail(): void {
    this.selectedOrder.set(null);
  }

  onStatusChangedFromDrawer(data: { orderId: string; status: 'pending' | 'confirmed' | 'delivered' | 'cancelled' }): void {
    this.ordersService.updateOrderStatus(data.orderId, data.status).subscribe();
  }

  onChangeStatus(data: { orderId: string; status: 'pending' | 'confirmed' | 'delivered' | 'cancelled' }): void {
    this.ordersService.updateOrderStatus(data.orderId, data.status).subscribe();
  }

  // ── Helpers ───────────────────────────────────────────────────────────

  readonly getStatusColor = (status: string): string => {
    return this.ordersService.getStatusColor(status);
  };

  readonly getStatusLabel = (status: string): string => {
    return this.ordersService.getStatusLabel(status);
  };

  readonly formatDate = (dateStr: string): string => {
    return this.ordersService.formatDate(dateStr);
  };

  readonly fmtPrice = (price: number): string => {
    return this.ordersService.fmt(price);
  };
}
