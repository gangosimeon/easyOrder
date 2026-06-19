import { Component, inject, computed, input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-public-topbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule, MatRippleModule],
  templateUrl: './public-topbar.component.html',
  styleUrl:    './public-topbar.component.scss',
})
export class PublicTopbarComponent {
  readonly coverColor = input<string | undefined>('');

  readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  readonly cartCount = toSignal(
    this.cartService.items$.pipe(map(i => i.length)),
    { initialValue: 0 }
  );

  private readonly url$ = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map((e: NavigationEnd) => e.urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );

  readonly isCartPage = computed(() =>
    (this.url$() ?? '').startsWith('/cart')
  );

  readonly currentCategory = computed(() => {
    const id = this.cartService.selectedCategoryId();
    if (!id) return null;
    return this.cartService.categories().find(c => c.id === id) ?? null;
  });

  readonly crumbLabel = computed(() => {
    if (this.isCartPage()) return 'Mon Panier';
    return this.currentCategory()?.name ?? 'Tous les produits';
  });

  readonly crumbIcon = computed(() => {
    if (this.isCartPage()) return 'shopping_cart';
    return this.currentCategory()?.icon ?? 'store';
  });

  contactWhatsApp(): void {
    const co = this.cartService.company();
    if (!co) return;
    const phone = co.fullPhone ?? co.phone;
    const msg = encodeURIComponent('Bonjour, je viens de votre boutique en ligne');
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  }

  isUrl(v?: string): boolean {
    return !!v && (v.startsWith('http') || v.startsWith('data:'));
  }

  onImgError(e: Event): void {
    (e.target as HTMLImageElement).style.display = 'none';
  }
}
