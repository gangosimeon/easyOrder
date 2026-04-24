import { Component, inject, signal } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule }       from '@angular/material/form-field';
import { MatInputModule }           from '@angular/material/input';
import { MatButtonModule }          from '@angular/material/button';
import { MatIconModule }            from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule }          from '@angular/material/core';
import { AuthService }              from '../../../core/services/auth.service';

export const COVER_COLORS = [
  '#a04343', '#E53935', '#D81B60', '#8E24AA', '#5E35B1',
  '#1E88E5', '#039BE5', '#00ACC1', '#00897B', '#43A047',
  '#FFB300', '#FB8C00', '#F4511E', '#6D4C41', '#546E7A',
];

export const SHOP_LOGOS = [
  '🏪', '🛒', '🏬', '🛍️', '💼', '🍽️', '💊', '👗', '📱', '🍎',
  '🥦', '🌿', '💄', '🔧', '📚', '🎨', '⚡', '🚗', '🏠', '💎',
  '🎯', '🌺', '🍕', '🐟', '🌾', '🧴', '💈', '🎪', '🧺', '🪴',
];

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password        = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password && confirmPassword && password !== confirmPassword
    ? { passwordMismatch: true }
    : null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule, RouterLink,
    MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatRippleModule,
  ],
  templateUrl: './register.component.html',
  styleUrls:  ['./register.component.scss'],
})
export class RegisterComponent {
  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private router = inject(Router);

  readonly coverColors = COVER_COLORS;
  readonly shopLogos   = SHOP_LOGOS;

  readonly selectedLogo  = signal('🏪');
  readonly selectedColor = signal(COVER_COLORS[0]);
  readonly showPassword  = signal(false);
  readonly showConfirm   = signal(false);
  readonly loading       = signal(false);
  readonly errorMsg      = signal<string | null>(null);

  readonly logoMode     = signal<'emoji' | 'upload'>('emoji');
  readonly uploadedLogo = signal<string | null>(null);

  readonly form = this.fb.group(
    {
      name:            ['', [Validators.required, Validators.minLength(3)]],
      phone:           ['', [Validators.required, Validators.pattern(/^[0-9]{8,15}$/)]],
      password:        ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      description:     [''],
      address:         [''],
    },
    { validators: passwordMatchValidator },
  );

  selectLogo(logo: string):   void { this.selectedLogo.set(logo); }
  selectColor(color: string): void { this.selectedColor.set(color); }
  togglePassword(): void           { this.showPassword.update(v => !v); }
  toggleConfirm():  void           { this.showConfirm.update(v => !v); }

  setLogoMode(mode: 'emoji' | 'upload'): void {
    this.logoMode.set(mode);
    if (mode === 'emoji') { this.uploadedLogo.set(null); }
  }

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { return; }
    const reader = new FileReader();
    reader.onload = () => this.uploadedLogo.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  get activeLogo(): string {
    return this.logoMode() === 'upload' && this.uploadedLogo()
      ? this.uploadedLogo()!
      : this.selectedLogo();
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.errorMsg.set(null);
    this.loading.set(true);

    const v = this.form.value;
    this.auth.register({
      name:        v.name!,
      phone:       v.phone!,
      password:    v.password!,
      description: v.description ?? '',
      logo:        this.activeLogo,
      address:     v.address ?? '',
      coverColor:  this.selectedColor(),
    }).subscribe(result => {
      this.loading.set(false);
      if (result.success) {
        this.router.navigate(['/categories']);
      } else {
        this.errorMsg.set(result.error ?? 'Erreur lors de l\'inscription');
      }
    });
  }
}
