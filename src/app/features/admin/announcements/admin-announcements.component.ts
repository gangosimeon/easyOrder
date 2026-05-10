import { Component, OnInit, signal, inject, DestroyRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  AdminAnnouncementService,
  AdminAnnouncement,
} from '../../../core/services/admin-announcement.service';
import {
  AdminAnnouncementFormDialogComponent,
  AnnouncementDialogData,
} from './admin-announcement-form.dialog';

@Component({
  selector: 'app-admin-announcements',
  standalone: true,
  imports: [
    DatePipe,
    MatCardModule, MatTableModule, MatButtonModule,
    MatIconModule, MatDialogModule, MatTooltipModule, MatProgressBarModule,
  ],
  templateUrl: './admin-announcements.component.html',
  styleUrl:    './admin-announcements.component.scss',
})
export class AdminAnnouncementsComponent implements OnInit {
  private svc        = inject(AdminAnnouncementService);
  private dialog     = inject(MatDialog);
  private destroyRef = inject(DestroyRef);

  readonly loading       = signal(false);
  readonly saving        = signal(false);
  readonly announcements = signal<AdminAnnouncement[]>([]);
  readonly total         = signal(0);
  readonly error         = signal<string | null>(null);
  readonly deletingId    = signal<string | null>(null);
  readonly togglingId    = signal<string | null>(null);

  readonly displayedColumns = ['type', 'title', 'target', 'status', 'expireAt', 'createdAt', 'actions'];

  readonly skeletonRows = Array(4).fill(0);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.svc.list().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: data => {
        this.announcements.set(data.data);
        this.total.set(data.total);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger les annonces.');
        this.loading.set(false);
      },
    });
  }

  openForm(announcement?: AdminAnnouncement): void {
    const ref = this.dialog.open(AdminAnnouncementFormDialogComponent, {
      data:     { announcement } satisfies AnnouncementDialogData,
      width:    '560px',
      maxWidth: '95vw',
    });

    ref.afterClosed().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(result => {
      if (!result) return;
      this.saving.set(true);
      const req = announcement
        ? this.svc.update(announcement.id, result)
        : this.svc.create(result);

      req.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => { this.saving.set(false); this.load(); },
        error: () => this.saving.set(false),
      });
    });
  }

  toggleActive(ann: AdminAnnouncement): void {
    this.togglingId.set(ann.id);
    this.svc.toggle(ann.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: updated => {
        this.announcements.update(list =>
          list.map(a => a.id === updated.id ? updated : a)
        );
        this.togglingId.set(null);
      },
      error: () => this.togglingId.set(null),
    });
  }

  deleteAnnouncement(ann: AdminAnnouncement): void {
    if (this.deletingId()) return;
    this.deletingId.set(ann.id);
    this.svc.delete(ann.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.announcements.update(list => list.filter(a => a.id !== ann.id));
        this.total.update(n => n - 1);
        this.deletingId.set(null);
      },
      error: () => this.deletingId.set(null),
    });
  }

  typeLabel(type: string): string {
    const map: Record<string, string> = {
      info:    'Information',
      success: 'Succès',
      warning: 'Avertissement',
      urgent:  'Urgent',
    };
    return map[type] ?? type;
  }

  typeIcon(type: string): string {
    const map: Record<string, string> = {
      info:    'info',
      success: 'check_circle',
      warning: 'warning',
      urgent:  'priority_high',
    };
    return map[type] ?? 'info';
  }
}
