import { Component, ElementRef, Inject, OnInit, ViewChild, inject, signal } from '@angular/core';
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
import { UploadService }          from '../../../core/services/upload.service';

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
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatRippleModule,
  ],
  templateUrl: './product-form.component.html',
  styleUrls:  ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit {
  form!: FormGroup;

  readonly productUnits  = PRODUCT_UNITS;
  readonly productEmojis = PRODUCT_EMOJIS;

  @ViewChild('fileInputRef') fileInputRef!: ElementRef<HTMLInputElement>;

  private uploadService = inject(UploadService);

  imageMode      = signal<'emoji' | 'url' | 'upload'>('upload');
  selectedEmoji  = signal<string>('🛍️');
  imageUrl       = signal<string>('');
  uploadedImage  = signal<string>('');
  uploading      = signal<boolean>(false);
  uploadError    = signal<string>('');
  hasPromo       = signal<boolean>(!!this.data.product?.promotion);

  readonly promoPresets: number[] = [5, 10, 20, 30, 50];
  /** Bouton de réduction actuellement mis en avant ('other' = pourcentage saisi manuellement). */
  promoPreset = signal<number | 'other' | null>(null);

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

    // Si le toggle promo est éteint, le champ promotion doit démarrer vide :
    // sinon une valeur résiduelle (ex: 0) invaliderait silencieusement tout
    // le formulaire alors que ce bloc n'est même pas affiché à l'écran.
    const promotionValue = this.hasPromo() ? (this.data.product?.promotion ?? null) : null;

    // En base, quand une promo est active, `price` est déjà le prix remisé et
    // `originalPrice` le prix normal — c'est bien ce dernier qu'il faut
    // proposer dans le champ "Prix (FCFA)", sans quoi rouvrir un produit en
    // promo réappliquerait la réduction sur un prix déjà réduit à chaque édition.
    const normalPrice = this.hasPromo()
      ? (this.data.product?.originalPrice ?? this.data.product?.price ?? null)
      : (this.data.product?.price ?? null);
    const finalPriceValue = this.hasPromo() && this.data.product ? this.data.product.price : null;

    this.form = this.fb.group({
      name:        [this.data.product?.name        ?? ''],
      price:       [normalPrice, [Validators.required, Validators.min(0)]],
      promotion:   [promotionValue, [Validators.min(0), Validators.max(99)]],
      finalPrice:  [finalPriceValue, [Validators.min(0)]],
      unit:        [this.data.product?.unit        ?? ''],
      stock:       [this.data.product?.stock       ?? null, [Validators.min(0)]],
      inStock:     [this.data.product?.inStock      ?? true],
      description: [this.data.product?.description ?? ''],
    });

    if (this.hasPromo() && promotionValue != null) {
      this.promoPreset.set(this.promoPresets.includes(promotionValue) ? promotionValue : 'other');
    }

    // Le prix normal change → le prix final est recalculé à partir de la
    // réduction actuellement sélectionnée (elle reste la référence).
    this.form.get('price')?.valueChanges.subscribe(() => {
      if (this.hasPromo()) this.syncFinalPriceFromPercent();
    });
  }

  setImageMode(mode: 'emoji' | 'url' | 'upload'): void { this.imageMode.set(mode); }

  triggerUpload(): void { this.fileInputRef.nativeElement.click(); }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    (event.target as HTMLInputElement).value = '';

    this.uploading.set(true);
    this.uploadError.set('');

    this.uploadService.upload(file).subscribe({
      next: url => {
        this.uploadedImage.set(url);
        this.uploading.set(false);
      },
      error: () => {
        this.uploadError.set('Échec de l\'upload, réessayez.');
        this.uploading.set(false);
      },
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
    if (!checked) {
      this.form.get('promotion')?.setValue(null);
      this.form.get('finalPrice')?.setValue(null);
      this.promoPreset.set(null);
    }
  }

  discountedPrice(): number {
    const price = +(this.form.get('price')?.value ?? 0);
    const promo = +(this.form.get('promotion')?.value ?? 0);
    return Math.round(price * (1 - promo / 100));
  }

  /** Prix normal actuellement saisi, 0 si vide/invalide (aucun calcul possible). */
  private normalPrice(): number {
    const n = Number(this.form.get('price')?.value);
    return !isNaN(n) && n > 0 ? n : 0;
  }

  /** Sélection d'un pourcentage prédéfini (5/10/20/30/50 %). */
  selectPromoPreset(percent: number): void {
    this.promoPreset.set(percent);
    this.form.get('promotion')?.setValue(percent, { emitEvent: false });
    this.syncFinalPriceFromPercent();
  }

  /** Passage en mode « Autre » : pourcentage saisi manuellement. */
  selectPromoOther(): void {
    this.promoPreset.set('other');
  }

  /** Saisie manuelle du pourcentage (mode « Autre ») → recalcule le prix final. */
  onPromotionInput(): void {
    this.promoPreset.set('other');
    this.syncFinalPriceFromPercent();
  }

  /** Saisie manuelle du prix final → recalcule le pourcentage correspondant. */
  onFinalPriceInput(): void {
    const normal = this.normalPrice();
    const finalRaw = this.form.get('finalPrice')?.value;
    const final = Number(finalRaw);
    if (!normal || finalRaw === null || finalRaw === '' || isNaN(final)) return;

    const percent = Math.round(((normal - final) / normal) * 100);
    this.form.get('promotion')?.setValue(percent, { emitEvent: false });
    this.promoPreset.set(this.promoPresets.includes(percent) ? percent : 'other');
    // Réaligne l'affichage sur le montant réellement enregistré (le backend
    // ne stocke qu'un pourcentage entier, un léger arrondi est possible).
    this.syncFinalPriceFromPercent();
  }

  /** Recalcule le prix final à partir du prix normal + pourcentage sélectionné. */
  private syncFinalPriceFromPercent(): void {
    if (!this.normalPrice()) return;
    this.form.get('finalPrice')?.setValue(this.discountedPrice(), { emitEvent: false });
  }

  /** Le prix final doit être positif et strictement inférieur au prix normal. */
  isFinalPriceInvalid(): boolean {
    if (!this.hasPromo()) return false;
    const price = this.normalPrice();
    const finalRaw = this.form.get('finalPrice')?.value;
    if (!price || finalRaw === null || finalRaw === '') return false;
    const final = Number(finalRaw);
    return isNaN(final) || final <= 0 || final >= price;
  }

  fmt(price: number): string {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  }

  onSubmit(): void {
    if (this.form.valid && !this.isFinalPriceInvalid()) {
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
