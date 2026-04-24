import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

export interface Company {
  id: string;
  name: string;
  slug: string;
  phone: string;
  description: string;
  logo: string;
  address: string;
  coverColor: string;
}

export interface RegisterPayload {
  name: string;
  phone: string;
  password: string;
  description: string;
  logo: string;
  address: string;
  coverColor: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
}

interface ApiAuthResponse {
  user: Company;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http   = inject(HttpClient);
  private router = inject(Router);

  private _isLoggedIn = signal(false);
  private _company    = signal<Company | null>(null);

  readonly isLoggedIn = this._isLoggedIn.asReadonly();
  readonly company    = this._company.asReadonly();

  constructor() {
    const stored = sessionStorage.getItem('bs_auth');
    const token  = sessionStorage.getItem('bs_token');
    if (stored && token) {
      try {
        this._company.set(JSON.parse(stored));
        this._isLoggedIn.set(true);
      } catch { /* session corrompue */ }
    }
  }

  login(phone: string, password: string): Observable<AuthResult> {
    return this.http.post<ApiAuthResponse>('/api/auth/login', { phone, password }).pipe(
      tap(({ user, token }) => {
        sessionStorage.setItem('bs_token', token);
        sessionStorage.setItem('bs_auth', JSON.stringify(user));
        this._company.set(user);
        this._isLoggedIn.set(true);
      }),
      map(() => ({ success: true } as AuthResult)),
      catchError(err => of({
        success: false,
        error: (err.error as { message?: string })?.message ?? 'Numéro ou mot de passe incorrect.',
      } as AuthResult))
    );
  }

  register(data: RegisterPayload): Observable<AuthResult> {
    return this.http.post<ApiAuthResponse>('/api/auth/register', data).pipe(
      tap(({ user, token }) => {
        sessionStorage.setItem('bs_token', token);
        sessionStorage.setItem('bs_auth', JSON.stringify(user));
        this._company.set(user);
        this._isLoggedIn.set(true);
      }),
      map(() => ({ success: true } as AuthResult)),
      catchError(err => of({
        success: false,
        error: (err.error as { message?: string })?.message ?? 'Erreur lors de l\'inscription.',
      } as AuthResult))
    );
  }

  updateProfile(data: Partial<Omit<Company, 'id' | 'phone' | 'slug'>>): Observable<AuthResult> {
    return this.http.put<Company>('/api/auth/me', data).pipe(
      tap(user => {
        sessionStorage.setItem('bs_auth', JSON.stringify(user));
        this._company.set(user);
      }),
      map(() => ({ success: true } as AuthResult)),
      catchError(err => of({
        success: false,
        error: (err.error as { message?: string })?.message ?? 'Erreur lors de la mise à jour.',
      } as AuthResult))
    );
  }

  logout(): void {
    this._isLoggedIn.set(false);
    this._company.set(null);
    sessionStorage.removeItem('bs_token');
    sessionStorage.removeItem('bs_auth');
    this.router.navigate(['/login']);
  }
}
