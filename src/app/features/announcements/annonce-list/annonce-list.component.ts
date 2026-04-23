import { Component, inject, signal, computed } from '@angular/core';
import { MatDialog }          from '@angular/material/dialog';
import { MatIconModule }      from '@angular/material/icon';
import { MatButtonModule }    from '@angular/material/button';
import { MatRippleModule }    from '@angular/material/core';
import { MatSnackBar }        from '@angular/material/snack-bar';
import { MatTooltipModule }   from '@angular/material/tooltip';
import { MatDialogModule }    from '@angular/material/dialog';
import { MatSnackBarModule }  from '@angular/material/snack-bar';

import { Annonce, AnnonceType, ANNONCE_TYPE_CONFIG } from '../../../models/annonce.model';
import { AnnonceService }     from '../../../core/services/annonce.service';
import { AnnonceFormComponent, AnnonceFormData } from '../annonce-form/annonce-form.component';

type FilterTab = 'toutes' | 'actives' | 'epinglees' | AnnonceType;

@Component({
  selector: 'app-annonce-list',
  standalone: true,
  imports: [
    MatDialogModule, MatIconModule, MatButtonModule,
    MatRippleModule, MatSnackBarModule, MatTooltipModule,
  ],
  templateUrl: './annonce-list.component.html',
  styleUrls:  ['./annonce-list.component.scss'],
})
export class AnnonceListComponent {
  private annonceService = inject(AnnonceService);
  private dialog         = inject(MatDialog);
  private snackBar       = inject(MatSnackBar);

  readonly typeConfig = ANNONCE_TYPE_CONFIG;

  // ✅ Signals Angular 20
  readonly annonces      = this.annonceService.annonces;
  readonly countActives  = this.annonceService.countActives;
  readonly epinglees     = this.annonceService.epinglees;

  activeFilter = signal<FilterTab>('toutes');

  readonly filteredAnnonces = computed(() => {
    const f = this.activeFilter();
    const all = this.annonces();
    switch (f) {
      case 'toutes':    return all;
      case 'actives':   return all.filter(a => a.active && !this.annonceService.isExpired(a));
      case 'epinglees': return all.filter(a => a.epinglee);
      default:          return all.filter(a => a.type === f);
    }
  });

  readonly tabs = [
    { key: 'toutes'    as FilterTab, label: 'Toutes',    icon: 'list'       },
    { key: 'actives'   as FilterTab, label: 'Actives',   icon: 'visibility' },
    { key: 'epinglees' as FilterTab, label: 'Épinglées', icon: 'push_pin'   },
    { key: 'promo'     as FilterTab, label: 'Promo',     icon: 'local_offer'},
    { key: 'info'      as FilterTab, label: 'Info',      icon: 'info'       },
    { key: 'alerte'    as FilterTab, label: 'Alerte',    icon: 'warning'    },
    { key: 'evenement' as FilterTab, label: 'Événements',icon: 'event'      },
  ];

  setFilter(f: FilterTab): void { this.activeFilter.set(f); }

  isExpired(a: Annonce): boolean { return this.annonceService.isExpired(a); }
  formatDate(d: Date): string    { return this.annonceService.formatDate(d); }

  openAddDialog(): void {
    this.dialog.open(AnnonceFormComponent, {
      width: '560px', maxWidth: '95vw',
      data: { mode: 'add' } satisfies AnnonceFormData,
    }).afterClosed().subscribe(result => {
      if (result) { this.annonceService.add(result); this.snack('📢 Annonce publiée !'); }
    });
  }

  openEditDialog(annonce: Annonce, e: MouseEvent): void {
    e.stopPropagation();
    this.dialog.open(AnnonceFormComponent, {
      width: '560px', maxWidth: '95vw',
      data: { mode: 'edit', annonce } satisfies AnnonceFormData,
    }).afterClosed().subscribe(result => {
      if (result) { this.annonceService.update(annonce.id, result); this.snack('✅ Annonce modifiée !'); }
    });
  }

  toggleActive(annonce: Annonce, e: MouseEvent): void {
    e.stopPropagation();
    this.annonceService.toggleActive(annonce.id);
    this.snack(annonce.active ? '🔕 Annonce désactivée' : '✅ Annonce activée');
  }

  toggleEpinglee(annonce: Annonce, e: MouseEvent): void {
    e.stopPropagation();
    this.annonceService.toggleEpinglee(annonce.id);
    this.snack(annonce.epinglee ? '📌 Désépinglée' : '📌 Épinglée !');
  }

  deleteAnnonce(annonce: Annonce, e: MouseEvent): void {
    e.stopPropagation();
    if (confirm(`Supprimer l'annonce "${annonce.titre}" ?`)) {
      this.annonceService.delete(annonce.id);
      this.snack('🗑️ Annonce supprimée');
    }
  }

  private snack(msg: string): void {
    this.snackBar.open(msg, 'OK', { duration: 3000, horizontalPosition: 'center', verticalPosition: 'bottom' });
  }
}
