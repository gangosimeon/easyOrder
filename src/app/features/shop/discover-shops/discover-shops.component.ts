import {
  AfterViewInit, Component, ElementRef, inject,
  OnDestroy, OnInit, computed, signal, ViewChild,
} from '@angular/core';
import { Router }           from '@angular/router';
import { MatIconModule }    from '@angular/material/icon';
import { MatRippleModule }  from '@angular/material/core';
import { NgTemplateOutlet } from '@angular/common';
import { catchError, map, Observable, of } from 'rxjs';
import {
  PublicShopService, PublicShopInfo, PublicCategory, ShopsListResponse,
} from '../../../core/services/public-shop.service';
import { AdminService, AdminShop } from '../../../core/services/admin.service';
import { AuthService }             from '../../../core/services/auth.service';
import { CountryService }          from '../../../core/services/country.service';
import { LandingNavComponent }     from '../../landing/components/landing-nav/landing-nav.component';

interface ShopCard {
  info: PublicShopInfo;
}

function toPublicShopInfo(shop: AdminShop): PublicShopInfo {
  return {
    id:              shop.id,
    name:            shop.name,
    slug:            shop.slug,
    address:         shop.address,
    logo:            shop.logo,
    coverColor:      shop.coverColor,
    countryCode:     '',
    country:         '',
    productCount:    shop.productCount,
    status:          shop.status,
    categories:      [],
    previewProducts: [],
  };
}

@Component({
  selector: 'app-discover-shops',
  standalone: true,
  imports: [MatIconModule, MatRippleModule, NgTemplateOutlet, LandingNavComponent],
  templateUrl: './discover-shops.component.html',
  styleUrls: ['./discover-shops.component.scss'],
})
export class DiscoverShopsComponent implements OnInit, AfterViewInit, OnDestroy {
  private publicShopService = inject(PublicShopService);
  private adminService      = inject(AdminService);
  private authService       = inject(AuthService);
  readonly countryService   = inject(CountryService);
  private router            = inject(Router);

  @ViewChild('infiniteSentinel') private sentinelRef!: ElementRef<HTMLDivElement>;

  // ── Chargement ────────────────────────────────────────────────────────────
  readonly loading        = signal(true);
  readonly loadingMore    = signal(false);
  readonly reloading      = signal(false);
  readonly error          = signal<string | null>(null);

  // ── Données brutes (toutes boutiques, triées par backend) ─────────────────
  readonly shops          = signal<ShopCard[]>([]);

  // ── Filtres ───────────────────────────────────────────────────────────────
  readonly allCategories  = signal<PublicCategory[]>([]);
  readonly searchQuery    = signal('');
  readonly activeCategory = signal('all');
  readonly hasMore        = signal(false);
  readonly skeletonRows   = Array(6).fill(0);

  // ── Pays ──────────────────────────────────────────────────────────────────
  readonly detectedCountryCode = computed(() => this.countryService.detectedDialCode());
  readonly countryName         = computed(() => this.countryService.countryName());
  readonly countryFlag         = computed(() => this.countryService.flagEmoji());
  readonly countryFlagUrl      = computed(() => this.countryService.flagImageUrl());
  readonly allCountries        = this.countryService.allCountries;
  readonly showCountrySelector = signal(false);

  /** Boutiques du pays détecté. */
  readonly localShops = computed(() => {
    const code = this.detectedCountryCode();
    if (!code) return [];
    return this.shops().filter(s => s.info.countryCode === code);
  });

  /** Boutiques des autres pays (ou toutes si aucun pays détecté). */
  readonly otherShops = computed(() => {
    const code = this.detectedCountryCode();
    if (!code) return this.shops();
    return this.shops().filter(s => s.info.countryCode !== code);
  });

  readonly hasLocalShops = computed(() => this.localShops().length > 0);

  // ── Interne ───────────────────────────────────────────────────────────────
  private currentPage = 1;
  private searchTimer: ReturnType<typeof setTimeout> | null = null;
  private observer: IntersectionObserver | null = null;

