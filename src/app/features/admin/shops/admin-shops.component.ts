import { Component, OnInit, signal, inject, DestroyRef, computed } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { debounceTime } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AdminService, AdminShop, PlatformStats, AggregateShopStats } from '../../../core/services/admin.service';
import { AdminShopDetailDialogComponent } from './admin-shop-detail.dialog';

@Component({
  selector: 'app-admin-shops',
  standalone: true,
  imports: [
    ReactiveFormsModule, DatePipe,
    MatCardModule, MatTableModule, MatPaginatorModule,
    MatInputModule, MatFormFieldModule, MatButtonModule,
    MatIconModule, MatDialogModule, MatSelectModule,
    MatProgressBarModule, MatTooltipModule,
  ],
  templateUrl: './admin-shops.component.html',
  styleUrl: './admin-shops.component.scss',
})
export class AdminShopsComponent implements OnInit {
  private adminService = inject(AdminService);
  private dialog       = inject(MatDialog);
  private destroyRef   = inject(DestroyRef);

  readonly loading         = signal(false);
  readonly reloading       = signal(false);
  readonly statsLoading    = signal(false);
  readonly error           = signal<string | null>(null);
  readonly shops           = signal<AdminShop[]>([]);
  readonly stats           = signal<PlatformStats | null>(null);
  readonly aggregateStats  = signal<AggregateShopStats | null>(null);
  readonly totalItems      = signal(0);
  readonly currentPage     = signal(0);
  readonly pageSize        = signal(10);
  readonly viewMode        = signal<'table' | 'cards'>('table');
  readonly copiedId        = signal<string | null>(null);

  readonly searchControl = new FormControl('');
  readonly sortControl   = new FormControl('createdAt_desc');
  readonly statusControl = new FormControl<'all' | 'active' | 'inactive'>('all');

  readonly skeletonRows     = Array(6).fill(0);
  readonly displayedColumns = ['logo', 'name', 'phone', 'products', 'status', 'createdAt', 'actions'];

  readonly sortOptions = [
    { value: 'createdAt_desc',    label: 'Plus récents' },
    { value: 'createdAt_asc',     label: 'Plus anciens' },
    { value: 'name_asc',          label: 'Nom A → Z' },
    { value: 'name_desc',         label: 'Nom Z → A' },
    { value: 'productCount_desc', label: 'Plus de produits' },
    { value: 'productCount_asc',  label: 'Moins de produits' },
  ];

  readonly statCards = computed(() => {
    const s   = this.stats();
    const ag  = this.aggregateStats();
    const tot = ag?.totalShops ?? s?.totalShops ?? 0;
    const pct = tot > 0 && ag ? Math.round((ag.activeShops / tot) * 100) : null;
    return [
      { icon: 'storefront',   label: 'Total boutiques',   color: '#6366f1', value: tot,                                    sub: ag ? `${ag.activeShops} actives` : null },
      { icon: 'store',        label: 'Boutiques actives', color: '#10b981', value: ag?.activeShops  ?? null,               sub: pct !== null ? `${pct}% du total` : null  },
      { icon: 'inventory_2',  label: 'Produits',          color: '#f59e0b', value: ag?.totalProducts ?? s?.totalProducts ?? null, sub: null },
      { icon: 'trending_up',  label: 'Nouvelles ce mois', color: '#3b82f6', value: s?.newShopsThisMonth ?? null,           sub: null },
    ];
  });

  constructor() {
    this.searchControl.valueChanges.pipe(
      debounceTime(420),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(() => {
      this.currentPage.set(0);
      this.loadShops(false);
    });

    this.sortControl.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(() => {
      this.currentPage.set(0);
      this.loadShops(false);
    });

    this.statusControl.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(() => {
      this.currentPage.set(0);
      this.loadShops(false);
    });
  }

  ngOnInit(): void {
    this.loadStats();
    this.loadAggregateStats();
    this.loadShops(true);
  }

  loadShops(firstLoad = false): void {
    firstLoad ? this.loading.set(true) : this.reloading.set(true);
    this.error.set(null);

    const [sortField, sortDir] = (this.sortControl.value ?? 'createdAt_desc').split('_');

    this.adminService.getShops({
      search:    this.searchControl.value ?? '',
      page:      this.currentPage(),
      limit:     this.pageSize(),
      sortField,
      sortDir:   sortDir as 'asc' | 'desc',
      status:    this.statusControl.value ?? 'all',
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: data => {
        this.shops.set(data.shops);
        this.totalItems.set(data.pagination.total);
        this.loading.set(false);
        this.reloading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger les boutiques. Vérifiez votre connexion.');
        this.loading.set(false);
        this.reloading.set(false);
      },
    });
  }

  loadStats(): void {
    this.statsLoading.set(true);
    this.adminService.getStats()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next:  s  => { this.stats.set(s); this.statsLoading.set(false); },
        error: () => this.statsLoading.set(false),
      });
  }

  loadAggregateStats(): void {
    this.adminService.getAggregateShopStats()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next:  data => this.aggregateStats.set(data),
        error: () => {},
      });
  }

  copyLink(shop: AdminShop): void {
    const url = shop.publicUrl ?? `${window.location.origin}/shop/${shop.slug}`;
    navigator.clipboard.writeText(url).then(() => {
      this.copiedId.set(shop.id);
      setTimeout(() => this.copiedId.set(null), 2000);
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadShops(false);
  }

  openDetail(shop: AdminShop): void {
    this.dialog.open(AdminShopDetailDialogComponent, {
      data:     shop,
      width:    '520px',
      maxWidth: '95vw',
    });
  }

  openWhatsApp(shop: AdminShop): void {
    const msg = encodeURIComponent(
      `Bonjour ${shop.name}, nous vous contactons depuis la plateforme.`
    );
    window.open(`https://wa.me/${shop.phone}?text=${msg}`, '_blank');
  }

  openPublicShop(shop: AdminShop): void {
    window.open(`/shop/${shop.slug}`, '_blank');
  }

  isUrl(v: string): boolean {
    return !!v && (v.startsWith('http') || v.startsWith('data:'));
  }
}
