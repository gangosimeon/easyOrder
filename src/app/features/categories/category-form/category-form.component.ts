import { Component, Inject, OnInit, inject, signal } from '@angular/core';
import { CommonModule }          from '@angular/common';
import {
  ReactiveFormsModule, FormBuilder, FormGroup, Validators,
  AbstractControl, ValidationErrors,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }     from '@angular/material/input';
import { MatButtonModule }    from '@angular/material/button';
import { MatIconModule }      from '@angular/material/icon';
import { MatRippleModule }    from '@angular/material/core';
import { Category, CATEGORY_ICONS, CATEGORY_COLORS } from '../../../models/category.model';
import { CategoryService } from '../../../core/services/category.service';

export interface CategoryFormData {
  category?: Category;
  mode: 'add' | 'edit';
}

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
  ],
  templateUrl: './category-form.component.html',
  styleUrls:  ['./category-form.component.scss'],
})
export class CategoryFormComponent implements OnInit {
  form!: FormGroup;
  private categoryService = inject(CategoryService);

  readonly categoryIcons  = CATEGORY_ICONS;
  readonly categoryColors = CATEGORY_COLORS;

  // ✅ Angular 20 — Signals pour l'état local du formulaire
  selectedIcon  = signal<string>(this.data.category?.icon  ?? 'category');
  selectedColor = signal<string>(this.data.category?.color ?? CATEGORY_COLORS[0]);

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CategoryFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CategoryFormData,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [
        this.data.category?.name ?? '',
        [Validators.required, Validators.minLength(2), this.duplicateNameValidator()],
      ],
      description: [this.data.category?.description ?? ''],
    });
  }

  /**
   * Vérification rapide côté client à partir des catégories déjà chargées.
   * Simple confort d'UX — le backend reste la seule source de vérité
   * (contrainte d'unicité {shopId, normalizedName}).
   */
  private duplicateNameValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = (control.value ?? '') as string;
      return this.categoryService.isNameTaken(value, this.data.category?.id)
        ? { duplicateName: true }
        : null;
    };
  }

  selectIcon(category:{value: string, label: string}):   void { this.selectedIcon.set(category.value); this.form.get('name')?.setValue(category.label); }
  selectColor(color: string): void { this.selectedColor.set(color); }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close({
        ...this.form.value,
        icon:  this.selectedIcon(),
        color: this.selectedColor(),
      });
    }
  }

  onCancel(): void { this.dialogRef.close(null); }
}
