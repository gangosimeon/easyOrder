import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { OrdersApiService, Order, OrderFilters } from '../../../core/services/orders-api.service';
import { OrderCardComponent } from '../../../shared/order-card/order-card.component';
import { OrderDetailDrawerComponent } from '../../../shared/order-detail-drawer/order-detail-drawer.component';

@Component({
  selector: 'app-orders-dashboard',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    OrderCardComponent,
    OrderDetailDrawerComponent,
  ],
  templateUrl: './orders-dashboard.component.html',
  styleUrls: ['./orders-dashboard.component.scss'],
})
export class OrdersDashboardComponent implements OnInit {
  private ordersApi = inject(OrdersApiService);

  // ── State from service ───────────────────────────────────────────────────

  readonly loading          = this.ordersApi.loading;
  readonly error            = this.ordersApi.error;
  readonly orders           = this.ordersApi.orders;
  readonly hasMore          = this.ordersApi.hasMore;
  readonly totalCount       = this.ordersApi.totalCount;
  readonly updatingOrderId  = this.ordersApi.updatingOrderId;
  readonly skeletonRows = Array(4).fill(0);

  // ── Detail drawer ────────────────────────────────────────────────────────

  readonly selectedOrder = signal<Order | null>(null);
  readonly selectedOrderStatusColor = computed(() => {
    const o = this.selectedOrder();
    return o ? this.ordersApi.getStatusColor(o.status) : '';
  });
  readonly selectedOrderStatusLabel = computed(() => {
    const o = this.selectedOrder();
    return o ? this.ordersApi.getStatusLabel(o.status) : '';
  });

  // ── Filters ───────────────────────────────────────────────────────────────

  readonly searchQuery = signal('');
  readonly statusFilter = signal<'all' | 'pending' | 'confirmed' | 'delivered' | 'cancelled'>('all');
  readonly dateFilter = signal<'all' | 'today' | 'week' | 'month'>('all');
  readonly minAmount = signal<number | undefined>(undefined);
  readonly maxAmount = signal<number | undefined>(undefined);

  // ── Computed ─────────────────────────────────────────────────────────────

  readonly filteredOrders = computed(() => {
    const orders = this.orders();
    const search = this.searchQuery().toLowerCase();
    const status = this.statusFilter();
    const min = this.minAmount();
    const max = this.maxAmount();

    return orders.filter(order => {
      // Search filter
      if (search) {
        const matchName = order.customerName?.toLowerCase().includes(search) ?? false;
        const matchPhone = order.customerPhone?.includes(search) ?? false;
        if (!matchName && !matchPhone) return false;
      }

      // Status filter
      if (status !== 'all' && order.status !== status) return false;

      // Amount filter
      if (min !== undefined && order.total < min) return false;
      if (max !== undefined && order.total > max) return false;

      return true;
    });
  });

  readonly displayCount = computed(() => this.filteredOrders().length);

  // ── Initialization ───────────────────────────────────────────────────────

  ngOnInit(): void {
    this.loadOrders();
  }

  // ── Load Orders ─────────────────────────────────────────────────────────

  loadOrders(): void {
    const filters: OrderFilters = {
      search: this.searchQuery() || undefined,
      status: this.statusFilter() === 'all' ? undefined : this.statusFilter(),
      minAmount: this.minAmount(),
      maxAmount: this.maxAmount(),
    };
    this.ordersApi.loadOrders(filters, 1, true);
  }

  loadNext(): void {
    this.ordersApi.loadNext();
  }

  // ── Filter Actions ───────────────────────────────────────────────────────

  onSearchChange(query: string): void {
    this.searchQuery.set(query);
    this.loadOrders();
  }

  onStatusChange(status: 'all' | 'pending' | 'confirmed' | 'delivered' | 'cancelled'): void {
    this.statusFilter.set(status);
    this.loadOrders();
  }

  onDateChange(date: 'all' | 'today' | 'week' | 'month'): void {
    this.dateFilter.set(date);
    this.loadOrders();
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.statusFilter.set('all');
    this.dateFilter.set('all');
    this.minAmount.set(undefined);
    this.maxAmount.set(undefined);
    this.loadOrders();
  }

  // ── Order Actions ───────────────────────────────────────────────────────

  onCallClient(phone: string): void {
    window.open(`tel:${phone.replace(/[\s\-]/g, '')}`, '_self');
  }

  onOpenWhatsApp(order: Order): void {
    const url = this.ordersApi.buildWhatsAppUrl(order);
    window.open(url, '_blank');
  }

  onOpenDetail(order: Order): void {
    this.selectedOrder.set(order);
  }

  closeOrderDetail(): void {
    this.selectedOrder.set(null);
  }

  onStatusChangedFromDrawer(data: { orderId: string; status: 'pending' | 'confirmed' | 'delivered' | 'cancelled' }): void {
    this.ordersApi.updateOrderStatus(data.orderId, data.status).subscribe();
  }

  onChangeStatus(data: { orderId: string; status: 'pending' | 'confirmed' | 'delivered' | 'cancelled' }): void {
    this.ordersApi.updateOrderStatus(data.orderId, data.status).subscribe();
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  readonly getStatusColor = (status: string): string  => this.ordersApi.getStatusColor(status);
  readonly getStatusLabel = (status: string): string  => this.ordersApi.getStatusLabel(status);
  readonly formatDate     = (d: string): string       => this.ordersApi.formatDate(d);
  readonly fmtPrice       = (p: number): string       => this.ordersApi.fmt(p);
  readonly getOrderId     = (o: Order): string        => this.ordersApi.getOrderId(o);

  // ── Infinite Scroll ───────────────────────────────────────────────────────

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
}
