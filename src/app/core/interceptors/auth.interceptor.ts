import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

let isRefreshing = false;

const OWN_API_HOST = (() => {
  try {
    return new URL(environment.apiUrl).hostname;
  } catch {
    return null;
  }
})();

function isOwnApi(url: string): boolean {
  if (url.startsWith('/api')) return true;
  if (!OWN_API_HOST) return false;
  try {
    const host = new URL(url, window.location.origin).hostname;
    return host === OWN_API_HOST;
  } catch {
    return false;
  }
}

// Un 401 sur ces routes ne doit jamais déclencher de tentative de refresh :
// - /auth/logout : c'est justement l'appel qui accompagne une déconnexion —
//   le retenter en boucle via refreshToken()→logout()→/auth/logout est ce
//   qui causait la boucle infinie.
// - /auth/refresh, /auth/login, /auth/register : un 401 ici signifie
//   respectivement un refresh token invalide, ou des identifiants
//   incorrects — jamais une session à rafraîchir.
const AUTH_ENDPOINTS_NO_RETRY = ['/auth/logout', '/auth/refresh', '/auth/login', '/auth/register'];

function isAuthEndpointNoRetry(url: string): boolean {
  return AUTH_ENDPOINTS_NO_RETRY.some(path => url.includes(path));
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = localStorage.getItem('bs_token');

  if (token && isOwnApi(req.url)) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isRefreshing && !isAuthEndpointNoRetry(req.url)) {
        isRefreshing = true;
        return authService.refreshToken().pipe(
          switchMap(() => {
            isRefreshing = false;
            // Réessayer la requête originale avec le nouveau token
            const newToken = localStorage.getItem('bs_token');
            if (newToken) {
              const clonedReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` },
              });
              return next(clonedReq);
            }
            return throwError(() => error);
          }),
          catchError((refreshError) => {
            isRefreshing = false;
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
