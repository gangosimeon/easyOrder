import { Component, inject, signal, computed } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { filter, map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { CartService } from './core/services/cart.service';
import { AuthService } from './core/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, MatRippleModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private router = inject(Router);
  readonly cartService  = inject(CartService);
  readonly authService  = inject(AuthService);
  readonly cartCount = toSignal(this.cartService.items$.pipe(map(items => items.length)), { initialValue: 0 });

  readonly isPublicRoute = signal(
    window.location.pathname.startsWith('/shop') || window.location.pathname.startsWith('/cart')
  );

  readonly isAuthRoute = signal(
    window.location.pathname.startsWith('/login') || window.location.pathname.startsWith('/register')
  );

  readonly coverColor = computed(() =>
    this.isPublicRoute()
      ? this.cartService.company()?.coverColor
      : this.authService.company()?.coverColor
  );

  readonly navItems: NavItem[] = [
    { label: 'Catégories', icon: 'category',       route: '/categories' },
    { label: 'Produits',   icon: 'inventory_2',    route: '/products'   },
    { label: 'Annonces',   icon: 'campaign',       route: '/annonces'   },
    { label: 'Mon Profil', icon: 'manage_accounts', route: '/profile'   },
  ];

  constructor() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: NavigationEnd) => {
      const url = e.urlAfterRedirects;
      this.isPublicRoute.set(url.startsWith('/shop') || url.startsWith('/cart'));
      this.isAuthRoute.set(url.startsWith('/login') || url.startsWith('/register'));
    });
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
}
