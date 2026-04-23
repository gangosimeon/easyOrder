import { Component, Inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule }           from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule }     from '@angular/material/form-field';
import { MatInputModule }         from '@angular/material/input';
import { MatButtonModule }        from '@angular/material/button';
import { MatIconModule }          from '@angular/material/icon';
import { MatSelectModule }        from '@angular/material/select';
import { MatSlideToggleModule }   from '@angular/material/slide-toggle';
import { MatRippleModule }        from '@angular/material/core';
import { Product, PRODUCT_UNITS, PRODUCT_EMOJIS } from '../../../models/product.model';
import { Category }               from '../../../models/category.model';

export interface ProductFormData {
  product?: Product;
  category: Category;
  mode: 'add' | 'edit';
}

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatDialogModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatSelectModule,
    MatSlideToggleModule, MatRippleModule,
  ],
  templateUrl: './product-form.component.html',
  styleUrls:  ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit {
  form!: FormGroup;

  readonly productUnits  = PRODUCT_UNITS;
  readonly productEmojis = PRODUCT_EMOJIS;

  // ✅ Angular 20 — Signals pour l'état local
  selectedEmoji = signal<string>(this.data.product?.image ?? '🛍️');
  hasPromo      = signal<boolean>(!!this.data.product?.promotion);

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProductFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProductFormData,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name:        [this.data.product?.name        ?? '', [Validators.required, Validators.minLength(2)]],
      price:       [this.data.product?.price       ?? null, [Validators.required, Validators.min(1)]],
      promotion:   [this.data.product?.promotion   ?? null, [Validators.min(1), Validators.max(99)]],
      unit:        [this.data.product?.unit        ?? 'pièce'],
      stock:       [this.data.product?.stock       ?? null, [Validators.min(0)]],
      description: [this.data.product?.description ?? ''],
    });
  }

  selectEmoji(e: string): void { this.selectedEmoji.set(e); }

  togglePromo(checked: boolean): void {
    this.hasPromo.set(checked);
    if (!checked) this.form.get('promotion')?.setValue(null);
  }

  discountedPrice(): number {
    const price = +(this.form.get('price')?.value ?? 0);
    const promo = +(this.form.get('promotion')?.value ?? 0);
    return Math.round(price * (1 - promo / 100));
  }

  fmt(price: number): string {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  }

  onSubmit(): void {
    if (this.form.valid) {
      const v = this.form.value;
      const result: Partial<Product> = {
        name:          v.name,
        price:         this.hasPromo() ? this.discountedPrice() : +v.price,
        originalPrice: this.hasPromo() ? +v.price : undefined,
        promotion:     this.hasPromo() ? +v.promotion : undefined,
        image:         this.selectedEmoji(),
        unit:          v.unit,
        stock:         v.stock ? +v.stock : undefined,
        description:   v.description,
        categoryId:    this.data.category.id,
      };
      this.dialogRef.close(result);
    }
  }

  onCancel(): void { this.dialogRef.close(null); }
}
