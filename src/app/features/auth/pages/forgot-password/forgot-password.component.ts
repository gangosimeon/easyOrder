import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  readonly loading = signal(false);
  readonly submitted = signal(false);

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  get emailControl() {
    return this.form.get('email')!;
  }

  getEmailError(): string {
    if (this.emailControl.hasError('required')) {
      return 'Email requis';
    }
    if (this.emailControl.hasError('email')) {
      return 'Email invalide';
    }
    return '';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const email = this.emailControl.value.trim();
    if (!email) return;

    this.loading.set(true);
    this.submitted.set(true);

    this.authService.forgotPassword(email).subscribe({
      next: res => {
        this.loading.set(false);
        if (res.success) {
          this.snackBar.open(res.message || 'Code envoyé avec succès', '', {
            duration: 3000,
            panelClass: ['snack-success'],
          });
          this.router.navigate(['/auth/verify-otp'], { queryParams: { email } });
        } else {
          this.snackBar.open(res.message || 'Erreur lors de l\'envoi', '', {
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
    this.router.navigate(['/login']);
  }
}
