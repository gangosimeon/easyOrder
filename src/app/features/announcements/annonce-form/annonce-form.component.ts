import { Component, Inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule }   from '@angular/material/form-field';
import { MatInputModule }       from '@angular/material/input';
import { MatButtonModule }      from '@angular/material/button';
import { MatIconModule }        from '@angular/material/icon';
import { MatSelectModule }      from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRippleModule }      from '@angular/material/core';
import { Annonce, AnnonceType, ANNONCE_TYPE_CONFIG, ANNONCE_EMOJIS } from '../../../models/annonce.model';

export interface AnnonceFormData {
  annonce?: Annonce;
  mode: 'add' | 'edit';
}

@Component({
  selector: 'app-annonce-form',
  standalone: true,
  imports: [
    ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatIconModule,
    MatSelectModule, MatSlideToggleModule, MatRippleModule,
  ],
  templateUrl: './annonce-form.component.html',
  styleUrls:  ['./annonce-form.component.scss'],
})
export class AnnonceFormComponent implements OnInit {
  form!: FormGroup;

  readonly typeConfig  = ANNONCE_TYPE_CONFIG;
  readonly types       = Object.keys(ANNONCE_TYPE_CONFIG) as AnnonceType[];
  readonly emojis      = ANNONCE_EMOJIS;

  // ✅ Signals locaux Angular 20
  selectedEmoji = signal<string>(this.data.annonce?.emoji ?? '📢');
  selectedType  = signal<AnnonceType>(this.data.annonce?.type ?? 'info');

  get currentConfig() { return this.typeConfig[this.selectedType()]; }

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AnnonceFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AnnonceFormData,
  ) {}

  ngOnInit(): void {
    const a = this.data.annonce;
    this.form = this.fb.group({
      titre:     [a?.titre   ?? '', [Validators.required, Validators.minLength(3)]],
      message:   [a?.message ?? '', [Validators.required, Validators.minLength(10)]],
      type:      [a?.type    ?? 'info'],
      dateDebut: [this.toInputDate(a?.dateDebut ?? new Date()), Validators.required],
      dateFin:   [this.toInputDate(a?.dateFin)],
      active:    [a?.active    ?? true],
      epinglee:  [a?.epinglee  ?? false],
    });
  }

  private toInputDate(d?: Date): string {
    if (!d) return '';
    return d.toISOString().split('T')[0];
  }

  onTypeChange(type: AnnonceType): void { this.selectedType.set(type); }
  selectEmoji(e: string): void          { this.selectedEmoji.set(e); }

  onSubmit(): void {
    if (this.form.valid) {
      const v = this.form.value;
      this.dialogRef.close({
        ...v,
        type:      this.selectedType(),
        emoji:     this.selectedEmoji(),
        dateDebut: new Date(v.dateDebut),
        dateFin:   v.dateFin ? new Date(v.dateFin) : undefined,
      });
    }
  }

  onCancel(): void { this.dialogRef.close(null); }
}
