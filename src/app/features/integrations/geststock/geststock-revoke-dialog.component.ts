import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { REVOCATION_REASON_MAX, revocationReasonError } from './geststock-messages';

/** Résultat de la confirmation : motif facultatif (absent : aucun motif transmis). */
export interface GeststockRevokeResult {
  reason?: string;
}

/**
 * Révocation de la liaison GestStock : confirmation explicite et motif facultatif (500 caractères au plus, sans
 * caractère de contrôle, comme le backend). Se ferme sur le résultat, ou sur rien si la boutique annule.
 */
@Component({
  selector: 'app-geststock-revoke-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Déconnecter GestStock ?</h2>
    <div mat-dialog-content>
      <p>
        Votre boutique cessera d’échanger catalogue, stock et commandes avec GestStock. Pour la reconnecter, il faudra
        demander une nouvelle liaison.
      </p>
      <label class="revoke-label" for="geststock-revoke-reason">Motif (facultatif)</label>
      <textarea
        id="geststock-revoke-reason"
        class="revoke-reason"
        rows="3"
        [value]="reason()"
        (input)="reason.set($any($event.target).value)"
      ></textarea>
      <p class="revoke-count">{{ reason().trim().length }} / {{ max }}</p>
      @if (error(); as error) {
        <p class="revoke-error" role="alert">{{ error }}</p>
      }
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button type="button" (click)="cancel()">Annuler</button>
      <button mat-flat-button color="warn" type="button" data-test="confirm" [disabled]="!!error()" (click)="confirm()">
        Déconnecter
      </button>
    </div>
  `,
  styles: `
    .revoke-label { display: block; font-weight: 600; margin-top: 12px; }
    .revoke-reason { width: 100%; box-sizing: border-box; margin-top: 4px; font: inherit; }
    .revoke-count { margin: 4px 0 0; font-size: 0.8rem; color: #666; text-align: right; }
    .revoke-error { margin: 4px 0 0; color: #c62828; }
  `,
})
export class GeststockRevokeDialogComponent {
  private readonly ref = inject(MatDialogRef<GeststockRevokeDialogComponent, GeststockRevokeResult>);
  readonly max = REVOCATION_REASON_MAX;
  readonly reason = signal('');
  readonly error = computed(() => revocationReasonError(this.reason()));

  confirm(): void {
    if (this.error()) return;
    const reason = this.reason().trim();
    this.ref.close(reason ? { reason } : {});
  }

  cancel(): void {
    this.ref.close(undefined);
  }
}
