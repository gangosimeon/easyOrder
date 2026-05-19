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

import { ChangePasswordService } from '../../../core/services/change-password.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-change-password',
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
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private changePasswordService = inject(ChangePasswordService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  readonly loading = signal(false);
  readonly hideCurrent = signal(true);
  readonly hideNew = signal(true);
  readonly hideConfirm = signal(true);

  form: FormGroup = this.fb.group(
    {
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: this.passwordMatchValidator }
  );

  get currentPasswordControl() {
    return this.form.get('currentPassword')!;
  }

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

  getCurrentPasswordError(): string {
    if (this.currentPasswordControl.hasError('required')) {
      return 'Mot de passe actuel requis';
    }
    return '';
  }

  getNewPasswordError(): string {
    if (this.newPasswordControl.hasError('required')) {
      return 'Nouveau mot de passe requis';
    }
    if (this.newPasswordControl.hasError('minlength')) {
      return 'Minimum 6 caractères';
    }
    return '';
  }

  getConfirmPasswordError(): string {
    if (this.confirmPasswordControl.hasError('required')) {
      return 'Confirmation requise';
    }
    if (this.confirmPasswordControl.hasError('mismatch')) {
      return 'Les mots de passe ne correspondent pas';
    }
    return '';
  }

  toggleCurrentVisibility(): void {
    this.hideCurrent.update(v => !v);
  }

  toggleNewVisibility(): void {
    this.hideNew.update(v => !v);
  }

  toggleConfirmVisibility(): void {
    this.hideConfirm.update(v => !v);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const { currentPassword, newPassword } = this.form.value;

    this.changePasswordService.changePassword({ currentPassword, newPassword }).subscribe({
      next: res => {
        this.loading.set(false);
        if (res.success) {
          this.snackBar.open(res.message || 'Mot de passe modifié avec succès', '', {
            duration: 3000,
            panelClass: ['snack-success'],
          });
          // Logout et redirect vers login
          this.authService.logout();
          this.router.navigate(['/login']);
        } else {
          this.snackBar.open(res.message || 'Erreur lors du changement', '', {
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

  goBack(): void {
    this.router.navigate(['/profile']);
  }
}
