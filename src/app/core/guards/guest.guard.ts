import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const GuestGuard: CanActivateFn = (): boolean | UrlTree => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  return auth.isLoggedIn() ? router.createUrlTree(['/categories']) : true;
};
