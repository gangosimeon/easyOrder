import { Component, ElementRef, Inject, OnInit, ViewChild, signal } from '@angular/core';
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

  @ViewChild('fileInputRef') fileInputRef!: ElementRef<HTMLInputElement>;

  imageMode      = signal<'emoji' | 'url' | 'upload'>('emoji');
  selectedEmoji  = signal<string>('🛍️');
  imageUrl       = signal<string>('');
  uploadedImage  = signal<string>('');
  hasPromo       = signal<boolean>(!!this.data.product?.promotion);

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProductFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProductFormData,
  ) {}

  ngOnInit(): void {
    const existingImage = this.data.product?.image ?? '';
    if (existingImage.startsWith('data:image/')) {
      this.imageMode.set('upload');
      this.uploadedImage.set(existingImage);
    } else if (existingImage.startsWith('http')) {
      this.imageMode.set('url');
      this.imageUrl.set(existingImage);
    } else if (existingImage) {
      this.selectedEmoji.set(existingImage);
    }

    this.form = this.fb.group({
      name:        [this.data.product?.name        ?? '', [Validators.required, Validators.minLength(2)]],
      price:       [this.data.product?.price       ?? null, [Validators.required, Validators.min(1)]],
      promotion:   [this.data.product?.promotion   ?? null, [Validators.min(1), Validators.max(99)]],
      unit:        [this.data.product?.unit        ?? 'pièce'],
      stock:       [this.data.product?.stock       ?? null, [Validators.min(0)]],
      inStock:     [this.data.product?.inStock      ?? true],
      description: [this.data.product?.description ?? ''],
    });
  }

  setImageMode(mode: 'emoji' | 'url' | 'upload'): void { this.imageMode.set(mode); }

  triggerUpload(): void { this.fileInputRef.nativeElement.click(); }

  async onFileSelected(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const base64 = await this.resizeImage(file);
    this.uploadedImage.set(base64);
    (event.target as HTMLInputElement).value = '';
  }

  private resizeImage(file: File, maxSize = 600, quality = 0.78): Promise<string> {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = e => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxSize || height > maxSize) {
            if (width > height) { height = Math.round(height * maxSize / width); width = maxSize; }
            else                { width  = Math.round(width  * maxSize / height); height = maxSize; }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width; canvas.height = height;
          canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.src = e.target!.result as string;
      };
      reader.readAsDataURL(file);
    });
  }
  selectEmoji(e: string): void              { this.selectedEmoji.set(e); }
  setImageUrl(event: Event): void {
    this.imageUrl.set((event.target as HTMLInputElement).value);
  }
  imgError(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }

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
      const image = this.imageMode() === 'url'
        ? this.imageUrl().trim()
        : this.imageMode() === 'upload'
          ? this.uploadedImage()
          : this.selectedEmoji();
      const result: Partial<Product> = {
        name:          v.name,
        price:         this.hasPromo() ? this.discountedPrice() : +v.price,
        originalPrice: this.hasPromo() ? +v.price : undefined,
        promotion:     this.hasPromo() ? +v.promotion : undefined,
        image,
        unit:          v.unit,
        stock:         v.stock ? +v.stock : undefined,
        inStock:       v.inStock,
        description:   v.description,
        categoryId:    this.data.category.id,
      };
      this.dialogRef.close(result);
    }
  }

  onCancel(): void { this.dialogRef.close(null); }
}
