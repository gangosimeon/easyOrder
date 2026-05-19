import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  private fb = inject(FormBuilder);
  router = inject(Router);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  readonly loading = signal(false);
  readonly hidePassword = signal(true);
  readonly hideConfirm = signal(true);

  form: FormGroup = this.fb.group(
    {
      newPassword:     ['', Validators.required],
      confirmPassword: ['', Validators.required],
    },
    { validators: this.passwordMatchValidator }
  );

  get newPasswordControl() {
    return this.form.get('newPassword')!;
  }

  get confirmPasswordControl() {
    return this.form.get('confirmPassword')!;
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  getNewPasswordError(): string {
    if (this.newPasswordControl.hasError('required')) return 'Mot de passe requis';
    return '';
  }

  getConfirmPasswordError(): string {
    if (this.confirmPasswordControl.hasError('required')) return 'Confirmation requise';
    if (this.form.hasError('mismatch')) return 'Les mots de passe ne correspondent pas';
    return '';
  }

  togglePasswordVisibility(): void {
    this.hidePassword.update(v => !v);
  }

  toggleConfirmVisibility(): void {
    this.hideConfirm.update(v => !v);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const token = this.authService.getStoredToken();
    if (!token) {
      this.snackBar.open('Session expirée. Recommencez.', '', {
        duration: 3000,
        panelClass: ['snack-error'],
      });
      this.router.navigate(['/auth/forgot-password']);
      return;
    }

    this.loading.set(true);
    const newPassword = this.newPasswordControl.value;

    this.authService.resetPassword(token, newPassword).subscribe({
      next: res => {
        this.loading.set(false);
        if (res.success) {
          this.router.navigate(['/auth/success']);
        } else {
          this.snackBar.open(res.message || 'Erreur lors de la réinitialisation', '', {
            duration: 3000,
            panelClass: ['snack-error'],
          });
        }
      },
      error: () => {
        this.loading.set(false);
        this.snackBar.open('Erreur serveur. Réessayez.', '', {
          duration: 3000,
          panelClass: ['snack-error'],
        });
      },
    });
  }
}
