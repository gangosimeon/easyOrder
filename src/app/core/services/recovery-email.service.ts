import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface RecoveryEmailRequest {
  email: string;
  currentPassword: string;
}

export interface VerifyRecoveryEmailRequest {
  email: string;
  otp: string;
}

export interface RecoveryEmailResponse {
  message: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecoveryEmailService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Demander un email de récupération (mot de passe actuel exigé) et envoyer l'OTP.
  // L'email ne remplace l'actuel qu'après vérification du code.
  addRecoveryEmail(email: string, currentPassword: string): Observable<RecoveryEmailResponse> {
    const body: RecoveryEmailRequest = { email, currentPassword };
    return this.http.post<RecoveryEmailResponse>(`${this.apiUrl}/user/recovery-email`, body);
  }

  // Vérifier l'OTP pour l'email de récupération
  verifyRecoveryEmail(email: string, otp: string): Observable<RecoveryEmailResponse> {
    return this.http.post<RecoveryEmailResponse>(
      `${this.apiUrl}/user/verify-recovery-email`,
      { email, otp }
    );
  }
}
