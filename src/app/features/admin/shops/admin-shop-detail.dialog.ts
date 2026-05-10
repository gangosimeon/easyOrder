import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AdminShop, AdminShopDetail, AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-shop-detail-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule, MatTooltipModule, DatePipe, CurrencyPipe],
  template: `
    <!-- ── Header ── -->
    <div class="dlg-header"
      [style.background]="'linear-gradient(135deg,' + data.coverColor + '1a,' + data.coverColor + '08)'">
      <div class="dlg-identity">
        <div class="dlg-logo"
          [style.background]="data.coverColor + '28'"
          [style.border-color]="data.coverColor + '44'">
          @if (isUrl(data.logo)) {
            <img [src]="data.logo" [alt]="data.name" class="dlg-logo-img" />
          } @else {
            <span class="dlg-logo-emoji">{{ data.logo || '🏪' }}</span>
          }
        </div>
        <div class="dlg-identity-text">
          <div class="dlg-name-row">
            <h2 class="dlg-name">{{ data.name }}</h2>
            <span class="dlg-status-pill"
              [class.active]="data.status === 'active'"
              [class.inactive]="data.status !== 'active'">
              {{ data.status === 'active' ? 'Active' : 'Inactive' }}
            </span>
          </div>
          <span class="dlg-slug">/{{ data.slug }}</span>
        </div>
      </div>
      <button mat-icon-button class="dlg-close" [mat-dialog-close]="null" aria-label="Fermer">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content class="dlg-content">

      @if (detailLoading()) {
        <!-- Skeleton -->
        <div class="dlg-skel">
          <div class="skel-stats">
            @for (i of [0,1,2]; track i) {
              <div class="skel-stat-box">
                <div class="skel-b skel-num"></div>
                <div class="skel-b skel-lbl"></div>
              </div>
            }
          </div>
          @for (i of [0,1,2]; track i) {
            <div class="skel-info-row">
              <div class="skel-b skel-ico"></div>
              <div class="skel-info-text">
                <div class="skel-b skel-xs"></div>
                <div class="skel-b skel-md"></div>
              </div>
            </div>
          }
        </div>

      } @else {
        <!-- ── Stats row ── -->
        <div class="dlg-stats-row">
          <div class="dlg-stat">
            <span class="dlg-stat-val">{{ detail()?.productCount ?? data.productCount }}</span>
            <span class="dlg-stat-lbl">Produits</span>
          </div>
          <div class="dlg-divider"></div>
          <div class="dlg-stat">
            <span class="dlg-stat-val">{{ detail()?.categoryCount ?? '—' }}</span>
            <span class="dlg-stat-lbl">Catégories</span>
          </div>
          <div class="dlg-divider"></div>
          <div class="dlg-stat">
            <span class="dlg-stat-val">{{ detail()?.orderCount ?? '—' }}</span>
            <span class="dlg-stat-lbl">Commandes</span>
          </div>
        </div>

        <!-- ── Info list ── -->
        <div class="info-list">
          <div class="info-row">
            <div class="info-ico-wrap"><mat-icon>phone</mat-icon></div>
            <div><span class="info-lbl">Téléphone</span><span class="info-val">{{ data.phone }}</span></div>
          </div>
          @if (data.address) {
            <div class="info-row">
              <div class="info-ico-wrap"><mat-icon>location_on</mat-icon></div>
              <div><span class="info-lbl">Adresse</span><span class="info-val">{{ data.address }}</span></div>
            </div>
          }
          @if (data.description) {
            <div class="info-row">
              <div class="info-ico-wrap"><mat-icon>description</mat-icon></div>
              <div><span class="info-lbl">Description</span><span class="info-val">{{ data.description }}</span></div>
            </div>
          }
          <div class="info-row">
            <div class="info-ico-wrap"><mat-icon>event</mat-icon></div>
            <div>
              <span class="info-lbl">Inscrit le</span>
              <span class="info-val">{{ data.createdAt | date:'dd MMMM yyyy' }}</span>
            </div>
          </div>
          <div class="info-row">
            <div class="info-ico-wrap"><mat-icon>palette</mat-icon></div>
            <div class="info-color-row">
              <div><span class="info-lbl">Couleur</span><span class="info-val">{{ data.coverColor }}</span></div>
              <span class="color-swatch" [style.background]="data.coverColor"></span>
            </div>
          </div>
        </div>

        <!-- ── URL bar ── -->
        <div class="url-bar">
          <mat-icon class="url-ico">link</mat-icon>
          <span class="url-text">{{ shopUrl }}</span>
          <button mat-icon-button
            [matTooltip]="copied() ? 'Copié !' : 'Copier le lien'"
            (click)="copyUrl()">
            <mat-icon [style.color]="copied() ? '#10b981' : null">
              {{ copied() ? 'check_circle' : 'content_copy' }}
            </mat-icon>
          </button>
        </div>

        <!-- ── Recent products ── -->
        @if (detail()?.recentProducts?.length) {
          <div class="recent-section">
            <h4 class="section-title">
              <mat-icon>inventory_2</mat-icon> Produits récents
            </h4>
            <div class="product-list">
              @for (p of detail()!.recentProducts; track p.id) {
                <div class="product-item">
                  <div class="product-thumb">
                    @if (isUrl(p.image)) {
                      <img [src]="p.image" [alt]="p.name" />
                    } @else {
                      <span>📦</span>
                    }
                  </div>
                  <div class="product-info">
                    <span class="product-name">{{ p.name }}</span>
                    <span class="product-price">
                      {{ p.price | currency:'XOF':'symbol':'1.0-0' }}
                    </span>
                  </div>
                  <span class="stock-dot"
                    [class.in-stock]="p.inStock"
                    [class.out-stock]="!p.inStock"
                    [matTooltip]="p.inStock ? 'En stock' : 'Rupture de stock'">
                  </span>
                </div>
              }
            </div>
          </div>
        }
      }

    </mat-dialog-content>

    <mat-dialog-actions align="end" class="dlg-actions">
      <button mat-button [mat-dialog-close]="null">Fermer</button>
      <button mat-stroked-button class="wa-btn" (click)="openWhatsApp()">
        <mat-icon>chat</mat-icon> WhatsApp
      </button>
      <button mat-flat-button color="primary" (click)="openShop()">
        <mat-icon>open_in_new</mat-icon> Voir boutique
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    /* ── Header ── */
    .dlg-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 18px 20px 16px; border-bottom: 1px solid rgba(0,0,0,.07);
      gap: 8px;
    }
    .dlg-identity { display: flex; align-items: center; gap: 14px; flex: 1; min-width: 0; }
    .dlg-logo {
      width: 56px; height: 56px; border-radius: 16px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      overflow: hidden; border: 2px solid;
    }
    .dlg-logo-img   { width: 100%; height: 100%; object-fit: cover; }
    .dlg-logo-emoji { font-size: 28px; line-height: 1; }
    .dlg-identity-text { flex: 1; min-width: 0; }
    .dlg-name-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 3px; }
    .dlg-name  { margin: 0; font-size: 17px; font-weight: 700; color: #1a1a2e; }
    .dlg-slug  { font-size: 12px; color: #aaa; font-family: monospace; }
    .dlg-close { flex-shrink: 0; }

    .dlg-status-pill {
      display: inline-block; padding: 3px 9px; border-radius: 12px;
      font-size: 11px; font-weight: 700;
    }
    .dlg-status-pill.active   { background: #dcfce7; color: #16a34a; }
    .dlg-status-pill.inactive { background: #f3f4f6; color: #9ca3af; }

    /* ── Content ── */
    .dlg-content { padding: 0 20px 4px !important; min-width: 280px; }

    /* Stats row */
    .dlg-stats-row {
      display: flex; align-items: stretch;
      background: #f8f9ff; border-radius: 14px; margin: 16px 0; overflow: hidden;
    }
    .dlg-stat {
      flex: 1; text-align: center; padding: 14px 8px;
      display: flex; flex-direction: column; gap: 3px;
    }
    .dlg-divider  { width: 1px; background: #e8eaf0; flex-shrink: 0; margin: 10px 0; }
    .dlg-stat-val { font-size: 22px; font-weight: 700; color: #1a1a2e; }
    .dlg-stat-lbl { font-size: 11px; color: #9ca3af; font-weight: 500; }

    /* Info list */
    .info-list { display: flex; flex-direction: column; gap: 11px; }
    .info-row  { display: flex; align-items: flex-start; gap: 12px; }
    .info-ico-wrap {
      width: 32px; height: 32px; border-radius: 9px; background: #f3f4f6; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }
    .info-ico-wrap mat-icon { font-size: 17px; width: 17px; height: 17px; color: #9ca3af; }
    .info-lbl { display: block; font-size: 10px; color: #aaa; text-transform: uppercase; letter-spacing: .4px; margin-top: 1px; }
    .info-val { display: block; font-size: 13px; color: #1f2937; font-weight: 500; margin-top: 2px; }
    .info-color-row { display: flex; align-items: center; gap: 10px; justify-content: space-between; flex: 1; }
    .color-swatch { width: 20px; height: 20px; border-radius: 50%; border: 2px solid rgba(0,0,0,.1); flex-shrink: 0; }

    /* URL bar */
    .url-bar {
      display: flex; align-items: center; gap: 8px;
      background: #f7f7f7; border-radius: 10px; padding: 9px 12px; margin-top: 14px;
    }
    .url-ico  { font-size: 16px; color: #ccc; flex-shrink: 0; width: 16px; height: 16px; }
    .url-text { flex: 1; font-size: 11px; color: #666; font-family: monospace; word-break: break-all; }

    /* Recent products */
    .recent-section { margin-top: 16px; }
    .section-title {
      display: flex; align-items: center; gap: 6px; margin: 0 0 10px;
      font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: .5px;
    }
    .section-title mat-icon { font-size: 15px; width: 15px; height: 15px; }
    .product-list { display: flex; flex-direction: column; gap: 7px; }
    .product-item {
      display: flex; align-items: center; gap: 10px;
      padding: 8px 10px; background: #fafafa; border-radius: 10px;
      transition: background .15s;
      &:hover { background: #f3f4f6; }
    }
    .product-thumb {
      width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0;
      background: #f3f4f6; display: flex; align-items: center; justify-content: center; overflow: hidden;
      img  { width: 100%; height: 100%; object-fit: cover; }
      span { font-size: 18px; }
    }
    .product-info { flex: 1; min-width: 0; }
    .product-name  { display: block; font-size: 13px; font-weight: 500; color: #111; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .product-price { display: block; font-size: 12px; color: #9ca3af; }
    .stock-dot {
      width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
      &.in-stock  { background: #22c55e; }
      &.out-stock { background: #ef4444; }
    }

    /* Skeleton */
    @keyframes shimmer {
      from { background-position: -400px 0; }
      to   { background-position:  400px 0; }
    }
    .dlg-skel { padding: 16px 0; }
    .skel-stats { display: flex; gap: 8px; margin-bottom: 20px; }
    .skel-stat-box {
      flex: 1; background: #f8f8f8; border-radius: 12px;
      padding: 14px; display: flex; flex-direction: column; align-items: center; gap: 8px;
    }
    .skel-b {
      background: linear-gradient(90deg, #f0f0f0 25%, #e4e4e4 50%, #f0f0f0 75%);
      background-size: 800px 100%;
      animation: shimmer 1.4s infinite linear;
      border-radius: 6px;
    }
    .skel-num { width: 44px; height: 20px; }
    .skel-lbl { width: 56px; height: 10px; }
    .skel-info-row { display: flex; align-items: center; gap: 12px; margin-bottom: 11px; }
    .skel-ico  { width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0; }
    .skel-info-text { flex: 1; display: flex; flex-direction: column; gap: 6px; }
    .skel-xs { width: 38%; height: 9px; }
    .skel-md { width: 62%; height: 12px; }

    /* Actions */
    .dlg-actions { padding: 8px 16px 16px !important; gap: 8px; flex-wrap: wrap; }
    .wa-btn { color: #25D366 !important; border-color: #25D366 !important; }
  `],
})
export class AdminShopDetailDialogComponent implements OnInit {
  readonly data          = inject<AdminShop>(MAT_DIALOG_DATA);
  private adminService   = inject(AdminService);
  private destroyRef     = inject(DestroyRef);

  readonly copied        = signal(false);
  readonly detailLoading = signal(true);
  readonly detail        = signal<AdminShopDetail | null>(null);

  readonly shopUrl = `${window.location.origin}/shop/${this.data.slug}`;

  ngOnInit(): void {
    this.adminService.getShopById(this.data.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next:  d  => { this.detail.set(d); this.detailLoading.set(false); },
        error: () => this.detailLoading.set(false),
      });
  }

  isUrl(v: string): boolean {
    return !!v && (v.startsWith('http') || v.startsWith('data:'));
  }

  openShop(): void {
    window.open(`/shop/${this.data.slug}`, '_blank');
  }

  openWhatsApp(): void {
    const msg = encodeURIComponent(
      `Bonjour ${this.data.name}, nous vous contactons depuis la plateforme.`
    );
    window.open(`https://wa.me/${this.data.phone}?text=${msg}`, '_blank');
  }

  copyUrl(): void {
    navigator.clipboard.writeText(this.shopUrl).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }
}
