import { Component, inject, signal, computed, OnInit, DestroyRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink }  from '@angular/router';
import { FormsModule }           from '@angular/forms';
import { MatDialog }             from '@angular/material/dialog';
import { MatIconModule }         from '@angular/material/icon';
import { MatButtonModule }       from '@angular/material/button';
import { MatRippleModule }       from '@angular/material/core';
import { MatSnackBar }           from '@angular/material/snack-bar';
import { MatTooltipModule }      from '@angular/material/tooltip';
import { MatDialogModule }       from '@angular/material/dialog';
import { MatSnackBarModule }     from '@angular/material/snack-bar';
import { takeUntilDestroyed }    from '@angular/core/rxjs-interop';  // ✅ Angular 20

import { Product }               from '../../../models/product.model';
import { Category }              from '../../../models/category.model';
import { ProductService }        from '../../../core/services/product.service';
import { CategoryService }       from '../../../core/services/category.service';
import { ProductFormComponent, ProductFormData } from '../product-form/product-form.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { ProductDetailModalComponent } from '../../../shared/product-detail-modal/product-detail-modal.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    RouterLink, FormsModule,
    MatDialogModule, MatIconModule, MatButtonModule,
    MatRippleModule, MatSnackBarModule, MatTooltipModule,
    ProductDetailModalComponent,
  ],
  templateUrl: './product-list.component.html',
  styleUrls:  ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  private productService  = inject(ProductService);
  private categoryService = inject(CategoryService);
  private dialog          = inject(MatDialog);
  private snackBar        = inject(MatSnackBar);
  private route           = inject(ActivatedRoute);
  private router          = inject(Router);
  private destroyRef = inject(DestroyRef);
  // Signals locaux
  selectedCategoryId      = signal<string>('all');
  searchQuery             = signal<string>('');
  selectedDetailProduct   = signal<Product | null>(null);

  openProductDetail(product: Product, e: MouseEvent): void {
    e.stopPropagation();
    this.selectedDetailProduct.set(product);
  }

  closeProductDetail(): void {
    this.selectedDetailProduct.set(null);
  }

  readonly selectedDetailCategory = computed(() => {
    const p = this.selectedDetailProduct();
    return p ? this.getCategoryFor(p) : undefined;
  });

  // Signals dérivés des services
  readonly categories = this.categoryService.categories;
  readonly allProducts = this.productService.products;

  // ✅ Angular 20 — computed() pour le filtrage réactif
  readonly filteredProducts = computed(() => {
    let result = this.allProducts();
    const catId = this.selectedCategoryId();
    const q     = this.searchQuery().trim().toLowerCase();

    if (catId !== 'all') result = result.filter(p => p.categoryId === catId);
    if (q)               result = result.filter(p => p.name.toLowerCase().includes(q));
    return result;
  });

  readonly selectedCategory = computed<Category | undefined>(() =>
    this.categories().find(c => c.id === this.selectedCategoryId())
  );

  ngOnInit(): void {
    // ✅ takeUntilDestroyed — plus besoin de Subject + ngOnDestroy
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      const catId = params.get('categoryId');
      this.selectedCategoryId.set(catId ?? 'all');
    });
  }

  getCategoryFor(product: Product): Category | undefined {
    return this.categories().find(c => c.id === product.categoryId);
  }

  onCategoryChange(catId: string): void {
    this.selectedCategoryId.set(catId);
    catId === 'all'
      ? this.router.navigate(['/products'])
      : this.router.navigate(['/products', catId]);
  }

  onSearch(value: string): void { this.searchQuery.set(value); }
  clearSearch(): void           { this.searchQuery.set(''); }

  fmt(price: number): string { return this.productService.formatPrice(price); }

  openAddDialog(): void {
    const category = this.selectedCategory() ?? this.categories()[0];
    if (!category) { this.snack('⚠️ Créez d\'abord une catégorie'); return; }

    this.dialog.open(ProductFormComponent, {
      width: '540px', maxWidth: '95vw',
      data: { mode: 'add', category } satisfies ProductFormData,
    }).afterClosed().subscribe(result => {
      if (result) { this.productService.add(result as Omit<Product,'id'|'createdAt'>); this.snack('✅ Produit ajouté !'); }
    });
  }

  openEditDialog(product: Product, e: MouseEvent): void {
    e.stopPropagation();
    const category = this.getCategoryFor(product);
    if (!category) return;

    this.dialog.open(ProductFormComponent, {
      width: '540px', maxWidth: '95vw',
      data: { mode: 'edit', product, category } satisfies ProductFormData,
    }).afterClosed().subscribe(result => {
      if (!result) return;
      this.dialog.open<ConfirmDialogComponent, ConfirmDialogData, boolean>(
        ConfirmDialogComponent,
        { data: { title: 'Modifier le produit', message: `Confirmer les modifications de "${product.name}" ?`, confirmLabel: 'Confirmer', icon: 'save', color: '#1976d2' }, width: '380px', autoFocus: false }
      ).afterClosed().subscribe(ok => {
        if (!ok) return;
        this.productService.update(product.id, result);
        this.snack('✅ Produit modifié !');
      });
    });
  }

  deleteProduct(product: Product, e: MouseEvent): void {
    e.stopPropagation();
    const ref = this.dialog.open<ConfirmDialogComponent, ConfirmDialogData, boolean>(
      ConfirmDialogComponent,
      { data: { title: 'Supprimer le produit', message: `Supprimer "${product.name}" ? Cette action est irréversible.`, confirmLabel: 'Confirmer' }, width: '380px', autoFocus: false }
    );
    ref.afterClosed().subscribe(ok => {
      if (!ok) return;
      this.productService.delete(product.id);
      this.snack('🗑️ Produit supprimé');
    });
  }

  isUrl(value: string): boolean {
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

  private snack(msg: string): void {
    this.snackBar.open(msg, 'OK', { duration: 3000, horizontalPosition: 'center', verticalPosition: 'bottom' });
  }
}
