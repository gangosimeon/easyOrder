import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ConfirmDialogComponent, ConfirmDialogData } from './confirm-dialog.component';

/** Dialogue de confirmation générique : texte affiché, fermeture sur vrai (confirmer) ou faux (annuler). */
describe('ConfirmDialogComponent', () => {
  function open(data: ConfirmDialogData) {
    const closed: unknown[] = [];
    TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: MatDialogRef, useValue: { close: (value: unknown) => closed.push(value) } },
      ],
    });
    const fixture = TestBed.createComponent(ConfirmDialogComponent);
    fixture.detectChanges();
    return { element: fixture.nativeElement as HTMLElement, closed };
  }

  it('affiche le titre, le message et le libellé de confirmation, comme du texte', () => {
    const { element } = open({ title: 'Supprimer <b>le produit</b> ?', message: 'Action définitive.', confirmLabel: 'Supprimer' });
    expect(element.querySelector('.dialog-title')?.textContent).toBe('Supprimer <b>le produit</b> ?');
    expect(element.querySelector('b')).toBeNull();
    expect(element.querySelector('.dialog-message')?.textContent).toBe('Action définitive.');
    expect(element.querySelector('.btn-confirm')?.textContent).toContain('Supprimer');
  });

  it('confirmer ferme sur vrai, annuler sur faux', () => {
    const { element, closed } = open({ title: 'Titre', message: 'Message' });
    (element.querySelector('.btn-confirm') as HTMLButtonElement).click();
    (element.querySelector('.btn-cancel') as HTMLButtonElement).click();
    expect(closed).toEqual([true, false]);
  });
});
