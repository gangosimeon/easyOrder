import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PublicShopService, ShopData } from '../services/public-shop.service';
import { CartService } from '../services/cart.service';
import { Annonce, ANNONCE_TYPE_CONFIG } from '../models/annonce.model';
import { Category } from '../models/category.model';
import { Product } from '../models/product.model';

registerLocaleData(localeFr);

@Component({
  selector: 'app-public-shop',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './public-shop.component.html',
  styleUrls: ['./public-shop.component.scss'],
})
export class PublicShopComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private shopService = inject(PublicShopService);
  readonly cartService = inject(CartService);
  private snackBar = inject(MatSnackBar);

  readonly ANNONCE_TYPE_CONFIG = ANNONCE_TYPE_CONFIG;

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly shopData = signal<ShopData | null>(null);
  readonly selectedAnn = signal<Annonce | null>(null);

  openAnn(ann: Annonce): void  { this.selectedAnn.set(ann); }
  closeAnn(): void             { this.selectedAnn.set(null); }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  }

  readonly cartItems = toSignal(this.cartService.items$, { initialValue: [] });
  readonly cartItemIds = computed(() => new Set(this.cartItems().map(i => i.product.id)));

  readonly company = computed(() => this.shopData()?.company ?? null);
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
    const allProducts = this.shopData()?.products ?? [];
    const cats = this.categories();
    const catId = this.cartService.selectedCategoryId();
    const filtered = catId ? allProducts.filter(p => p.categoryId === catId) : allProducts;

    const groups: { category: Category; products: Product[] }[] = [];
    for (const cat of cats) {
      const prods = filtered.filter(p => p.categoryId === cat.id);
      if (prods.length > 0) groups.push({ category: cat, products: prods });
    }
    const uncategorized = filtered.filter(p => !cats.find(c => c.id === p.categoryId));
    if (uncategorized.length > 0) {
      groups.push({
        category: {
          id: '__none__', name: 'Autres', icon: 'inventory_2',
          color: '#9CA3AF', createdAt: new Date(),
        },
        products: uncategorized,
      });
    }
    return groups;
  });

  ngOnInit(): void {
    this.cartService.selectCategory(null);
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    this.shopService.getShop(slug).subscribe({
      next: data => {
        this.shopData.set(data);
        this.cartService.setCompany({ name: data.company.name, phone: data.company.phone, slug: data.company.slug });
        this.cartService.setCategories(data.categories);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Boutique introuvable ou erreur de chargement.');
        this.loading.set(false);
      },
    });
  }

  selectCategory(id: string | null): void {
    this.cartService.selectCategory(id);
  }

  toggleProduct(product: Product): void {
    if (this.cartItems().some(i => i.product.id === product.id)) {
      this.cartService.removeProduct(product.id);
      this.snackBar.open(`${product.name} retiré du panier`, '', { duration: 1500 });
    } else {
      this.cartService.addProduct(product);
      this.snackBar.open(`✅ ${product.name} ajouté au panier !`, '', {
        duration: 1800,
        panelClass: ['snack-success'],
      });
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
}
