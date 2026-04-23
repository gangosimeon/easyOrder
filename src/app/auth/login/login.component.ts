import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule }       from '@angular/material/form-field';
import { MatInputModule }           from '@angular/material/input';
import { MatButtonModule }          from '@angular/material/button';
import { MatIconModule }            from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService }              from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule, RouterLink,
    MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule,
  ],
  templateUrl: './login.component.html',
  styleUrls:  ['./login.component.scss'],
})
export class LoginComponent {
  private fb   = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  readonly form = this.fb.group({
    phone:    ['', [Validators.required, Validators.pattern(/^[0-9]{8,15}$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  readonly showPassword = signal(false);
  readonly loading      = signal(false);
  readonly errorMsg     = signal<string | null>(null);

  togglePassword(): void { this.showPassword.update(v => !v); }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.errorMsg.set(null);
    this.loading.set(true);

    const { phone, password } = this.form.value;
    setTimeout(() => {
      const result = this.auth.login(phone!, password!);
      this.loading.set(false);
      if (result.success) {
        this.router.navigate(['/categories']);
      } else {
        this.errorMsg.set(result.error ?? 'Erreur de connexion');
      }
    }, 700);
  }
}
