import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { geststockError, isGeststockAuthorizationUrl, revocationReasonError, suspensionReasonLabel } from './geststock-messages';

const ORIGIN = 'https://geststock-frontend.onrender.com';

function error(status: number, code?: string, headers?: Record<string, string>): HttpErrorResponse {
  return new HttpErrorResponse({
    status,
    error: code ? { success: false, message: 'message du serveur', code } : null,
    headers: new HttpHeaders(headers ?? {}),
  });
}

/** Messages, motifs et contrôles de la liaison GestStock côté boutique (lot 2, JA1). */
describe('geststock-messages', () => {
  it.each([
    ['ALREADY_LINKED', 'déjà liée'],
    ['TOO_MANY_PENDING_REQUESTS', 'en cours'],
    ['SHOP_NOT_ELIGIBLE', 'approuvée'],
    ['ADMIN_FORBIDDEN', 'boutiques'],
    ['AUTHORIZATION_REQUEST_INVALID', 'expirée ou déjà utilisée'],
    ['INVALID_ISSUER', 'recommencez'],
    ['AUTHORIZATION_REJECTED', 'recommencez'],
    ['LINK_REVOKED', 'révoquée'],
    ['LINK_SAVE_FAILED', 'enregistrée'],
    ['GESTSTOCK_UNAVAILABLE', 'réessayez plus tard'],
    ['GESTSTOCK_ERROR', 'GestStock'],
    ['GESTSTOCK_REVOCATION_REJECTED', 'refusé'],
    ['INTEGRATION_MISCONFIGURED', 'indisponible'],
    ['RATE_LIMITED', 'Trop de demandes'],
    ['RATE_LIMIT_UNAVAILABLE', 'indisponible'],
    ['INVALID_REQUEST', 'invalide'],
    ['LINK_SECRET_UNREADABLE', 'support'],
    ['INTERNAL_ERROR', 'réessayez'],
  ])('code %s : message clair en français', (code, expected) => {
    const result = geststockError(error(400, code));
    expect(result.message.toLowerCase()).toContain(expected.toLowerCase());
    expect(result.message).not.toContain(code);
    expect(result.message).not.toContain('message du serveur');
  });

  it('session expirée (401) et serveur injoignable (0) : messages dédiés', () => {
    expect(geststockError(error(401)).message).toContain('reconnecter');
    expect(geststockError(error(0)).message).toContain('connexion');
    expect(geststockError(new Error('inattendue')).message).toContain('réessayez');
  });

  it('Retry-After : délai rendu et affiché en clair', () => {
    const seconds = geststockError(error(429, 'GESTSTOCK_RATE_LIMITED', { 'Retry-After': '45' }));
    expect(seconds.retryAfterSeconds).toBe(45);
    expect(seconds.message).toContain('45 s');
    const minutes = geststockError(error(429, 'RATE_LIMITED', { 'Retry-After': '120' }));
    expect(minutes.message).toContain('2 min');
    expect(geststockError(error(429, 'RATE_LIMITED')).retryAfterSeconds).toBeUndefined();
  });

  it('motifs de suspension : traduits si connus, bruts sinon', () => {
    expect(suspensionReasonLabel('AUTHORIZER_LOST_ACCESS')).toContain('n’a plus les droits');
    expect(suspensionReasonLabel('MANUAL')).toContain('GestStock');
    expect(suspensionReasonLabel('NOUVEAU_MOTIF')).toBe('NOUVEAU_MOTIF');
    expect(suspensionReasonLabel(null)).toBeNull();
  });

  it('URL d’autorisation : seulement l’origine GestStock exacte', () => {
    expect(isGeststockAuthorizationUrl(`${ORIGIN}/integrations/jecreemaboutique/authorize?client_id=jcmb&request_uri=urn%3Ax`, ORIGIN)).toBe(true);
    for (const url of [
      'https://geststock-frontend.onrender.com.evil.example/integrations',
      'https://evil.example/integrations',
      'http://geststock-frontend.onrender.com/integrations',
      'https://user:pass@geststock-frontend.onrender.com/integrations',
      '//geststock-frontend.onrender.com/integrations',
      '/integrations',
      'javascript:alert(1)',
      '',
      null,
    ]) {
      expect(isGeststockAuthorizationUrl(url, ORIGIN), String(url)).toBe(false);
    }
  });

  it('motif de révocation : mêmes règles que le backend (500 caractères au plus, sans caractère de contrôle)', () => {
    expect(revocationReasonError('')).toBeNull();
    expect(revocationReasonError('Fermeture de la boutique')).toBeNull();
    expect(revocationReasonError('x'.repeat(500))).toBeNull();
    expect(revocationReasonError('x'.repeat(501))).toContain('500');
    expect(revocationReasonError('Fermeture\u0000')).toContain('caractère');
    expect(revocationReasonError('Ligne 1\nLigne 2')).toBeNull();
  });
});
