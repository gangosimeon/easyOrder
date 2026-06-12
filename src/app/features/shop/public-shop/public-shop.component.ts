import {
  AfterViewInit, Component, ElementRef, inject,
  OnDestroy, OnInit, signal, computed, ViewChild,
} from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PublicShopService, ShopData } from '../../../core/services/public-shop.service';
import { CartService } from '../../../core/services/cart.service';
import { Annonce, ANNONCE_TYPE_CONFIG } from '../../../models/annonce.model';
import { Category } from '../../../models/category.model';
import { Product } from '../../../models/product.model';
import { MatRippleModule } from '@angular/material/core';
import { ProductDetailModalComponent } from '../../../shared/product-detail-modal/product-detail-modal.component';
import { HttpClient } from '@angular/common/http';
import { VisitorService } from '../../../core/services/visitor.service';
import { environment } from '../../../../environments/environment';
registerLocaleData(localeFr);

@Component({
  selector: 'app-public-shop',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatRippleModule,
    ProductDetailModalComponent,
  ],
  templateUrl: './public-shop.component.html',
  styleUrls: ['./public-shop.component.scss'],
})
export class PublicShopComponent implements OnInit, AfterViewInit, OnDestroy {
  private route        = inject(ActivatedRoute);
  private router       = inject(Router);
  private shopService  = inject(PublicShopService);
  readonly cartService = inject(CartService);
  private snackBar     = inject(MatSnackBar);
  private http         = inject(HttpClient);
  private visitorService = inject(VisitorService);

  @ViewChild('productSentinel') private sentinelRef!: ElementRef<HTMLDivElement>;

  readonly ANNONCE_TYPE_CONFIG = ANNONCE_TYPE_CONFIG;
  readonly skeletonAnn      = Array(2).fill(0);
  readonly skeletonCats     = Array(4).fill(0);
  readonly skeletonProducts = Array(4).fill(0);

  readonly loading             = signal(true);
  readonly error               = signal<string | null>(null);
  readonly shopData            = signal<ShopData | null>(null);
  readonly allProducts         = signal<Product[]>([]);
  readonly productHasMore      = signal(false);
  readonly loadingMoreProducts = signal(false);
  readonly selectedAnn         = signal<Annonce | null>(null);
  readonly selectedDetailProduct = signal<Product | null>(null);
  readonly searchQuery         = signal('');

  private currentProductPage = 1;
  private shopSlug           = '';
  private observer: IntersectionObserver | null = null;

  openAnn(ann: Annonce): void  { this.selectedAnn.set(ann); }
  closeAnn(): void             { this.selectedAnn.set(null); }

  openProductDetail(product: Product, e: MouseEvent): void {
    e.stopPropagation();
    this.selectedDetailProduct.set(product);
  }

  closeProductDetail(): void {
    this.selectedDetailProduct.set(null);
  }

  getCategoryFor(product: Product | null) {
    if (!product) return undefined;
    return this.categories().find(c => c.id === product.categoryId);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  }

  readonly cartItems   = toSignal(this.cartService.items$, { initialValue: [] });
  readonly cartItemIds = computed(() => new Set(this.cartItems().map(i => i.product.id)));

  readonly company    = computed(() => this.shopData()?.company ?? null);
  readonly categories = computed(() => this.shopData()?.categories ?? []);

