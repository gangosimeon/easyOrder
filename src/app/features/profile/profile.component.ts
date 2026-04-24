import { Component, ElementRef, ViewChild, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule }       from '@angular/material/form-field';
import { MatInputModule }           from '@angular/material/input';
import { MatButtonModule }          from '@angular/material/button';
import { MatIconModule }            from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRippleModule }          from '@angular/material/core';
import { AuthService }              from '../../core/services/auth.service';
import { COVER_COLORS, SHOP_LOGOS } from '../auth/register/register.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatSnackBarModule, MatRippleModule,
  ],
  templateUrl: './profile.component.html',
  styleUrls:  ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  @ViewChild('logoFileRef') logoFileRef!: ElementRef<HTMLInputElement>;

  private auth     = inject(AuthService);
  private fb       = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  readonly company     = this.auth.company;
  readonly coverColors = COVER_COLORS;
  readonly shopLogos   = SHOP_LOGOS;

  form!: FormGroup;
  logoMode      = signal<'emoji' | 'upload'>('emoji');
  selectedLogo  = signal<string>('🏪');
  uploadedLogo  = signal<string>('');
  selectedColor = signal<string>('#a04343');
  loading       = signal<boolean>(false);
  errorMsg      = signal<string | null>(null);

  ngOnInit(): void {
    const c = this.company();
    const existingLogo = c?.logo ?? '🏪';
    if (existingLogo.startsWith('data:image/') || existingLogo.startsWith('http')) {
      this.logoMode.set('upload');
      this.uploadedLogo.set(existingLogo);
    } else {
      this.selectedLogo.set(existingLogo);
    }
    this.selectedColor.set(c?.coverColor ?? '#a04343');

    this.form = this.fb.group({
      name:        [c?.name        ?? '', [Validators.required, Validators.minLength(2)]],
      description: [c?.description ?? ''],
      address:     [c?.address     ?? ''],
    });
  }

  setLogoMode(mode: 'emoji' | 'upload'): void { this.logoMode.set(mode); }
  selectLogo(logo: string): void              { this.selectedLogo.set(logo); }
  selectColor(color: string): void            { this.selectedColor.set(color); }
  triggerLogoUpload(): void                   { this.logoFileRef.nativeElement.click(); }

  async onLogoFileSelected(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const base64 = await this.resizeImage(file);
    this.uploadedLogo.set(base64);
    (event.target as HTMLInputElement).value = '';
  }

  private resizeImage(file: File, maxSize = 300, quality = 0.82): Promise<string> {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = e => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxSize || height > maxSize) {
            if (width > height) { height = Math.round(height * maxSize / width); width = maxSize; }
            else                { width  = Math.round(width  * maxSize / height); height = maxSize; }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width; canvas.height = height;
          canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.src = e.target!.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

  get activeLogo(): string {
    return this.logoMode() === 'upload' ? this.uploadedLogo() : this.selectedLogo();
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.errorMsg.set(null);

    const v = this.form.value;
    this.auth.updateProfile({
      name:        v.name,
      description: v.description,
      address:     v.address,
      logo:        this.activeLogo,
      coverColor:  this.selectedColor(),
    }).subscribe(result => {
      this.loading.set(false);
      if (result.success) {
        this.snackBar.open('Profil mis à jour !', 'OK', { duration: 3000 });
      } else {
        this.errorMsg.set(result.error ?? 'Erreur lors de la mise à jour');
      }
    });
  }
}
