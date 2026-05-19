import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ChangePasswordService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  changePassword(data: ChangePasswordRequest): Observable<ChangePasswordResponse> {
    return this.http
      .post<ChangePasswordResponse>(`${this.apiUrl}/auth/change-password`, data)
      .pipe(
        map(res => res),
        catchError(err => {
          const message = err.error?.message || 'Erreur lors du changement de mot de passe';
          return of({ success: false, message });
        })
      );
  }
}
