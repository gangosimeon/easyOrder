import { Component, inject, signal, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
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
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    OrderCardComponent,
  ],
  templateUrl: './shop-orders.component.html',
  styleUrls: ['./shop-orders.component.scss'],
})
export class ShopOrdersComponent implements OnInit {
  private ordersService = inject(ShopOrdersService);
  private dialog = inject(MatDialog);

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
    this.dialog.open(OrderDetailDrawerComponent, {
      panelClass: 'order-drawer',
      position: { bottom: '0' },
      maxWidth: '100vw',
      width: '100%',
      height: 'auto',
      data: {
        order,
        statusColor: this.ordersService.getStatusColor(order.status),
        statusLabel: this.ordersService.getStatusLabel(order.status),
        formatDate: (d: string) => this.ordersService.formatDate(d),
        fmtPrice: (p: number) => this.ordersService.fmt(p),
      },
    }).afterClosed().subscribe(result => {
      console.log('Drawer result:', result);
      if (result?.action === 'updateStatus') {
        this.ordersService.updateOrderStatus(result.orderId, result.status).subscribe();
      }
    });
  }

  onChangeStatus(order: Order): void {
    console.log('Changing status for order:', order._id, order.status);
    this.ordersService.updateOrderStatus(order._id, order.status).subscribe();
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
