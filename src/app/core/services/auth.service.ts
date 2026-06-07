import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Company {
  id: string;
  name: string;
  slug: string;
  phone: string;
  countryCode?: string;
  fullPhone?: string;
  description: string;
  logo: string;
  address: string;
  coverColor: string;
  role?: 'admin' | 'user';
}

export interface RegisterPayload {
  name: string;
  phone: string;
  countryCode: string;
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

  private readonly apiUrl = environment.apiUrl;
  readonly isLoggedIn = this._isLoggedIn.asReadonly();
  readonly company    = this._company.asReadonly();

  constructor() {
    const stored = localStorage.getItem('bs_auth');
    const token  = localStorage.getItem('bs_token');
    if (stored && token) {
      try {
        this._company.set(JSON.parse(stored));
        this._isLoggedIn.set(true);
      } catch { /* session corrompue */ }
    }
  }

  login(phone: string, password: string, countryCode = '226'): Observable<AuthResult> {
    return this.http.post<ApiAuthResponse>(`${this.apiUrl}/auth/login`, { phone, password, countryCode }).pipe(
      tap(({ user, token }) => {
        localStorage.setItem('bs_token', token);
        localStorage.setItem('bs_auth', JSON.stringify(user));
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
    return this.http.post<ApiAuthResponse>(`${this.apiUrl}/auth/register`, data).pipe(
      tap(({ user, token }) => {
        localStorage.setItem('bs_token', token);
        localStorage.setItem('bs_auth', JSON.stringify(user));
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
    return this.http.put<Company>(`${this.apiUrl}/auth/me`, data).pipe(
      tap(user => {
        localStorage.setItem('bs_auth', JSON.stringify(user));
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
    localStorage.removeItem('bs_token');
    localStorage.removeItem('bs_auth');
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<AuthResult> {
    return this.http.post<ApiAuthResponse>(`${this.apiUrl}/auth/refresh`, {}).pipe(
      tap(({ user, token }) => {
        localStorage.setItem('bs_token', token);
        localStorage.setItem('bs_auth', JSON.stringify(user));
        this._company.set(user);
        this._isLoggedIn.set(true);
      }),
      map(() => ({ success: true } as AuthResult)),
      catchError(err => {
        // Si le refresh échoue, déconnecter l'utilisateur
        this.logout();
        return of({
          success: false,
          error: 'Session expirée. Veuillez vous reconnecter.',
        } as AuthResult);
      })
    );
  }
}
