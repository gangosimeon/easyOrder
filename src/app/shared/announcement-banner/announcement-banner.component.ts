import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  AdminAnnouncementService,
  AdminAnnouncement,
} from '../../core/services/admin-announcement.service';
import { AuthService } from '../../core/services/auth.service';

const STORAGE_KEY = 'bs_seen_admin_ann';

@Component({
  selector: 'app-announcement-banner',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  template: `
    @for (ann of visible(); track ann.id) {
      <div class="ann-wrap ann-{{ ann.type }}" role="alert" aria-live="polite">
        <mat-icon class="ann-icon">{{ iconFor(ann.type) }}</mat-icon>
        <div class="ann-body">
          <strong class="ann-title">{{ ann.title }}</strong>
          <span class="ann-content">{{ ann.content }}</span>
        </div>
        <button mat-icon-button class="ann-close" (click)="dismiss(ann.id)" aria-label="Fermer">
          <mat-icon>close</mat-icon>
        </button>
      </div>
    }
  `,
  styles: [`
    :host { display: block; }

    .ann-wrap {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 13px 16px;
      margin: 8px 16px 0;
      border-radius: 12px;
      border-left: 4px solid transparent;
      animation: annSlide .22s ease;
    }

    @keyframes annSlide {
      from { opacity: 0; transform: translateY(-6px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .ann-info    { background: #eff6ff; border-color: #3b82f6; color: #1e3a8a; }
    .ann-success { background: #f0fdf4; border-color: #22c55e; color: #14532d; }
    .ann-warning { background: #fffbeb; border-color: #f59e0b; color: #78350f; }
    .ann-urgent  { background: #fef2f2; border-color: #ef4444; color: #7f1d1d; }

    .ann-icon {
      flex-shrink: 0;
      font-size: 20px;
      width: 20px;
      height: 20px;
      margin-top: 1px;
    }

    .ann-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .ann-title   { font-size: 13px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .ann-content { font-size: 13px; opacity: .85; line-height: 1.4; }

    .ann-close {
      flex-shrink: 0;
      opacity: .55;
      transition: opacity .15s;
      &:hover { opacity: 1; }
    }

    @media (max-width: 600px) {
      .ann-wrap { margin: 6px 10px 0; padding: 11px 12px; border-radius: 10px; }
    }
  `],
})
export class AnnouncementBannerComponent implements OnInit {
  private svc        = inject(AdminAnnouncementService);
  private auth       = inject(AuthService);
  private destroyRef = inject(DestroyRef);

  readonly visible = signal<AdminAnnouncement[]>([]);

  ngOnInit(): void {
    if (!this.auth.isLoggedIn()) return;
    this.svc.getActiveForShop()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next:  list => this.visible.set(list.filter(a => !this.seenIds().has(a.id))),
        error: () => {},
      });
  }

  iconFor(type: string): string {
    const map: Record<string, string> = {
      info:    'info',
      success: 'check_circle',
      warning: 'warning',
      urgent:  'priority_high',
    };
    return map[type] ?? 'info';
  }

  dismiss(id: string): void {
    const seen = this.seenIds();
    seen.add(id);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...seen])); } catch { /* */ }
    this.visible.update(list => list.filter(a => a.id !== id));
  }

  private seenIds(): Set<string> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return new Set(raw ? (JSON.parse(raw) as string[]) : []);
    } catch {
      return new Set();
    }
  }
}