  readonly announcements = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const list = (this.shopData()?.announcements ?? []).filter(a => {
      if (!a.active) return false;
      const debut = new Date(a.dateDebut);
      debut.setHours(0, 0, 0, 0);
      if (debut > today) return false;
      if (a.dateFin) {
        const fin = new Date(a.dateFin);
        fin.setHours(23, 59, 59, 999);
        if (fin < today) return false;
      }
      return true;
    });
    return list.sort((a, b) => (b.epinglee ? 1 : 0) - (a.epinglee ? 1 : 0));
  });

  readonly productsByCategory = computed(() => {
    const cats  = this.categories();
    const catId = this.cartService.selectedCategoryId();
    const q     = this.searchQuery().trim().toLowerCase();

    let filtered = catId
      ? this.allProducts().filter(p => p.categoryId === catId)
      : this.allProducts();
    if (q) filtered = filtered.filter(p => p.name.toLowerCase().includes(q));

    const groups: { category: Category; products: Product[] }[] = [];
    for (const cat of cats) {
      const prods = filtered.filter(p => p.categoryId === cat.id);
      if (prods.length > 0) groups.push({ category: cat, products: prods });
    }
    const uncategorized = filtered.filter(p => !cats.find(c => c.id === p.categoryId));
    if (uncategorized.length > 0) {
      groups.push({
        category: { id: '__none__', name: 'Autres', icon: 'inventory_2', color: '#9CA3AF', createdAt: new Date() },
        products: uncategorized,
      });
    }
    return groups;
  });

  onSearch(value: string): void { this.searchQuery.set(value); }
  clearSearch(): void           { this.searchQuery.set(''); }

  ngOnInit(): void {
    this.cartService.selectCategory(null);
    const slug   = this.route.snapshot.paramMap.get('slug') ?? '';
    const source = this.route.snapshot.queryParamMap.get('source') ?? undefined;
    this.shopSlug = slug;

    this.shopService.getShop(slug).subscribe({
      next: data => {
        this.shopData.set(data);
        this.allProducts.set(data.products);
        this.productHasMore.set(data.productHasMore ?? false);
        this.currentProductPage = 1;
        this.cartService.setCompany({
          name:        data.company.name,
          phone:       data.company.phone,
          slug:        data.company.slug,
          coverColor:  data.company.coverColor,
          description: data.company.description,
          address:     data.company.address,
          logo:        data.company.logo,
        });
        this.cartService.setCategories(data.categories);
        this.loading.set(false);
        this.trackVisit(data.company.id, source);
      },
      error: () => {
        this.error.set('Boutique introuvable ou erreur de chargement.');
        this.loading.set(false);
      },
    });
  }

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      entries => {
        if (
          entries[0].isIntersecting &&
          this.productHasMore() &&
          !this.loadingMoreProducts() &&
          !this.loading()
        ) {
          this.loadMoreProducts();
        }
      },
      { rootMargin: '400px' }
    );
    this.observer.observe(this.sentinelRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private loadMoreProducts(): void {
    if (!this.productHasMore() || this.loadingMoreProducts()) return;
    this.loadingMoreProducts.set(true);
    const nextPage = this.currentProductPage + 1;

    this.shopService.getShop(this.shopSlug, nextPage).subscribe({
      next: data => {
        this.allProducts.update(list => [...list, ...data.products]);
        this.productHasMore.set(data.productHasMore ?? false);
        this.currentProductPage = nextPage;
        this.loadingMoreProducts.set(false);
      },
      error: () => {
        this.loadingMoreProducts.set(false);
      },
    });
  }

  private trackVisit(shopId: string | undefined, source?: string): void {
    if (!shopId) return;
    const visitorId = this.visitorService.getVisitorId();
    this.http.post(`${environment.apiUrl}/shops/visit`, { shopId, visitorId, source }).subscribe({});
  }

  selectCategory(id: string | null): void {
    this.cartService.selectCategory(id);
  }

  toggleProduct(product: Product): void {
    if (this.cartItems().some(i => i.product.id === product.id)) {
      this.cartService.removeProduct(product.id);
    } else {
      this.cartService.addProduct(product);
    }
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  contactViaWhatsApp(): void {
    const company = this.company();
    if (!company) return;
    const msg = encodeURIComponent('Bonjour, je viens de votre boutique en ligne');
    window.open(`https://wa.me/${company.phone}?text=${msg}`, '_blank');
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  }

  getShareUrl(slug: string): string {
    return `${environment.shareBaseUrl}/shop/${slug}`;
  }

  shareShop(): void {
    const slug = this.company()?.slug;
    if (!slug) return;
    const url = this.getShareUrl(slug);
    if (navigator.share) {
      navigator.share({ title: this.company()?.name ?? '', url });
    } else {
      navigator.clipboard.writeText(url);
      this.snackBar.open('🔗 Lien copié !', '', { duration: 2000 });
    }
  }

  isUrl(value: string): boolean {
    return !!value && (value.startsWith('http') || value.startsWith('data:'));
  }
}
