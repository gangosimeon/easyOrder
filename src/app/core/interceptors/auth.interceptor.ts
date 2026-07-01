import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

let isRefreshing = false;

const OWN_API_HOSTS = ['easyorder-backend-wnku.onrender.com', 'api.jecreemaboutique.com'];

function isOwnApi(url: string): boolean {
  if (url.startsWith('/api')) return true;
  try {
    const host = new URL(url).hostname;
    return OWN_API_HOSTS.some(h => host === h || host.endsWith('.' + h));
  } catch {
    return false;
  }
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
      if (error.status === 401 && !isRefreshing) {
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
