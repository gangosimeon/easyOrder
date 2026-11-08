import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GeststockSyncService, GeststockCategory } from '../../../core/services/geststock-sync.service';

/**
 * Dialogue de rapprochement des catégories GestStock / locales (lot 3, JA2).
 * Ferme automatiquement quand la liste des catégories non rapprochees est vide.
 */
@Component({
  selector: 'app-geststock-match-categories-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 mat-dialog-title>Rapprocher des categories</h2>
    <mat-dialog-content>
      @if (loading()) {
        <p class="muted">Chargement...</p>
      } @else if (error()) {
        <p class="err" role="alert">{{ error() }}</p>
      } @else {
        <div class="match-layout">
          <div class="match-col">
            <h3 class="col-title">Categories GestStock</h3>
            @for (cat of geststockList(); track cat.id) {
              <button
                class="cat-item"
                [class.selected]="selectedGeststock()?.id === cat.id"
                type="button"
                (click)="selectGeststock(cat)">
                <mat-icon>category</mat-icon> {{ cat.name }}
              </button>
            } @empty {
              <p class="muted">Aucune</p>
            }
          </div>
          <div class="match-sep">
            <mat-icon>compare_arrows</mat-icon>
          </div>
          <div class="match-col">
            <h3 class="col-title">Categories locales</h3>
            @for (cat of localList(); track cat.id) {
              <button
                class="cat-item"
                [class.selected]="selectedLocal()?.id === cat.id"
                type="button"
                (click)="selectLocal(cat)">
                <mat-icon>store</mat-icon> {{ cat.name }}
              </button>
            } @empty {
              <p class="muted">Aucune</p>
            }
          </div>
        </div>
        @if (matchError()) {
          <p class="err" role="alert">{{ matchError() }}</p>
        }
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-stroked-button type="button" (click)="close()">Fermer</button>
      <button
        mat-flat-button
        color="primary"
        type="button"
        [disabled]="!canMatch() || matching()"
        (click)="match()">
        <mat-icon>link</mat-icon>
        {{ matching() ? 'En cours...' : 'Rapprocher' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .match-layout {
      display: flex;
      gap: 8px;
      align-items: flex-start;
      min-width: 480px;
    }
    .match-col {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .match-sep {
      display: flex;
      align-items: center;
      padding-top: 36px;
      color: #888;
    }
    .col-title {
      font-size: 0.85rem;
      color: #555;
      margin: 0 0 6px;
      font-weight: 600;
    }
    .cat-item {
      display: flex;
      align-items: center;
      gap: 6px;
      background: #f5f5f5;
      border: 2px solid transparent;
      border-radius: 8px;
      padding: 8px 10px;
      cursor: pointer;
      text-align: left;
      font-size: 0.9rem;
      transition: border-color 0.15s, background 0.15s;
    }
    .cat-item:hover { background: #e8f0fe; }
    .cat-item.selected { border-color: #1a73e8; background: #e8f0fe; }
    .muted { color: #888; font-size: 0.9rem; }
    .err { color: #b71c1c; background: #fdecea; border-radius: 6px; padding: 8px 12px; }
    @media (max-width: 540px) { .match-layout { min-width: unset; flex-direction: column; } }
  `],
})
export class GeststockMatchCategoriesDialogComponent implements OnInit {
  private readonly sync = inject(GeststockSyncService);
  private readonly dialogRef = inject(MatDialogRef<GeststockMatchCategoriesDialogComponent>);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly matchError = signal<string | null>(null);
  readonly matching = signal(false);

  readonly geststockList = signal<GeststockCategory[]>([]);
  readonly localList = signal<GeststockCategory[]>([]);
  readonly selectedGeststock = signal<GeststockCategory | null>(null);
  readonly selectedLocal = signal<GeststockCategory | null>(null);

  readonly canMatch = computed(
    () => this.selectedGeststock() !== null && this.selectedLocal() !== null,
  );

  ngOnInit(): void {
    this.loadUnmatched();
  }

  selectGeststock(cat: GeststockCategory): void {
    this.selectedGeststock.set(this.selectedGeststock()?.id === cat.id ? null : cat);
  }

  selectLocal(cat: GeststockCategory): void {
    this.selectedLocal.set(this.selectedLocal()?.id === cat.id ? null : cat);
  }

  match(): void {
    const gs = this.selectedGeststock();
    const local = this.selectedLocal();
    if (!gs || !local || this.matching()) return;

    this.matching.set(true);
    this.matchError.set(null);
    this.sync.matchCategory(gs.id, local.id).subscribe({
      next: () => {
        this.matching.set(false);
        this.selectedGeststock.set(null);
        this.selectedLocal.set(null);
        this.loadUnmatched();
      },
      error: () => {
        this.matching.set(false);
        this.matchError.set('Le rapprochement a echoue. Reessayez.');
      },
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  private loadUnmatched(): void {
    this.loading.set(true);
    this.error.set(null);
    this.sync.getUnmatched().subscribe({
      next: (data) => {
        this.geststockList.set(data.geststockCategories);
        this.localList.set(data.localCategories);
        this.loading.set(false);
        if (data.geststockCategories.length === 0 && data.localCategories.length === 0) {
          this.dialogRef.close();
        }
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Impossible de charger les categories. Reessayez.');
      },
    });
  }
}
