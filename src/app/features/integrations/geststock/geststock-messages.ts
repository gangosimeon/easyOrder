import { HttpErrorResponse } from '@angular/common/http';

/**
 * Messages de la liaison GestStock côté boutique (lot 2, JA1) : codes stables des routes du backend (J4), motifs de
 * suspension, contrôle de l'URL d'autorisation et du motif de révocation. Le message du serveur n'est jamais repris :
 * chaque code a son texte.
 */

export interface GeststockMessage {
  message: string;
  /** Délai indiqué par `Retry-After`, s'il est lisible. */
  retryAfterSeconds?: number;
}

const RESTART = 'Recommencez la liaison.';
const LATER = 'Réessayez plus tard.';

const MESSAGES: Readonly<Record<string, string>> = {
  ALREADY_LINKED: 'Votre boutique est déjà liée à une entreprise GestStock.',
  TOO_MANY_PENDING_REQUESTS: 'Trop de demandes de liaison en cours : terminez-en une ou réessayez dans quelques minutes.',
  SHOP_NOT_ELIGIBLE: 'Votre boutique doit être approuvée pour être liée à GestStock.',
  ADMIN_FORBIDDEN: 'La liaison GestStock est réservée aux boutiques.',
  AUTHORIZATION_REQUEST_INVALID: `Demande de liaison expirée ou déjà utilisée. ${RESTART}`,
  INVALID_ISSUER: 'La réponse d’autorisation ne vient pas de GestStock : recommencez la liaison.',
  AUTHORIZATION_REJECTED: 'GestStock a refusé l’autorisation (expirée ou déjà utilisée) : recommencez la liaison.',
  LINK_REVOKED: `La liaison a été révoquée par GestStock. ${RESTART}`,
  LINK_SAVE_FAILED: `La liaison n’a pas pu être enregistrée. ${RESTART}`,
  GESTSTOCK_UNAVAILABLE: 'GestStock est momentanément indisponible : réessayez plus tard.',
  GESTSTOCK_RATE_LIMITED: `GestStock reçoit trop de demandes. ${LATER}`,
  GESTSTOCK_ERROR: 'Erreur de communication avec GestStock. Réessayez plus tard.',
  GESTSTOCK_REVOCATION_REJECTED: 'GestStock a refusé la demande de révocation. Contactez le support si le problème persiste.',
  INTEGRATION_MISCONFIGURED: 'La liaison GestStock est momentanément indisponible.',
  RATE_LIMITED: `Trop de demandes. ${LATER}`,
  RATE_LIMIT_UNAVAILABLE: `Service momentanément indisponible. ${LATER}`,
  INVALID_REQUEST: 'Données invalides : vérifiez votre saisie.',
  LINK_SECRET_UNREADABLE: 'La liaison est illisible : contactez le support.',
  INTERNAL_ERROR: 'Une erreur est survenue : réessayez dans quelques instants.',
};

/** Message d'une erreur des routes de la liaison, selon son code, avec le délai `Retry-After` s'il est lisible. */
export function geststockError(err: unknown): GeststockMessage {
  if (!(err instanceof HttpErrorResponse)) {
    return { message: 'Une erreur est survenue : réessayez dans quelques instants.' };
  }
  if (err.status === 0) return { message: 'Serveur injoignable : vérifiez votre connexion puis réessayez.' };
  const body = err.error as { code?: unknown } | null;
  const code = typeof body?.code === 'string' ? body.code : null;
  const known = code ? MESSAGES[code] : undefined;
  let message = known ?? (err.status === 401 ? 'Votre session a expiré : veuillez vous reconnecter.' : MESSAGES['INTERNAL_ERROR']);
  const retryAfterSeconds = retryAfter(err);
  if (retryAfterSeconds !== undefined) message = `${message} Réessayez dans ${duration(retryAfterSeconds)}.`;
  return retryAfterSeconds !== undefined ? { message, retryAfterSeconds } : { message };
}

/**
 * `Retry-After` en secondes. Lisible seulement si le backend l'expose au navigateur
 * (`Access-Control-Expose-Headers`), l'API étant sur une autre origine.
 */
function retryAfter(err: HttpErrorResponse): number | undefined {
  const value = err.headers?.get('Retry-After')?.trim();
  return value && /^\d{1,6}$/.test(value) ? Number(value) : undefined;
}

function duration(seconds: number): string {
  return seconds < 60 ? `${seconds} s` : `${Math.ceil(seconds / 60)} min`;
}

const SUSPENSION_REASONS: Readonly<Record<string, string>> = {
  MANUAL: 'Suspendue par l’entreprise GestStock.',
  AUTHORIZER_LOST_ACCESS: 'La personne qui avait autorisé la liaison chez GestStock n’a plus les droits nécessaires.',
};

/** Motif de suspension en clair s'il est connu, tel que reçu sinon (le contrat tolère de nouveaux motifs). */
export function suspensionReasonLabel(reason: string | null): string | null {
  if (!reason) return null;
  return SUSPENSION_REASONS[reason] ?? reason;
}

/**
 * URL de l'écran d'autorisation acceptable : absolue, sur l'origine GestStock configurée exactement (schéma, hôte,
 * port), sans identifiants. Toute autre URL est refusée : aucune navigation.
 */
export function isGeststockAuthorizationUrl(url: unknown, origin: string): boolean {
  if (typeof url !== 'string' || url.length === 0 || url.length > 4096 || /[\s\\]/.test(url)) return false;
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }
  return parsed.origin === origin && !parsed.username && !parsed.password && url.startsWith(`${origin}/`);
}

/** Longueur maximale du motif de révocation (backend J4 et GestStock). */
export const REVOCATION_REASON_MAX = 500;

const CONTROL_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;

/** Erreur du motif de révocation (mêmes règles que le backend J4), ou `null` s'il est acceptable ; vide : aucun motif. */
export function revocationReasonError(reason: string): string | null {
  const value = reason.trim();
  if (value.length > REVOCATION_REASON_MAX) return `Le motif doit faire ${REVOCATION_REASON_MAX} caractères au plus.`;
  if (CONTROL_CHARACTERS.test(value)) return 'Le motif contient un caractère non autorisé.';
  return null;
}
