import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { AdminAnnouncement, AnnouncementFormData } from '../../../core/services/admin-announcement.service';

export interface AnnouncementDialogData {
  announcement?: AdminAnnouncement;
}

@Component({
  selector: 'app-admin-announcement-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule, MatButtonModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatCheckboxModule, MatIconModule,
  ],
  template: `
    <div class="dlg-header">
      <mat-icon class="dlg-header-icon" [class]="'type-' + form.get('type')?.value">
        {{ iconFor(form.get('type')?.value) }}
      </mat-icon>
      <h2 mat-dialog-title class="dlg-title">
        {{ data.announcement ? 'Modifier l\'annonce' : 'Nouvelle annonce' }}
      </h2>
    </div>

    <mat-dialog-content class="dlg-content">
      <form [formGroup]="form" class="ann-form">

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Titre</mat-label>
          <input matInput formControlName="title" placeholder="Titre de l'annonce" maxlength="200" />
          <mat-hint align="end">{{ form.get('title')?.value?.length ?? 0 }}/200</mat-hint>
          @if (form.get('title')?.invalid && form.get('title')?.touched) {
            <mat-error>Titre requis (max 200 caractères)</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Contenu</mat-label>
          <textarea matInput formControlName="content" rows="4"
            placeholder="Message de l'annonce…" maxlength="2000"></textarea>
          <mat-hint align="end">{{ form.get('content')?.value?.length ?? 0 }}/2000</mat-hint>
          @if (form.get('content')?.invalid && form.get('content')?.touched) {
            <mat-error>Contenu requis (max 2000 caractères)</mat-error>
          }
        </mat-form-field>

        <div class="row-fields">
          <mat-form-field appearance="outline" class="type-field">
            <mat-label>Type</mat-label>
            <mat-icon matPrefix [class]="'type-icon type-' + form.get('type')?.value">
              {{ iconFor(form.get('type')?.value) }}
            </mat-icon>
            <mat-select formControlName="type">
              @for (t of typeOptions; track t.value) {
                <mat-option [value]="t.value">{{ t.label }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="expire-field">
            <mat-label>Expire le (optionnel)</mat-label>
            <mat-icon matPrefix>event</mat-icon>
            <input matInput type="date" formControlName="expireAt" />
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Boutiques ciblées (IDs séparés par virgule — vide = global)</mat-label>
          <mat-icon matPrefix>storefront</mat-icon>
          <input matInput formControlName="targetShopsRaw"
            placeholder="Laisser vide pour toutes les boutiques" />
          <mat-hint>Ex : 6643b…, 6643c… — Vide = annonce globale</mat-hint>
        </mat-form-field>

        <div class="active-row">
          <mat-checkbox formControlName="active" color="primary">
            Annonce active (visible par les boutiques)
          </mat-checkbox>
        </div>

      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end" class="dlg-actions">
      <button mat-button (click)="cancel()">Annuler</button>
      <button mat-flat-button color="primary"
        [disabled]="form.invalid"
        (click)="submit()">
        <mat-icon>{{ data.announcement ? 'save' : 'add' }}</mat-icon>
        {{ data.announcement ? 'Sauvegarder' : 'Créer' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dlg-header {
      display: flex; align-items: center; gap: 12px;
      padding: 20px 24px 0;
    }
    .dlg-header-icon {
      font-size: 26px; width: 26px; height: 26px;
    }
    .dlg-title { margin: 0; font-size: 18px; font-weight: 700; }
    .dlg-content { padding: 16px 24px !important; }
    .ann-form { display: flex; flex-direction: column; gap: 4px; }
    .full-width { width: 100%; }
    .row-fields { display: flex; gap: 12px; flex-wrap: wrap; }
    .type-field   { flex: 1; min-width: 150px; }
    .expire-field { flex: 1; min-width: 180px; }
    .active-row { padding: 4px 0 8px; }
    .dlg-actions { padding: 8px 16px 16px !important; gap: 8px; }

    .type-info    { color: #3b82f6; }
    .type-success { color: #22c55e; }
    .type-warning { color: #f59e0b; }
    .type-urgent  { color: #ef4444; }
    .type-icon    { font-size: 18px; width: 18px; height: 18px; }
  `],
})
export class AdminAnnouncementFormDialogComponent implements OnInit {
  readonly data     = inject<AnnouncementDialogData>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<AdminAnnouncementFormDialogComponent>);
  private fb        = inject(FormBuilder);

  readonly typeOptions = [
    { value: 'info',    label: 'ℹ️ Information' },
    { value: 'success', label: '✅ Succès'       },
    { value: 'warning', label: '⚠️ Avertissement' },
    { value: 'urgent',  label: '🚨 Urgent'       },
  ];

  form!: FormGroup;

  ngOnInit(): void {
    const ann = this.data.announcement;
    this.form = this.fb.group({
      title:          [ann?.title    ?? '', [Validators.required, Validators.maxLength(200)]],
      content:        [ann?.content  ?? '', [Validators.required, Validators.maxLength(2000)]],
      type:           [ann?.type     ?? 'info'],
      active:         [ann?.active   ?? true],
      expireAt:       [ann?.expireAt ? ann.expireAt.substring(0, 10) : ''],
      targetShopsRaw: [(ann?.targetShops ?? []).join(', ')],
    });
  }

  iconFor(type: string): string {
    const map: Record<string, string> = {
      info:    'info',
      success: 'check_circle',
      warning: 'warning',
      urgent:  'priority_high',
    };
    return map[type] ?? 'info';
  }

  submit(): void {
    if (this.form.invalid) return;
    const { title, content, type, active, expireAt, targetShopsRaw } = this.form.value as {
      title: string; content: string; type: string;
      active: boolean; expireAt: string; targetShopsRaw: string;
    };

    const result: AnnouncementFormData = {
      title,
      content,
      type:        type as AnnouncementFormData['type'],
      active,
      expireAt:    expireAt || null,
      targetShops: targetShopsRaw
        ? targetShopsRaw.split(',').map(s => s.trim()).filter(Boolean)
        : [],
    };
    this.dialogRef.close(result);
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
