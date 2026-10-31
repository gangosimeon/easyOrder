import { Injectable, InjectionToken, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/** Liaison telle que la renvoie le backend (vue de l'écran : ni identifiant de liaison, ni secret). */
export interface GeststockLink {
  status: 'ACTIVE' | 'SUSPENDED' | 'REVOKED';
  companyCode: string;
  companyName: string | null;
  suspensionReason: string | null;
  revocationReason: string | null;
  linkedAt: string;
  lastStateSyncAt: string | null;
  revokedAt: string | null;
}

export interface GeststockLinkState {
  link: GeststockLink | null;
  refreshed: boolean;
  /** GestStock injoignable : état local, non actualisé. */
  stale: boolean;
}

/** Retour de l'écran d'autorisation GestStock, transmis tel quel au backend. */
export interface GeststockCompletion {
  code: string;
  state: string;
  iss: string;
}

/**
 * Liaison de la boutique avec GestStock (lot 2, JA1) : routes du backend `/api/integrations/geststock/*` (J4).
 * Aucun secret ne transite : le backend ne renvoie que l'URL d'autorisation et l'état de la liaison.
 */
@Injectable({ providedIn: 'root' })
export class GeststockLinkService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/integrations/geststock`;

  getLink(): Observable<GeststockLinkState> {
    return this.http.get<GeststockLinkState>(`${this.base}/link`);
  }

  start(): Observable<{ authorizationUrl: string }> {
    return this.http.post<{ authorizationUrl: string }>(`${this.base}/start`, {});
  }

  complete(body: GeststockCompletion): Observable<{ link: GeststockLink | null }> {
    return this.http.post<{ link: GeststockLink | null }>(`${this.base}/complete`, body);
  }

  revoke(reason?: string): Observable<{ link: GeststockLink | null; revoked: boolean }> {
    return this.http.post<{ link: GeststockLink | null; revoked: boolean }>(
      `${this.base}/revoke`,
      reason === undefined ? {} : { reason }
    );
  }
}

/** Navigation du navigateur vers l'écran d'autorisation GestStock (remplaçable dans les tests). */
export const BROWSER_NAVIGATE = new InjectionToken<(url: string) => void>('BROWSER_NAVIGATE', {
  providedIn: 'root',
  factory: () => {
    const document = inject(DOCUMENT);
    return (url: string) => document.location.assign(url);
  },
});
