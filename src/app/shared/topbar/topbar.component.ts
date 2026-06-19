import {
  Component, inject, computed, signal, input,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../core/services/auth.service';
import { ShopOrdersService } from '../../core/services/shop-orders.service';

interface BreadcrumbItem { label: string; route?: string; }
interface QuickAction    { label: string; icon: string; route: string; color: string; }

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule, MatRippleModule, MatTooltipModule],
  templateUrl: './topbar.component.html',
  styleUrl:    './topbar.component.scss',
})
export class TopbarComponent {
  readonly coverColor = input<string | undefined>('');
  readonly isAdmin    = input<boolean>(false);

  readonly authService   = inject(AuthService);
  private readonly orders = inject(ShopOrdersService);
  private readonly router = inject(Router);

  readonly pendingCount = computed(() =>
    this.orders.orders().filter(o => o.status === 'pending').length
  );

  readonly showQuick = signal(false);
  readonly showNotif = signal(false);
  readonly showUser  = signal(false);

  private readonly ROUTE_META: Record<string, { label: string; icon: string; parent?: string }> = {
    // '/dashboard':           { label: 'Tableau de bord', icon: 'dashboard'        },
    '/categories':          { label: 'Catégories',      icon: 'category'         },
    '/products':            { label: 'Produits',        icon: 'inventory_2'      },
    '/annonces':            { label: 'Annonces',        icon: 'campaign'         },
    '/orders':              { label: 'Commandes',       icon: 'receipt_long'     },
    '/profile':             { label: 'Mon Profil',      icon: 'manage_accounts'  },
    '/admin/shops':         { label: 'Boutiques',       icon: 'storefront',       parent: 'Administration' },
    '/admin/announcements': { label: 'Annonces',        icon: 'campaign',         parent: 'Administration' },
  };

  private readonly url$ = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map((e: NavigationEnd) => e.urlAfterRedirects.split('?')[0])
    ),
    { initialValue: this.router.url.split('?')[0] }
  );

  readonly breadcrumb = computed<BreadcrumbItem[]>(() => {
    const url  = this.url$() ?? '/';
    const meta = this.ROUTE_META[url];
    if (!meta) return [{ label: 'Tableau de bord' }];
    const crumbs: BreadcrumbItem[] = [];
    if (meta.parent) crumbs.push({ label: meta.parent });
    crumbs.push({ label: meta.label, route: url });
    return crumbs;
  });

  readonly pageIcon = computed(() =>
    this.ROUTE_META[this.url$() ?? '']?.icon ?? 'dashboard'
  );

  readonly quickActions: QuickAction[] = [
    { label: 'Nouveau produit',    icon: 'inventory_2', route: '/products',   color: '#3b82f6' },
    { label: 'Nouvelle catégorie', icon: 'category',    route: '/categories', color: '#8b5cf6' },
    { label: 'Nouvelle annonce',   icon: 'campaign',    route: '/annonces',   color: '#f59e0b' },
  ];

  closeAll(): void {
    this.showQuick.set(false);
    this.showNotif.set(false);
    this.showUser.set(false);
  }

  toggle(p: 'quick' | 'notif' | 'user'): void {
    const was = p === 'quick' ? this.showQuick()
              : p === 'notif' ? this.showNotif()
              : this.showUser();
    this.closeAll();
    if (!was) {
      if (p === 'quick') this.showQuick.set(true);
      else if (p === 'notif') this.showNotif.set(true);
      else this.showUser.set(true);
    }
  }

  isUrl(v?: string): boolean {
    return !!v && (v.startsWith('http') || v.startsWith('data:'));
  }

  onImgError(e: Event): void {
    (e.target as HTMLImageElement).style.display = 'none';
  }
}