  ngOnInit(): void {
    this.publicShopService.invalidateCategoriesCache();
    this.loadCategories();

    // Résoudre le pays AVANT de charger les boutiques pour que le backend
    // puisse trier les boutiques du pays du visiteur en premier.
    // - localStorage disponible → synchrone (of()), pas de délai perceptible.
    // - Détection IP → ~300-600ms, le skeleton est affiché pendant ce temps.
    this.loading.set(true);
    this.countryService.init().subscribe(() => {
      this.loadShops(true);
    });
  }

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && this.hasMore() && !this.loadingMore() && !this.loading()) {
          this.loadMoreShops();
        }
      },
      { rootMargin: '400px' }
    );
    this.observer.observe(this.sentinelRef.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.observer?.disconnect();
  }

  // ── Catégories ────────────────────────────────────────────────────────────

  loadCategories(): void {
    this.publicShopService.getPublicCategories().subscribe({
      next:  cats => this.allCategories.set(cats),
      error: ()   => {},
    });
  }

  // ── Chargement initial / rechargement (reset page 1) ─────────────────────

  loadShops(firstLoad = false): void {
    this.currentPage = 1;
    firstLoad ? this.loading.set(true) : this.reloading.set(true);
    this.error.set(null);

    this.fetchPage(1).subscribe({
      next: response => {
        this.shops.set(response.shops.map(s => ({ info: s })));
        this.hasMore.set(response.hasMore);
        this.loading.set(false);
        this.reloading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger les boutiques.');
        this.loading.set(false);
        this.reloading.set(false);
      },
    });
  }

  // ── Chargement page suivante ──────────────────────────────────────────────

  private loadMoreShops(): void {
    if (!this.hasMore() || this.loadingMore()) return;
    this.loadingMore.set(true);
    const nextPage = this.currentPage + 1;

    this.fetchPage(nextPage).subscribe({
      next: response => {
        this.shops.update(list => [...list, ...response.shops.map(s => ({ info: s }))]);
        this.hasMore.set(response.hasMore);
        this.currentPage = nextPage;
        this.loadingMore.set(false);
      },
      error: () => { this.loadingMore.set(false); },
    });
  }

  // ── Requête commune ───────────────────────────────────────────────────────

  private fetchPage(page: number): Observable<ShopsListResponse> {
    const search      = this.searchQuery().trim();
    const category    = this.activeCategory() !== 'all' ? this.activeCategory() : '';
    const countryCode = this.detectedCountryCode() ?? undefined;

    return this.publicShopService.getShopsList({ search, category, page, limit: 25, countryCode }).pipe(
      catchError(() => {
        if (page === 1 && this.authService.isLoggedIn()) {
          return this.adminService.getShops({ search, status: 'active', limit: 50 }).pipe(
            map(data => ({
              shops:      data.shops.map(toPublicShopInfo),
              page:       1,
              limit:      50,
              totalPages: 1,
              totalItems: data.shops.length,
              hasMore:    false,
            } satisfies ShopsListResponse))
          );
        }
        return of<ShopsListResponse>({
          shops: [], page, limit: 25, totalPages: 0, totalItems: 0, hasMore: false,
        });
      })
    );
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

  // ── Sélecteur de pays ─────────────────────────────────────────────────────

  toggleCountrySelector(): void {
    this.showCountrySelector.update(v => !v);
  }

  closeCountrySelector(): void {
    this.showCountrySelector.set(false);
  }

  /** Change le pays manuellement : sauvegarde + rechargement des boutiques. */
  selectCountry(dialCode: string): void {
    this.countryService.setCountryByDialCode(dialCode);
    this.showCountrySelector.set(false);
    this.loadShops(false);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  isUrl(value: string): boolean {
    return !!value && (value.startsWith('http') || value.startsWith('data:'));
  }

  getBannerImage(card: ShopCard): string {
    return card.info.previewProducts?.find(p => this.isUrl(p.image))?.image ?? '';
  }

  getBannerBackground(card: ShopCard): string {
    const color = card.info.coverColor || '#008060';
    return `linear-gradient(135deg, ${color}dd, ${color}88)`;
  }
}
