import { Component, ElementRef, ViewChild, inject, signal, computed, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule }       from '@angular/material/form-field';
import { MatInputModule }           from '@angular/material/input';
import { MatButtonModule }          from '@angular/material/button';
import { MatIconModule }            from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRippleModule }          from '@angular/material/core';
import { AuthService }              from '../../core/services/auth.service';
import { UploadService }            from '../../core/services/upload.service';
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

  private auth          = inject(AuthService);
  private fb            = inject(FormBuilder);
  private snackBar      = inject(MatSnackBar);
  private uploadService = inject(UploadService);

  readonly company     = this.auth.company;
  readonly shopUrl     = computed(() => {
    const slug = this.company()?.slug;
    if (!slug) return '';
    return `${window.location.origin}/shop/${slug}`;
  });
  linkCopied = signal(false);
  readonly coverColors = COVER_COLORS;
  readonly shopLogos   = SHOP_LOGOS;

  form!: FormGroup;
  logoMode      = signal<'emoji' | 'upload'>('emoji');
  selectedLogo  = signal<string>('🏪');
  uploadedLogo  = signal<string>('');
  selectedColor = signal<string>('#a04343');
  loading       = signal<boolean>(false);
  logoUploading = signal<boolean>(false);
  logoUploadErr = signal<string>('');
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

  onLogoFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    (event.target as HTMLInputElement).value = '';

    this.logoUploading.set(true);
    this.logoUploadErr.set('');

    this.uploadService.upload(file).subscribe({
      next: url => {
        this.uploadedLogo.set(url);
        this.logoUploading.set(false);
      },
      error: () => {
        this.logoUploadErr.set('Échec de l\'upload, réessayez.');
        this.logoUploading.set(false);
      },
    });
  }

  shareWhatsApp(): void {
    const url = this.shopUrl();
    const text = `Découvrez ma boutique en ligne ${this.company()?.name ?? ''} : ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }

  shareFacebook(): void {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.shopUrl())}`, '_blank');
  }

  async copyLink(): Promise<void> {
    await navigator.clipboard.writeText(this.shopUrl());
    this.linkCopied.set(true);
    setTimeout(() => this.linkCopied.set(false), 2000);
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
