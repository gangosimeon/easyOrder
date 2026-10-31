import { Component, Injectable, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { DOCUMENT, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { GeststockLinkService } from '../../../core/services/geststock-link.service';
import { geststockError } from './geststock-messages';

/** Chemin de la page de retour : à reporter dans GESTSTOCK_REDIRECT_URI et les redirect_uri du client chez GestStock. */
export const GESTSTOCK_CALLBACK_PATH = 'integrations/geststock/callback';

/** Mêmes formats que le validateur du backend (J4). */
const CODE = /^[A-Za-z0-9._~-]{16,512}$/;
const STATE = /^[A-Za-z0-9_-]{32,512}$/;

type View = 'working' | 'login' | 'forbidden' | 'denied' | 'invalid' | 'failed';

/**
 * Une seule terminaison par `state` pour toute l'application, même si la page est initialisée deux fois. Le `state`
 * ne reste qu'en mémoire (jamais journalisé, jamais stocké).
 */
@Injectable({ providedIn: 'root' })
export class GeststockCallbackGuard {
  private readonly claimed = new Set<string>();

  claim(state: string): boolean {
    if (this.claimed.has(state)) return false;
    this.claimed.add(state);
    return true;
  }
}

/**
 * Page de retour de l'écran d'autorisation GestStock (lot 2, JA1 ; v14-D1 étape 4) : `/integrations/geststock/callback`.
 * Lit `code`, `state`, `iss` (ou `error`), les retire aussitôt de l'URL, puis appelle une seule fois
 * `POST /api/integrations/geststock/complete`. Aucune valeur n'est journalisée ; `Referrer-Policy: no-referrer`
 * pendant l'affichage. Sans session : message et lien vers la connexion, sans URL de retour (le code n'y part pas).
 */
@Component({
  selector: 'app-geststock-callback',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="callback">
      <h1 class="callback-title">Liaison avec GestStock</h1>
      @switch (view()) {
        @case ('working') {
          <p class="callback-text">Finalisation de la liaison avec GestStock…</p>
        }
        @case ('login') {
          <p class="callback-text">Votre session a expiré : reconnectez-vous puis recommencez la liaison depuis votre profil.</p>
          <a class="callback-link" routerLink="/login">Se connecter</a>
        }
        @default {
          <p class="callback-text" role="alert">{{ message() }}</p>
          @if (view() !== 'forbidden') {
            <a class="callback-link" routerLink="/profile" fragment="geststock">Recommencer la liaison</a>
          }
        }
      }
    </section>
  `,
  styles: `
    .callback { max-width: 520px; margin: 48px auto; padding: 24px 16px; text-align: center; }
    .callback-title { font-family: var(--font-display); font-size: 1.3rem; margin: 0 0 16px; }
    .callback-text { margin: 0 0 16px; line-height: 1.5; }
    .callback-link { font-weight: 600; }
  `,
})
export class GeststockCallbackComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly document = inject(DOCUMENT);
  private readonly auth = inject(AuthService);
  private readonly api = inject(GeststockLinkService);
  private readonly guard = inject(GeststockCallbackGuard);

  readonly view = signal<View>('working');
  readonly message = signal('');
  private referrerMeta: HTMLMetaElement | null = null;

  ngOnInit(): void {
    this.addReferrerPolicy();
    const params = this.route.snapshot.queryParamMap;
    const code = params.get('code');
    const state = params.get('state');
    const iss = params.get('iss');
    const error = params.get('error');
    const received = [code, state, iss, error].some((value) => value !== null);

    // 1. Avant tout autre traitement : paramètres retirés de l'URL, sans nouvelle entrée d'historique.
    if (received) this.stripParameters();

    // Rechargement après succès (paramètres déjà retirés) : retour vers l'écran de liaison, sans appel.
    if (!received) {
      void this.router.navigate(['/profile'], { fragment: 'geststock', replaceUrl: true });
      return;
    }
    if (!this.auth.isLoggedIn()) {
      this.view.set('login');
      return;
    }
    if (this.auth.company()?.role === 'admin') {
      this.fail('forbidden', 'La liaison GestStock est réservée aux boutiques.');
      return;
    }
    if (error !== null) {
      this.fail(
        'denied',
        error === 'access_denied'
          ? 'Vous avez refusé la liaison dans GestStock. Vous pouvez la recommencer quand vous le souhaitez.'
          : 'La liaison n’a pas abouti : GestStock a renvoyé une erreur. Recommencez la liaison.'
      );
      return;
    }
    if (!code || !CODE.test(code) || !state || !STATE.test(state) || !iss || iss.length > 200) {
      this.fail('invalid', 'Lien de retour incomplet ou invalide : recommencez la liaison.');
      return;
    }
    if (!this.guard.claim(state)) return;
    this.api.complete({ code, state, iss }).subscribe({
      next: () => void this.router.navigate(['/profile'], { fragment: 'geststock', state: { geststock: 'linked' }, replaceUrl: true }),
      error: (err: unknown) => this.fail('failed', geststockError(err).message),
    });
  }

  ngOnDestroy(): void {
    this.referrerMeta?.remove();
  }

  private fail(view: View, message: string): void {
    this.message.set(message);
    this.view.set(view);
  }

  /** URL du navigateur nettoyée tout de suite (history.replaceState), puis état du routeur synchronisé. */
  private stripParameters(): void {
    const path = this.location.path().split(/[?#]/)[0];
    this.location.replaceState(path);
    if (this.router.url.includes('?')) {
      const tree = this.router.parseUrl(this.router.url);
      tree.queryParams = {};
      tree.fragment = null;
      this.router.navigateByUrl(tree, { replaceUrl: true }).catch(() => undefined);
    }
  }

  /** Aucun Referer vers un autre site depuis cette page (en complément de l'en-tête du déploiement). */
  private addReferrerPolicy(): void {
    const meta = this.document.createElement('meta');
    meta.name = 'referrer';
    meta.content = 'no-referrer';
    this.document.head.appendChild(meta);
    this.referrerMeta = meta;
  }
}
