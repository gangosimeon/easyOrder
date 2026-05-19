import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, timer } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

import {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from '../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ── Envoi OTP par email ──────────────────────────────────────────────────────
  forgotPassword(email: string): Observable<ForgotPasswordResponse> {
    return this.http
      .post<ForgotPasswordResponse>(`${this.apiUrl}/auth/forgot-password`, { email })
      .pipe(
        tap(() => {
          // Stocker email en localStorage pour les étapes suivantes
          localStorage.setItem('reset_email', email);
        }),
        catchError(err => {
          const message = err.error?.message || 'Erreur lors de l\'envoi du code';
          return of({ success: false, message });
        })
      );
  }

  // ── Vérification OTP ─────────────────────────────────────────────────────────
  verifyOtp(email: string, otp: string): Observable<VerifyOtpResponse> {
    return this.http
      .post<VerifyOtpResponse>(`${this.apiUrl}/auth/verify-otp`, { email, otp })
      .pipe(
        tap(res => {
          if (res.token) {
            localStorage.setItem('reset_token', res.token);
          }
        }),
        catchError(err => {
          const message = err.error?.message || 'Code invalide ou expiré';
          return of({ success: false, message });
        })
      );
  }

  // ── Réinitialisation mot de passe ─────────────────────────────────────────────
  resetPassword(token: string, newPassword: string): Observable<ResetPasswordResponse> {
    return this.http
      .post<ResetPasswordResponse>(`${this.apiUrl}/auth/reset-password`, { token, newPassword })
      .pipe(
        tap(() => {
          // Nettoyer localStorage après succès
          localStorage.removeItem('reset_email');
          localStorage.removeItem('reset_token');
        }),
        catchError(err => {
          const message = err.error?.message || 'Erreur lors de la réinitialisation';
          return of({ success: false, message });
        })
      );
  }

  // ── Renvoi OTP ───────────────────────────────────────────────────────────────
  resendOtp(email: string): Observable<ForgotPasswordResponse> {
    return this.http
      .post<ForgotPasswordResponse>(`${this.apiUrl}/auth/forgot-password`, { email })
      .pipe(
        catchError(err => {
          const message = err.error?.message || 'Erreur lors du renvoi';
          return of({ success: false, message });
        })
      );
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────
  getStoredEmail(): string | null {
    return localStorage.getItem('reset_email');
  }

  getStoredToken(): string | null {
    return localStorage.getItem('reset_token');
  }

  clearResetData(): void {
    localStorage.removeItem('reset_email');
    localStorage.removeItem('reset_token');
  }
}
