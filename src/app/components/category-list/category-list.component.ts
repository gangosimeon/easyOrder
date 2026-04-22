import { Component, inject, computed } from '@angular/core';
import { Router }              from '@angular/router';
import { MatDialog }           from '@angular/material/dialog';
import { MatIconModule }       from '@angular/material/icon';
import { MatButtonModule }     from '@angular/material/button';
import { MatRippleModule }     from '@angular/material/core';
import { MatSnackBar }         from '@angular/material/snack-bar';
import { MatTooltipModule }    from '@angular/material/tooltip';
import { MatDialogModule }     from '@angular/material/dialog';
import { MatSnackBarModule }   from '@angular/material/snack-bar';

import { Category }            from '../../models/category.model';
import { CategoryService }     from '../../services/category.service';
import { ProductService }      from '../../services/product.service';
import { CategoryFormComponent, CategoryFormData } from '../category-form/category-form.component';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    MatDialogModule, MatIconModule, MatButtonModule,
    MatRippleModule, MatSnackBarModule, MatTooltipModule,
  ],
  templateUrl: './category-list.component.html',
  styleUrls:  ['./category-list.component.scss'],
})
export class CategoryListComponent {
  // ✅ Angular 20 — inject() function (pas de constructeur)
  private categoryService = inject(CategoryService);
  private productService  = inject(ProductService);
  private dialog          = inject(MatDialog);
  private snackBar        = inject(MatSnackBar);
  private router          = inject(Router);

  // Signals consommés directement dans le template
  readonly categories = this.categoryService.categories;
  readonly count      = this.categoryService.count;

  // Signal calculé : stats par catégorie pour la barre
  readonly statsBar = computed(() =>
    this.categories().slice(0, 4).map(c => ({
      ...c,
      productCount: this.productService.countForCategory(c.id),
    }))
  );

  countFor(categoryId: string): number {
    return this.productService.countForCategory(categoryId);
  }

  openAddDialog(): void {
    this.dialog.open(CategoryFormComponent, {
      width: '520px', maxWidth: '95vw',
      data: { mode: 'add' } satisfies CategoryFormData,
    }).afterClosed().subscribe(result => {
      if (result) {
        this.categoryService.add(result);
        this.snack('✅ Catégorie créée !');
      }
    });
  }

  openEditDialog(cat: Category, e: MouseEvent): void {
    e.stopPropagation();
    this.dialog.open(CategoryFormComponent, {
      width: '520px', maxWidth: '95vw',
      data: { mode: 'edit', category: cat } satisfies CategoryFormData,
    }).afterClosed().subscribe(result => {
      if (result) {
        this.categoryService.update(cat.id, result);
        this.snack('✅ Catégorie modifiée !');
      }
    });
  }

  deleteCategory(cat: Category, e: MouseEvent): void {
    e.stopPropagation();
    const n = this.countFor(cat.id);
    const msg = n > 0
      ? `Supprimer "${cat.name}" et ses ${n} produit(s) ?`
      : `Supprimer "${cat.name}" ?`;
    if (confirm(msg)) {
      this.productService.deleteByCategory(cat.id);
      this.categoryService.delete(cat.id);
      this.snack('🗑️ Catégorie supprimée');
    }
  }

  goToProducts(categoryId: string): void {
    this.router.navigate(['/products', categoryId]);
  }

  private snack(msg: string): void {
    this.snackBar.open(msg, 'OK', {
      duration: 3000, horizontalPosition: 'center', verticalPosition: 'bottom',
    });
  }
}
