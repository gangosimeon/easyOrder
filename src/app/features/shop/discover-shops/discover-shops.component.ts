import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { catchError, map, of } from 'rxjs';
import {
  PublicShopService, PublicShopInfo, PublicCategory,
} from '../../../core/services/public-shop.service';
import { AdminService, AdminShop } from '../../../core/services/admin.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product } from '../../../models/product.model';
import { LandingNavComponent } from '../../landing/components/landing-nav/landing-nav.component';

interface ShopCard {
  info:            PublicShopInfo;
  products:        Product[];
  productsLoading: boolean;
}

function toPublicShopInfo(shop: AdminShop): PublicShopInfo {
  return {
    id:           shop.id,
    name:         shop.name,
    slug:         shop.slug,
    address:      shop.address,
    logo:         shop.logo,
    coverColor:   shop.coverColor,
    productCount: shop.productCount,
    status:       shop.status,
    categories:   [],
  };
}

@Component({
  selector: 'app-discover-shops',
  standalone: true,
  imports: [MatIconModule, MatRippleModule, LandingNavComponent],
  templateUrl: './discover-shops.component.html',
  styleUrls: ['./discover-shops.component.scss'],
})
export class DiscoverShopsComponent implements OnInit, OnDestroy {
  private publicShopService = inject(PublicShopService);
  private adminService      = inject(AdminService);
  private authService       = inject(AuthService);
  private router            = inject(Router);

  readonly loading         = signal(true);
  readonly reloading       = signal(false);
  readonly error           = signal<string | null>(null);
  readonly shops           = signal<ShopCard[]>([]);
  readonly allCategories   = signal<PublicCategory[]>([]);
  readonly searchQuery     = signal('');
  readonly activeCategory  = signal('all');
  readonly skeletonRows    = Array(6).fill(0);

  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.loadCategories();
    this.loadShops(true);
  }

  ngOnDestroy(): void {
    if (this.searchTimer) clearTimeout(this.searchTimer);
  }

  // ── Charger la liste des catégories disponibles (filter bar) ──────────────

  loadCategories(): void {
    this.publicShopService.getPublicCategories().subscribe({
      next:  cats => this.allCategories.set(cats),
      error: ()   => {},
    });
  }

  // ── Charger les boutiques avec filtres backend ────────────────────────────

  loadShops(firstLoad = false): void {
    firstLoad ? this.loading.set(true) : this.reloading.set(true);
    this.error.set(null);

    const search   = this.searchQuery().trim();
    const category = this.activeCategory() !== 'all' ? this.activeCategory() : '';

    const shops$ = this.publicShopService.getShopsList({ search, category }).pipe(
      catchError(() => {
        if (this.authService.isLoggedIn()) {
          return this.adminService.getShops({ search, status: 'active', limit: 50 }).pipe(
            map(data => data.shops.map(toPublicShopInfo))
          );
        }
        return of(null);
      })
    );

    shops$.subscribe({
      next: (shopInfos) => {
        if (!shopInfos) {
          this.error.set('Impossible de charger les boutiques.');
          this.loading.set(false);
          this.reloading.set(false);
          return;
        }
        const cards: ShopCard[] = shopInfos.map(shop => ({
          info:            shop,
          products:        [],
          productsLoading: true,
        }));
        this.shops.set(cards);
        this.loading.set(false);
        this.reloading.set(false);
        this.loadProductDetails(shopInfos);
      },
      error: () => {
        this.error.set('Impossible de charger les boutiques.');
        this.loading.set(false);
        this.reloading.set(false);
      },
    });
  }

  private loadProductDetails(shopInfos: PublicShopInfo[]): void {
    shopInfos.forEach(shop => {
      this.publicShopService.getShop(shop.slug).subscribe({
        next: data => {
          const products = data.products.filter(p => this.isUrl(p.image));
          this.shops.update(list =>
            list.map(s =>
              s.info.slug === shop.slug
                ? { ...s, products, productsLoading: false }
                : s
            )
          );
        },
        error: () => {
          this.shops.update(list =>
            list.map(s =>
              s.info.slug === shop.slug ? { ...s, productsLoading: false } : s
            )
          );
        },
      });
    });
  }

  // ── Actions utilisateur ───────────────────────────────────────────────────

  onSearch(value: string): void {
    this.searchQuery.set(value);
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.loadShops(false), 420);
  }

  clearSearch(): void {
    this.searchQuery.set('');
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.loadShops(false);
  }

  selectCategory(cat: string): void {
    this.activeCategory.set(cat);
    this.loadShops(false);
  }

  visitShop(slug: string, event?: Event): void {
    event?.stopPropagation();
    this.router.navigate(['/shop', slug]);
  }

  carouselNext(shopSlug: string, event: Event): void {
    event.stopPropagation();
    document.getElementById(`carousel-${shopSlug}`)?.scrollBy({ left: 140, behavior: 'smooth' });
  }

  carouselPrev(shopSlug: string, event: Event): void {
    event.stopPropagation();
    document.getElementById(`carousel-${shopSlug}`)?.scrollBy({ left: -140, behavior: 'smooth' });
  }

  isUrl(value: string): boolean {
    return !!value && (value.startsWith('http') || value.startsWith('data:'));
  }

  getBannerImage(card: ShopCard): string {
    return card.products[0]?.image ?? '';
  }

  getBannerBackground(card: ShopCard): string {
    const color = card.info.coverColor || '#E8521A';
    return `linear-gradient(135deg, ${color}dd, ${color}88)`;
  }
}
