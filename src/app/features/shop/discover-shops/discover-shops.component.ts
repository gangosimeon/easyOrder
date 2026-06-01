import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { catchError, map, of } from 'rxjs';
import { PublicShopService, PublicShopInfo } from '../../../core/services/public-shop.service';
import { AdminService, AdminShop } from '../../../core/services/admin.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product } from '../../../models/product.model';
import { Category } from '../../../models/category.model';
import { LandingNavComponent } from '../../landing/components/landing-nav/landing-nav.component';

interface ShopCard {
  info: PublicShopInfo;
  products: Product[];
  categories: Category[];
  mainCategory: string;
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
  };
}

@Component({
  selector: 'app-discover-shops',
  standalone: true,
  imports: [MatIconModule, MatRippleModule, LandingNavComponent],
  templateUrl: './discover-shops.component.html',
  styleUrls: ['./discover-shops.component.scss'],
})
export class DiscoverShopsComponent implements OnInit {
  private publicShopService = inject(PublicShopService);
  private adminService      = inject(AdminService);
  private authService       = inject(AuthService);
  private router            = inject(Router);

  readonly loading        = signal(true);
  readonly error          = signal<string | null>(null);
  readonly shops          = signal<ShopCard[]>([]);
  readonly searchQuery    = signal('');
  readonly activeCategory = signal('all');
  readonly skeletonRows   = Array(6).fill(0);

  readonly categories = computed(() => {
    const set = new Set<string>();
    this.shops().forEach(s => { if (s.mainCategory) set.add(s.mainCategory); });
    return Array.from(set);
  });

  readonly filteredShops = computed(() => {
    const q   = this.searchQuery().trim().toLowerCase();
    const cat = this.activeCategory();
    return this.shops().filter(s => {
      const matchQ   = !q || s.info.name.toLowerCase().includes(q);
      const matchCat = cat === 'all' || s.mainCategory === cat;
      return matchQ && matchCat;
    });
  });

  ngOnInit(): void {
    // Tenter l'endpoint public, fallback sur admin si authentifié
    const shops$ = this.publicShopService.getShopsList().pipe(
      catchError(() => {
        if (this.authService.isLoggedIn()) {
          return this.adminService.getShops({ status: 'active', limit: 50 }).pipe(
            map(data => data.shops.map(toPublicShopInfo))
          );
        }
        return of(null);
      })
    );

    shops$.subscribe({
      next: (shops) => {
        if (!shops) {
          this.error.set('Impossible de charger les boutiques.');
          this.loading.set(false);
          return;
        }
        const cards: ShopCard[] = shops.map(shop => ({
          info: shop,
          products: [],
          categories: [],
          mainCategory: '',
          productsLoading: true,
        }));
        this.shops.set(cards);
        this.loading.set(false);
        this.loadProductDetails(shops);
      },
      error: () => {
        this.error.set('Impossible de charger les boutiques.');
        this.loading.set(false);
      },
    });
  }

  private loadProductDetails(shops: PublicShopInfo[]): void {
    shops.forEach(shop => {
      this.publicShopService.getShop(shop.slug).subscribe({
        next: data => {
          const products     = data.products.filter(p => this.isUrl(p.image));
          const categories   = data.categories;
          const mainCategory = categories[0]?.name ?? '';
          this.shops.update(list =>
            list.map(s =>
              s.info.slug === shop.slug
                ? { ...s, products, categories, mainCategory, productsLoading: false }
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

  visitShop(slug: string, event?: Event): void {
    event?.stopPropagation();
    this.router.navigate(['/shop', slug]);
  }

  onSearch(value: string): void     { this.searchQuery.set(value); }
  clearSearch(): void               { this.searchQuery.set(''); }
  selectCategory(cat: string): void { this.activeCategory.set(cat); }

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
