import { TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { GeststockRevokeDialogComponent } from './geststock-revoke-dialog.component';

/** Dialogue de révocation : motif facultatif, mêmes règles que le backend (J4). */
describe('GeststockRevokeDialogComponent', () => {
  function open() {
    const closed: unknown[] = [];
    TestBed.configureTestingModule({
      imports: [GeststockRevokeDialogComponent],
      providers: [provideNoopAnimations(), { provide: MatDialogRef, useValue: { close: (v: unknown) => closed.push(v) } }],
    });
    const fixture = TestBed.createComponent(GeststockRevokeDialogComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const textarea = element.querySelector<HTMLTextAreaElement>('textarea')!;
    const confirm = element.querySelector<HTMLButtonElement>('[data-test="confirm"]')!;
    const type = async (value: string) => {
      textarea.value = value;
      textarea.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
    };
    return { element, confirm, type, closed };
  }

  it('explique la conséquence ; sans motif, confirmation possible et corps vide', async () => {
    const { element, confirm, closed } = open();
    expect(element.textContent).toContain('nouvelle liaison');
    expect(confirm.disabled).toBe(false);
    confirm.click();
    expect(closed).toEqual([{}]);
  });

  it('motif renvoyé sans espaces de début et de fin', async () => {
    const { confirm, type, closed } = open();
    await type('  Fermeture de la boutique  ');
    confirm.click();
    expect(closed).toEqual([{ reason: 'Fermeture de la boutique' }]);
  });

  it.each([
    ['trop long', 'x'.repeat(501), '500'],
    ['caractère de contrôle', 'Fermeture\u0007', 'caractère'],
  ])('motif %s : message et confirmation impossible', async (_label, value, expected) => {
    const { element, confirm, type, closed } = open();
    await type(value);
    expect(element.textContent).toContain(expected);
    expect(confirm.disabled).toBe(true);
    confirm.click();
    expect(closed).toEqual([]);
  });
});
