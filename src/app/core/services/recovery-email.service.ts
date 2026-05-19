import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface RecoveryEmailRequest {
  email: string;
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

  // Ajouter un email de récupération et envoyer OTP
  addRecoveryEmail(email: string): Observable<RecoveryEmailResponse> {
    return this.http.post<RecoveryEmailResponse>(
      `${this.apiUrl}/user/recovery-email`,
      { email }
    );
  }

  // Vérifier l'OTP pour l'email de récupération
  verifyRecoveryEmail(email: string, otp: string): Observable<RecoveryEmailResponse> {
    return this.http.post<RecoveryEmailResponse>(
      `${this.apiUrl}/user/verify-recovery-email`,
      { email, otp }
    );
  }
}
