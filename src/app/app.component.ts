import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { filter, map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { CartService } from './core/services/cart.service';
import { AuthService } from './core/services/auth.service';
import { ShopOrdersService } from './core/services/shop-orders.service';
import { AnnouncementBannerComponent } from './shared/announcement-banner/announcement-banner.component';
import { ProductService } from './core/services/product.service';
import { CategoryService } from './core/services/category.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, MatRippleModule, AnnouncementBannerComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  readonly cartService  = inject(CartService);
  readonly authService  = inject(AuthService);
  readonly ordersService = inject(ShopOrdersService);
  readonly productService = inject(ProductService);
  readonly categoryService = inject(CategoryService);
  readonly cartCount = toSignal(this.cartService.items$.pipe(map(items => items.length)), { initialValue: 0 });
  readonly pendingOrdersCount = computed(() =>
    this.ordersService.orders().filter(o => o.status === 'pending').length
  );
  private visibilityHandler?: () => void;

  readonly isPublicRoute = signal(
    window.location.pathname.startsWith('/shop') || window.location.pathname.startsWith('/cart')
  );

  readonly isAuthRoute = signal(
    window.location.pathname.startsWith('/login') ||
    window.location.pathname.startsWith('/register') ||
    window.location.pathname === '/'
  );

  readonly coverColor = computed(() =>
    this.isPublicRoute()
      ? this.cartService.company()?.coverColor
      : this.authService.company()?.coverColor
  );

  readonly navItems: NavItem[] = [
    { label: 'Catégories', icon: 'category',        route: '/categories' },
    { label: 'Produits',   icon: 'inventory_2',     route: '/products'   },
    { label: 'Annonces',   icon: 'campaign',        route: '/annonces'   },
    { label: 'Mes Commandes', icon: 'receipt_long', route: '/orders'     },
    { label: 'Mon Profil', icon: 'manage_accounts', route: '/profile'   },
  ];

  readonly adminNavItems: NavItem[] = [
    { label: 'Boutiques', icon: 'storefront', route: '/admin/shops'          },
    { label: 'Annonces',  icon: 'flag',       route: '/admin/announcements'  },
  ];

  readonly isAdmin = computed(() => this.authService.company()?.role === 'admin');

  constructor() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: NavigationEnd) => {
      const url = e.urlAfterRedirects;
      const pathname = window.location.pathname;
      this.isPublicRoute.set(url.startsWith('/shop') || url.startsWith('/cart'));
      this.isAuthRoute.set(pathname.startsWith('/login') || pathname.startsWith('/register') || pathname === '/');
    });
  }

  ngOnInit(): void {
    // Reload data when app becomes visible after being hidden
    this.visibilityHandler = () => {
      if (!document.hidden && this.authService.isLoggedIn()) {
        // Reload all data - token refresh will handle expired tokens automatically
        this.ordersService.reload();
        this.productService.reload();
        this.categoryService.reload();
      }
    };

    document.addEventListener('visibilitychange', this.visibilityHandler);
  }

  ngOnDestroy(): void {
    if (this.visibilityHandler) {
      document.removeEventListener('visibilitychange', this.visibilityHandler);
    }
  }

  selectPublicCategory(id: string | null): void {
    this.cartService.selectCategory(id);
    const slug = this.cartService.company()?.slug;
    if (slug && !this.router.url.startsWith('/shop')) {
      this.router.navigate(['/shop', slug]);
    }
  }

  contactWhatsApp(): void {
    const company = this.cartService.company();
    if (!company) return;
    const msg = encodeURIComponent('Bonjour, je viens de votre boutique en ligne');
    window.open(`https://wa.me/${company.phone}?text=${msg}`, '_blank');
  }
  
  isUrl(value?: string): boolean {
    return !!value && (value.startsWith('http') || value.startsWith('data:'));
  }
  onImgError(event: Event): void {
    const el = event.target as HTMLImageElement;
    el.style.display = 'none';
    const parent = el.parentElement;
    if (parent) {
      const span = document.createElement('span');
      span.className = 'product-emoji';
      span.textContent = '🛍️';
      parent.appendChild(span);
    }
  }
}
