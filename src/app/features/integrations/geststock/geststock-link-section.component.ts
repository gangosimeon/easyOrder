import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';
import { BROWSER_NAVIGATE, GeststockLinkService, GeststockLinkState } from '../../../core/services/geststock-link.service';
import { geststockError, isGeststockAuthorizationUrl, suspensionReasonLabel } from './geststock-messages';
import { GeststockRevokeDialogComponent, GeststockRevokeResult } from './geststock-revoke-dialog.component';

type View = 'hidden' | 'loading' | 'ready' | 'error';

/**
 * Section « GestStock » de l'espace de la boutique (profil ; lot 2, JA1, v14-D1) : état de la liaison, connexion
 * (navigation vers l'écran d'autorisation de GestStock, seulement sur son origine configurée) et déconnexion.
 * Masquée pour l'administrateur et quand l'intégration est désactivée (404 INTEGRATION_DISABLED), sans message.
 */
@Component({
  selector: 'app-geststock-link-section',
  standalone: true,
  imports: [DatePipe, MatButtonModule, MatIconModule],
  templateUrl: './geststock-link-section.component.html',
  styleUrls: ['./geststock-link-section.component.scss'],
})
export class GeststockLinkSectionComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly api = inject(GeststockLinkService);
  private readonly dialog = inject(MatDialog);
  private readonly navigate = inject(BROWSER_NAVIGATE);

  readonly view = signal<View>('loading');
  readonly state = signal<GeststockLinkState | null>(null);
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  readonly notice = signal<string | null>(null);

  /** Liaison en cours (une liaison révoquée n'en est plus une). */
  readonly link = computed(() => {
    const link = this.state()?.link ?? null;
    return link && link.status !== 'REVOKED' ? link : null;
  });
  readonly revokedRemotely = computed(() => this.state()?.link?.status === 'REVOKED');
  readonly company = computed(() => this.link()?.companyName ?? this.link()?.companyCode ?? '');
  readonly suspension = computed(() => suspensionReasonLabel(this.link()?.suspensionReason ?? null));

  ngOnInit(): void {
    if (!this.auth.isLoggedIn() || this.auth.company()?.role === 'admin') {
      this.view.set('hidden');
      return;
    }
    // Retour réussi de la page de liaison : message une fois, oublié ensuite.
    if ((window.history.state as { geststock?: string } | null)?.geststock === 'linked') {
      this.notice.set('Votre boutique est liée à GestStock.');
      window.history.replaceState({ ...window.history.state, geststock: undefined }, '');
    }
    this.load();
  }

  connect(): void {
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set(null);
    this.notice.set(null);
    this.api.start().subscribe({
      next: ({ authorizationUrl }) => {
        if (!isGeststockAuthorizationUrl(authorizationUrl, environment.geststockOrigin)) {
          this.error.set('L’adresse de l’écran GestStock est inattendue : aucune redirection. Réessayez plus tard.');
          this.busy.set(false);
          return;
        }
        // La page quitte l'application : le bouton reste inactif.
        this.navigate(authorizationUrl);
      },
      error: (err: unknown) => {
        this.error.set(geststockError(err).message);
        this.busy.set(false);
      },
    });
  }

  revoke(): void {
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set(null);
    this.notice.set(null);
    this.dialog
      .open<GeststockRevokeDialogComponent, void, GeststockRevokeResult | undefined>(GeststockRevokeDialogComponent, {
        maxWidth: '480px',
        width: '100%',
      })
      .afterClosed()
      .subscribe((result) => {
        if (!result) {
          this.busy.set(false);
          return;
        }
        this.api.revoke(result.reason).subscribe({
          next: () => {
            this.state.set({ link: null, refreshed: false, stale: false });
            this.notice.set('La liaison avec GestStock est révoquée.');
            this.busy.set(false);
          },
          error: (err: unknown) => {
            // GestStock indisponible : la liaison reste en place, la boutique réessaie plus tard.
            this.error.set(geststockError(err).message);
            this.busy.set(false);
          },
        });
      });
  }

  private load(): void {
    this.view.set('loading');
    this.api.getLink().subscribe({
      next: (state) => {
        this.state.set(state);
        this.view.set('ready');
      },
      error: (err: unknown) => {
        const disabled = err instanceof HttpErrorResponse && err.status === 404
          && (err.error as { code?: unknown } | null)?.code === 'INTEGRATION_DISABLED';
        if (disabled) {
          this.view.set('hidden');
          return;
        }
        this.error.set(geststockError(err).message);
        this.view.set('error');
      },
    });
  }
}
