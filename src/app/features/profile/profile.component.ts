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
import { ShopStatsService, ShopStats } from '../../core/services/shop-stats.service';
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
  private statsService  = inject(ShopStatsService);

  readonly company     = this.auth.company;
  readonly shopUrl     = computed(() => {
    const slug = this.company()?.slug;
    if (!slug) return '';
    return `${window.location.origin}/shop/${slug}`;
  });
  linkCopied    = signal(false);
  copiedChannel = signal<string | null>(null);
  readonly coverColors = COVER_COLORS;
  readonly shopLogos   = SHOP_LOGOS;

  readonly SHARE_CHANNELS = [
    { key: 'whatsapp', label: 'WhatsApp',  color: '#25D366', icon: 'chat',          canShare: true  },
    { key: 'facebook', label: 'Facebook',  color: '#1877F2', icon: 'thumb_up',      canShare: false },
    { key: 'tiktok',   label: 'TikTok',   color: '#010101', icon: 'music_note',    canShare: false },
    { key: 'instagram',label: 'Instagram', color: '#E1306C', icon: 'photo_camera',  canShare: false },
    { key: 'sms',      label: 'SMS',       color: '#6366f1', icon: 'sms',           canShare: true  },
    { key: 'direct',   label: 'Lien seul', color: '#6b7280', icon: 'link',          canShare: false },
  ];

  readonly shareLinks = computed(() => {
    const base = this.shopUrl();
    return this.SHARE_CHANNELS.map(ch => ({
      ...ch,
      url: ch.key === 'direct' ? base : `${base}?source=${ch.key}`,
    }));
  });

  form!: FormGroup;
  logoMode      = signal<'emoji' | 'upload'>('emoji');
  selectedLogo  = signal<string>('🏪');
  uploadedLogo  = signal<string>('');
  selectedColor = signal<string>('#a04343');
  loading       = signal<boolean>(false);
  logoUploading = signal<boolean>(false);
  logoUploadErr = signal<string>('');
  errorMsg      = signal<string | null>(null);

  statsOpen    = signal(false);
  stats        = signal<ShopStats | null>(null);
  statsLoading = signal(false);
  statsError   = signal<string | null>(null);
  statsLoaded  = false;

  readonly chartMax = computed(() => {
    const days = this.stats()?.visitsPerDay ?? [];
    return Math.max(1, ...days.map(d => d.count));
  });

  toggleStats(): void {
    this.statsOpen.update(v => !v);
    if (this.statsOpen() && !this.statsLoaded) {
      this.loadStats();
    }
  }

  private loadStats(): void {
    const shopId = this.company()?.id;
    if (!shopId) return;
    this.statsLoading.set(true);
    this.statsError.set(null);
    this.statsService.getStats(shopId).subscribe({
      next: data => {
        this.stats.set(data);
        this.statsLoading.set(false);
        this.statsLoaded = true;
      },
      error: () => {
        this.statsError.set('Impossible de charger les statistiques.');
        this.statsLoading.set(false);
      },
    });
  }

  chartBarHeight(count: number): string {
    return `${Math.round((count / this.chartMax()) * 100)}%`;
  }

  chartDayLabel(dateStr: string): string {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('fr-FR', { weekday: 'short' });
  }

  sourceIcon(source: string): string {
    const map: Record<string, string> = {
      whatsapp: 'chat',
      facebook: 'thumb_up',
      instagram: 'photo_camera',
      twitter:  'tag',
      direct:   'link',
    };
    return map[source.toLowerCase()] ?? 'travel_explore';
  }

  sourceColor(source: string): string {
    const map: Record<string, string> = {
      whatsapp: '#25D366',
      facebook: '#1877F2',
      instagram:'#E1306C',
      twitter:  '#1DA1F2',
      direct:   '#6b7280',
    };
    return map[source.toLowerCase()] ?? '#8b5cf6';
  }

  copyShareLink(url: string, key: string): void {
    navigator.clipboard.writeText(url).then(() => {
      this.copiedChannel.set(key);
      setTimeout(() => this.copiedChannel.set(null), 2000);
    });
  }

  openWhatsApp(url: string): void {
    const text = encodeURIComponent(`Découvrez ma boutique en ligne ${url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  }

  openSms(url: string): void {
    const text = encodeURIComponent(`Découvrez ma boutique en ligne : ${url}`);
    window.open(`sms:?body=${text}`, '_self');
  }

  sourceBarWidth(count: number): string {
    const max = Math.max(1, ...(this.stats()?.visitsBySource ?? []).map(s => s.count));
    return `${Math.round((count / max) * 100)}%`;
  }

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
    const text = `Découvrez ma boutique en ligne ${this.company()?.name ?? ''} : ${url}?source=whatsapp`;
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
