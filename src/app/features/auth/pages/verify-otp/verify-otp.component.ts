import { Component, inject, signal, computed, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verify-otp',
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
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.scss'],
})
export class VerifyOtpComponent implements AfterViewInit, OnDestroy {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  readonly loading = signal(false);
  readonly timer = signal(60);
  readonly canResend = computed(() => this.timer() === 0);
  readonly otpDigits = signal<string[]>(['', '', '', '', '', '']);
  email = signal('');

  private intervalId: number | null = null;

  @ViewChild('otp0') otp0!: ElementRef<HTMLInputElement>;
  @ViewChild('otp1') otp1!: ElementRef<HTMLInputElement>;
  @ViewChild('otp2') otp2!: ElementRef<HTMLInputElement>;
  @ViewChild('otp3') otp3!: ElementRef<HTMLInputElement>;
  @ViewChild('otp4') otp4!: ElementRef<HTMLInputElement>;
  @ViewChild('otp5') otp5!: ElementRef<HTMLInputElement>;

  private inputs: ElementRef<HTMLInputElement>[] = [];

  ngAfterViewInit(): void {
    this.inputs = [this.otp0, this.otp1, this.otp2, this.otp3, this.otp4, this.otp5];

    const emailFromQuery = this.route.snapshot.queryParamMap.get('email') || this.authService.getStoredEmail() || '';

    this.email.set(emailFromQuery);

    if (!emailFromQuery) {
      this.snackBar.open('Email manquant. Recommencez.', '', { duration: 3000 });
      this.router.navigate(['/auth/forgot-password']);
      return;
    }

    this.startTimer();
    this.otp0?.nativeElement.focus();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private startTimer(): void {
    this.timer.set(60);
    this.intervalId = window.setInterval(() => {
      const current = this.timer();
      if (current > 0) {
        this.timer.set(current - 1);
      } else {
        if (this.intervalId) clearInterval(this.intervalId);
      }
    }, 1000);
  }

  onOtpInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Uniquement le dernier caractère
    if (value.length > 1) {
      input.value = value.slice(-1);
    }

    const digits = [...this.otpDigits()];
    digits[index] = input.value;
    this.otpDigits.set(digits);

    // Auto-focus next input
    if (value && index < 5) {
      this.inputs[index + 1]?.nativeElement.focus();
    }

    // Auto-submit si tous remplis
    if (digits.every(d => d.length === 1)) {
      this.verifyOtp();
    }
  }

  onOtpKeyDown(index: number, event: KeyboardEvent): void {
    // Backspace intelligent
    if (event.key === 'Backspace') {
      const digits = [...this.otpDigits()];
      if (!digits[index] && index > 0) {
        digits[index - 1] = '';
        this.otpDigits.set(digits);
        this.inputs[index - 1]?.nativeElement.focus();
        event.preventDefault();
      } else if (digits[index]) {
        digits[index] = '';
        this.otpDigits.set(digits);
      }
    }
    // Flèches directionnelles
    else if (event.key === 'ArrowLeft' && index > 0) {
      this.inputs[index - 1]?.nativeElement.focus();
    } else if (event.key === 'ArrowRight' && index < 5) {
      this.inputs[index + 1]?.nativeElement.focus();
    }
  }

  onOtpPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text') || '';
    const digits = pastedData.replace(/\D/g, '').slice(0, 6).split('');

    if (digits.length === 6) {
      this.otpDigits.set(digits);
      this.inputs.forEach((input, i) => {
        input.nativeElement.value = digits[i] || '';
      });
      this.verifyOtp();
    } else {
      // Remplir ce qu'on peut
      const current = [...this.otpDigits()];
      digits.forEach((d, i) => {
        current[i] = d;
        this.inputs[i].nativeElement.value = d;
      });
      this.otpDigits.set(current);
      // Focus sur le prochain vide
      const nextEmpty = current.findIndex(d => !d);
      if (nextEmpty !== -1 && nextEmpty < 6) {
        this.inputs[nextEmpty]?.nativeElement.focus();
      }
    }
  }

  onFocus(index: number): void {
    this.inputs[index]?.nativeElement.select();
  }

  verifyOtp(): void {
    const otp = this.otpDigits().join('');
    if (otp.length !== 6) {
      this.snackBar.open('Entrez les 6 chiffres du code', '', { duration: 2500 });
      return;
    }

    this.loading.set(true);
    this.authService.verifyOtp(this.email(), otp).subscribe({
      next: res => {
        this.loading.set(false);
        if (res.success) {
          this.snackBar.open('Code vérifié avec succès', '', {
            duration: 2500,
            panelClass: ['snack-success'],
          });
          this.router.navigate(['/auth/reset-password']);
        } else {
          this.snackBar.open(res.message || 'Code invalide', '', {
            duration: 3000,
            panelClass: ['snack-error'],
          });
          this.clearOtp();
          this.otp0?.nativeElement.focus();
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

  resendOtp(): void {
    if (!this.canResend()) return;

    this.authService.resendOtp(this.email()).subscribe({
      next: res => {
        if (res.success) {
          this.snackBar.open('Nouveau code envoyé', '', {
            duration: 3000,
            panelClass: ['snack-success'],
          });
          this.startTimer();
          this.clearOtp();
          this.otp0?.nativeElement.focus();
        } else {
          this.snackBar.open(res.message || 'Erreur lors du renvoi', '', {
            duration: 3000,
            panelClass: ['snack-error'],
          });
        }
      },
      error: () => {
        this.snackBar.open('Erreur serveur', '', { duration: 3000 });
      },
    });
  }

  clearOtp(): void {
    this.otpDigits.set(['', '', '', '', '', '']);
    this.inputs.forEach(input => input.nativeElement.value = '');
  }

  goBack(): void {
    this.router.navigate(['/auth/forgot-password'], { queryParams: { email: this.email() } });
  }
}
