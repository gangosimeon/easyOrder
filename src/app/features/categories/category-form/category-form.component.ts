import { Component, Inject, OnInit, signal } from '@angular/core';
import { CommonModule }          from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }     from '@angular/material/input';
import { MatButtonModule }    from '@angular/material/button';
import { MatIconModule }      from '@angular/material/icon';
import { MatRippleModule }    from '@angular/material/core';
import { Category, CATEGORY_ICONS, CATEGORY_COLORS } from '../../../models/category.model';

export interface CategoryFormData {
  category?: Category;
  mode: 'add' | 'edit';
}

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatDialogModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatRippleModule,
  ],
  templateUrl: './category-form.component.html',
  styleUrls:  ['./category-form.component.scss'],
})
export class CategoryFormComponent implements OnInit {
  form!: FormGroup;

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
      name:        [this.data.category?.name        ?? '', [Validators.required, Validators.minLength(2)]],
      description: [this.data.category?.description ?? ''],
    });
  }

  selectIcon(icon: string):   void { this.selectedIcon.set(icon); }
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
