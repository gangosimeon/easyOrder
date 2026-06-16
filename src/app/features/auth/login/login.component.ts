import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { phoneNumberValidator } from '../../../shared/phone-input/phone-validator';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule }       from '@angular/material/form-field';
import { MatInputModule }           from '@angular/material/input';
import { MatButtonModule }          from '@angular/material/button';
import { MatIconModule }            from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService }              from '../../../core/services/auth.service';
import { PushNotificationService }  from '../../../core/services/push-notification.service';
import { LandingNavComponent }      from '../../landing/components/landing-nav/landing-nav.component';
import { PhoneInputComponent }      from '../../../shared/phone-input/phone-input.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule, RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    LandingNavComponent,
    PhoneInputComponent,
  ],
  templateUrl: './login.component.html',
  styleUrls:  ['./login.component.scss'],
})
export class LoginComponent {
  private fb          = inject(FormBuilder);
  private auth        = inject(AuthService);
  private router      = inject(Router);
  private pushService = inject(PushNotificationService);

  readonly countryCode  = signal('226');
  readonly showPassword = signal(false);
  readonly loading      = signal(false);
  readonly errorMsg     = signal<string | null>(null);
  readonly submitted    = signal(false);

  readonly form = this.fb.group({
    phone:    ['', [Validators.required, phoneNumberValidator(() => this.countryCode())]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor() {
    this.form.valueChanges.subscribe(() => {
      if (this.errorMsg()) this.errorMsg.set(null);
    });
    this.form.get('phone')?.valueChanges.subscribe(() => this.submitted.set(false));
  }

  onCountryChange(code: string): void {
    this.countryCode.set(code);
    this.form.get('phone')?.updateValueAndValidity();
  }

  togglePassword(): void { this.showPassword.update(v => !v); }

  onSubmit(): void {
    this.submitted.set(true);
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.errorMsg.set(null);
    this.loading.set(true);

    const { phone, password } = this.form.value;
    this.auth.login(phone!, password!, this.countryCode()).subscribe(result => {
      this.loading.set(false);
      if (result.success) {
        this.pushService.init();
        this.router.navigate(['/categories']);
      } else {
        this.errorMsg.set(result.error ?? 'Erreur de connexion');
      }
    });
  }
}
