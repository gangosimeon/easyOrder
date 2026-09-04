import {
  AfterViewInit, Component, ElementRef, inject,
  OnDestroy, OnInit, signal, computed, effect, ViewChild,
} from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { SeoService } from '../../../core/services/seo.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PublicShopService, ShopData } from '../../../core/services/public-shop.service';
import { CartService } from '../../../core/services/cart.service';
import { CartDrawerService } from '../../../core/services/cart-drawer.service';
import { Annonce, ANNONCE_TYPE_CONFIG } from '../../../models/annonce.model';
import { Category } from '../../../models/category.model';
import { Product } from '../../../models/product.model';
import { MatRippleModule } from '@angular/material/core';
import { ProductDetailModalComponent } from '../../../shared/product-detail-modal/product-detail-modal.component';
import { HttpClient } from '@angular/common/http';
import { VisitorService } from '../../../core/services/visitor.service';
import { environment } from '../../../../environments/environment';
import { cloudinaryThumb } from '../../../core/utils/cloudinary.util';
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
  readonly cartService  = inject(CartService);
  private readonly cartDrawer = inject(CartDrawerService);
  private snackBar     = inject(MatSnackBar);
  private http         = inject(HttpClient);
  private visitorService = inject(VisitorService);
  private seo           = inject(SeoService);

  @ViewChild('productSentinel') private sentinelRef!: ElementRef<HTMLDivElement>;
  @ViewChild('annTrack') private annTrackRef?: ElementRef<HTMLDivElement>;

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
  readonly annCarouselIndex    = signal(0);
  readonly selectedDetailProduct = signal<Product | null>(null);
  readonly searchQuery         = signal('');
  readonly cameFromDiscover    = signal(false);

  private currentProductPage = 1;
  private shopSlug           = '';
  private observer: IntersectionObserver | null = null;

  constructor() {
    effect(() => {
      const productId = this.cartService.openProductRequest();
      if (!productId) return;
      const product = this.allProducts().find(p => p.id === productId);
      if (product) this.selectedDetailProduct.set(product);
      this.cartService.clearOpenProductRequest();
    });
  }

  openAnn(ann: Annonce): void  { this.selectedAnn.set(ann); }
  closeAnn(): void             { this.selectedAnn.set(null); }

  annDateLabel(ann: Annonce): string {
    if (!ann.dateFin) return 'Permanent';
    const sameYear = ann.dateDebut.getFullYear() === ann.dateFin.getFullYear();
    const startFmt = new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric', month: 'long', ...(sameYear ? {} : { year: 'numeric' as const }),
    });
    const endFmt = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    const startStr = startFmt.format(ann.dateDebut);
    const endStr   = endFmt.format(ann.dateFin);
    return startStr === endStr ? endStr : `${startStr} - ${endStr}`;
  }

  private annCardStep(): number {
    const track = this.annTrackRef?.nativeElement;
    const card  = track?.querySelector('.ann-card') as HTMLElement | null;
    return card ? card.offsetWidth + 12 : 260;
  }

  scrollAnnBy(dir: 1 | -1): void {
    this.annTrackRef?.nativeElement.scrollBy({ left: dir * this.annCardStep(), behavior: 'smooth' });
  }

  onAnnScroll(): void {
    const track = this.annTrackRef?.nativeElement;
    if (!track) return;
    this.annCarouselIndex.set(Math.round(track.scrollLeft / this.annCardStep()));
  }

  goToAnn(i: number): void {
    this.annTrackRef?.nativeElement.scrollTo({ left: i * this.annCardStep(), behavior: 'smooth' });
  }

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
    filtered = [...filtered].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

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

  private paramMapSub: { unsubscribe(): void } | null = null;

  ngOnInit(): void {
    this.cartService.selectCategory(null);

    // Souscription à paramMap (pas snapshot) : si Angular réutilise cette
    // instance de composant entre deux boutiques (même route "shop/:slug"),
    // ngOnInit ne serait pas ré-exécuté et le changement de boutique ne
    // serait jamais détecté. paramMap émet à chaque navigation, y compris
    // la première (synchrone), donc ça ne retarde pas le chargement initial.
    this.paramMapSub = this.route.paramMap.subscribe(params => {
      const slug   = params.get('slug') ?? '';
      const source = this.route.snapshot.queryParamMap.get('source') ?? undefined;
      const shopChanged = !!this.shopSlug && slug !== this.shopSlug;

      this.shopSlug = slug;
      this.cameFromDiscover.set(source === 'discover');

      if (this.cartService.company()?.slug !== slug) {
        this.cartService.clearShopContext(slug);
      }

      if (shopChanged) {
        this.shopData.set(null);
        this.allProducts.set([]);
        this.productHasMore.set(false);
        this.currentProductPage = 1;
        this.selectedAnn.set(null);
        this.annCarouselIndex.set(0);
        this.selectedDetailProduct.set(null);
        this.searchQuery.set('');
        this.error.set(null);
      }

      this.loading.set(true);
      this.loadShop(slug, source);
    });
  }

  private loadShop(slug: string, source: string | undefined): void {
    this.shopService.getShop(slug).subscribe({
      next: data => {
        this.shopData.set(data);
        this.allProducts.set(data.products);
        this.productHasMore.set(data.productHasMore ?? false);
        this.currentProductPage = 1;
        this.cartService.setCompany({
          name:        data.company.name,
          phone:       data.company.phone,
          fullPhone:   data.company.fullPhone,
          slug:        data.company.slug,
          coverColor:  data.company.coverColor,
          description: data.company.description,
          address:     data.company.address,
          logo:        data.company.logo,
        });
        this.cartService.setCategories(data.categories);
        this.cartService.setPreviewProducts(
          data.products
            .filter(p => this.isUrl(p.image))
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 6)
            .map(p => ({ id: p.id, image: p.image, name: p.name }))
        );
        this.loading.set(false);
        this.trackVisit(data.company.id, source);
        this.updateOgTags(data);
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
    this.paramMapSub?.unsubscribe();
    this.resetOgTags();
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

  private updateOgTags(data: ShopData): void {
    const base  = 'https://www.jecreemaboutique.com';
    const slug  = data.company.slug;
    const name  = data.company.name?.trim() || 'Boutique';
    const desc  = data.company.description?.trim()
      || `Découvrez les produits de ${name} sur JeCréeMaBoutique. Consultez son catalogue et contactez facilement le commerçant.`;
    const url   = `${base}/shop/${slug}`;
    const image = this.resolveOgImage(data, base);
    const title = `${name} | JeCréeMaBoutique`;

    this.seo.setTitle(title);
    this.seo.setDescription(desc);
    this.seo.setCanonical(url);
    this.seo.setSocial({ title, description: desc, url, image });
  }

  private resolveOgImage(data: ShopData, base: string): string {
    const fallback = `${base}/assets/icons/web-app-manifest-512x512.png`;
    const firstWithImg = data.products.find(p => p.image?.startsWith('http'));
    if (firstWithImg) return firstWithImg.image;
    if (data.company.logo?.startsWith('http')) return data.company.logo;
    return fallback;
  }

  private resetOgTags(): void {
    this.seo.reset();
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
    if (window.innerWidth > 768) {
      this.cartDrawer.open();
    } else {
      this.router.navigate(['/cart']);
    }
  }

  backToShops(): void {
    this.router.navigate(['/shops']);
  }

  contactViaWhatsApp(): void {
    const company = this.company();
    if (!company) return;
    const phone = (company.fullPhone ?? company.phone).replace(/\D/g, '');
    const msg   = encodeURIComponent('Bonjour, je viens de votre boutique en ligne');
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  }

  getShareUrl(slug: string): string {
    return `https://www.jecreemaboutique.com/shop/${slug}`;
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

  thumbUrl(url: string): string {
    return cloudinaryThumb(url, 300, 300);
  }
}
