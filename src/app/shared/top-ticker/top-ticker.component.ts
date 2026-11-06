import {
  Component, Input, Output, EventEmitter, inject, signal, OnInit, OnDestroy, DestroyRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, retry } from 'rxjs';
import { AdminAnnouncementService, AdminAnnouncement } from '../../core/services/admin-announcement.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-top-ticker',
  standalone: true,
  template: `
    @if (ann()) {
      <div class="ticker-bar" role="marquee" aria-live="polite" aria-label="Annonce de la plateforme"
           [style]="{'--tc': coverColor || null}">

        <!-- Bloc date fixe -->
        <div class="ticker-date">
          <span class="ticker-cal-icon">📅</span>
          <span class="ticker-date-long">{{ dateLabel }} · {{ timeLabel }}</span>
          <span class="ticker-date-short">{{ shortDate }}</span>
        </div>

        <!-- Badge INFO (masqué sur mobile) -->
        <div class="ticker-badge" aria-hidden="true">
          <span>📢</span>
          <span>INFO</span>
        </div>

        <!-- Zone de défilement -->
        <div class="ticker-scroll-zone">
          <div class="ticker-track"
               [class.paused]="hovered()"
               (mouseenter)="hovered.set(true)"
               (mouseleave)="hovered.set(false)">
            <span class="ticker-text">
              <strong class="ticker-title">{{ ann()!.title }}</strong>
              <span class="ticker-sep">—</span>
              {{ ann()!.content }}
            </span>
            <!-- Copie pour le défilement sans saut -->
            <span class="ticker-text" aria-hidden="true">
              <strong class="ticker-title">{{ ann()!.title }}</strong>
              <span class="ticker-sep">—</span>
              {{ ann()!.content }}
            </span>
          </div>
        </div>

      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [`
    :host { display: block; }

    /* ── Barre principale ── */
    .ticker-bar {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 400;
      height: 42px;
      background: linear-gradient(90deg,
        color-mix(in srgb, var(--tc, #00695c) 85%, #000) 0%,
        var(--tc, #00897b) 100%);
      display: flex;
      align-items: stretch;
      overflow: hidden;
      font-size: 14px;
      color: #fff;
      font-family: var(--font-body, 'Outfit', sans-serif);
    }

    /* ── Bloc date ── */
    .ticker-date {
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 0 28px 0 14px;
      background: color-mix(in srgb, var(--tc, #00695c) 60%, #000);
      flex-shrink: 0;
      white-space: nowrap;
      font-size: 12.5px;
      font-weight: 600;
      /* Pointe en flèche vers la droite */
      clip-path: polygon(0 0, calc(100% - 13px) 0, 100% 50%, calc(100% - 13px) 100%, 0 100%);
    }

    .ticker-cal-icon { font-size: 14px; line-height: 1; }
    .ticker-date-short { display: none; }

    /* ── Badge INFO ── */
    .ticker-badge {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 0 10px;
      background: #ffb300;
      color: #3e2700;
      font-size: 11px;
      font-weight: 800;
      border-radius: 20px;
      margin: 7px 10px 7px 14px;
      flex-shrink: 0;
      white-space: nowrap;
      letter-spacing: 0.3px;
    }

    /* ── Zone de défilement ── */
    .ticker-scroll-zone {
      flex: 1;
      overflow: hidden;
      position: relative;
      /* Fondu sur les bords */
      mask-image: linear-gradient(90deg,
        transparent 0,
        #000 18px,
        #000 calc(100% - 18px),
        transparent 100%);
      -webkit-mask-image: linear-gradient(90deg,
        transparent 0,
        #000 18px,
        #000 calc(100% - 18px),
        transparent 100%);
    }

    .ticker-track {
      display: flex;
      width: max-content;
      align-items: center;
      height: 100%;
      animation: ticker-scroll 32s linear infinite;
    }

    .ticker-track.paused {
      animation-play-state: paused;
    }

    .ticker-text {
      white-space: nowrap;
      padding: 0 48px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .ticker-title {
      color: #ffe082;
      font-weight: 700;
    }

    .ticker-sep {
      opacity: 0.6;
    }

    @keyframes ticker-scroll {
      0%   { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }

    /* ── prefers-reduced-motion ── */
    @media (prefers-reduced-motion: reduce) {
      .ticker-track {
        animation: none;
        width: 100%;
      }
      .ticker-text:last-child { display: none; }
      .ticker-text {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: block;
        max-width: 100%;
      }
      .ticker-scroll-zone {
        mask-image: none;
        -webkit-mask-image: none;
      }
    }

    /* ── Mobile (<640px) : date courte, badge masqué ── */
    @media (max-width: 639px) {
      .ticker-bar    { font-size: 12px; }
      .ticker-date   { padding: 0 22px 0 10px; font-size: 11px; gap: 5px; }
      .ticker-date-long  { display: none; }
      .ticker-date-short { display: inline; }
      .ticker-badge  { display: none; }
    }
  `],
})
export class TopTickerComponent implements OnInit, OnDestroy {
  @Input() coverColor?: string;

  private svc        = inject(AdminAnnouncementService);
  private auth       = inject(AuthService);
  private destroyRef = inject(DestroyRef);

  readonly ann    = signal<AdminAnnouncement | null>(null);
  readonly hovered = signal(false);

  private _now = signal<Date>(new Date());
  private clockInterval?: ReturnType<typeof setInterval>;

  @Output() hasContent = new EventEmitter<boolean>();

  ngOnInit(): void {
    // Non connecté : endpoint public pas encore disponible en backend → ne rien appeler
    if (!this.auth.isLoggedIn()) {
      this.hasContent.emit(false);
      this.clockInterval = setInterval(() => this._now.set(new Date()), 30_000);
      return;
    }

    this.svc.getActiveForShop()
      .pipe(
        retry(1),                    // 1 retry pour les erreurs de refresh de token au démarrage
        catchError(() => of([])),    // erreur résiduelle → tableau vide, pas de crash
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(list => {
        const first = list[0] ?? null;
        this.ann.set(first);
        this.hasContent.emit(!!first);
      });

    this.clockInterval = setInterval(() => this._now.set(new Date()), 30_000);
  }

  ngOnDestroy(): void {
    if (this.clockInterval) clearInterval(this.clockInterval);
  }

  get dateLabel(): string {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    }).format(this._now()).replace(/^\w/, c => c.toUpperCase());
  }

  get shortDate(): string {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    }).format(this._now());
  }

  get timeLabel(): string {
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit', minute: '2-digit',
    }).format(this._now());
  }
}
