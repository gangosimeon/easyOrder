import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { environment } from '../../../../environments/environment';
import { GeststockMatchCategoriesDialogComponent } from './geststock-match-categories-dialog.component';

const BASE = `${environment.apiUrl}/integrations/geststock`;

/** Dialogue de rapprochement des categories GestStock/locales (lot 3, JA2). */
describe('GeststockMatchCategoriesDialogComponent', () => {
  let http: HttpTestingController;
  let fixture: ComponentFixture<GeststockMatchCategoriesDialogComponent>;
  let closed: unknown[];

  function create(): void {
    closed = [];
    TestBed.configureTestingModule({
      imports: [GeststockMatchCategoriesDialogComponent],
      providers: [
        provideHttpClient(withXhr()),
        provideHttpClientTesting(),
        provideNoopAnimations(),
        { provide: MatDialogRef, useValue: { close: (v: unknown) => closed.push(v) } },
      ],
    });
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(GeststockMatchCategoriesDialogComponent);
    fixture.detectChanges();
  }

  async function settle(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  function el(): HTMLElement {
    return fixture.nativeElement as HTMLElement;
  }

  function text(): string {
    return el().textContent ?? '';
  }

  afterEach(() => {
    http.verify();
  });

  it('affiche l\'indicateur de chargement au demarrage', () => {
    create();
    expect(text()).toContain('Chargement');
    http.expectOne(`${BASE}/unmatched`).flush({
      geststockCategories: [],
      localCategories: [],
    });
  });

  it('affiche les deux listes de categories', async () => {
    create();
    http.expectOne(`${BASE}/unmatched`).flush({
      geststockCategories: [{ id: 'g1', name: 'Alimentaire GS' }],
      localCategories: [{ id: 'l1', name: 'Nourriture Locale' }],
    });
    await settle();
    expect(text()).toContain('Alimentaire GS');
    expect(text()).toContain('Nourriture Locale');
  });

  it('bouton Rapprocher desactive sans selection', async () => {
    create();
    http.expectOne(`${BASE}/unmatched`).flush({
      geststockCategories: [{ id: 'g1', name: 'Boissons GS' }],
      localCategories: [{ id: 'l1', name: 'Boissons' }],
    });
    await settle();
    const matchBtn = el().querySelector<HTMLButtonElement>('button[disabled]');
    expect(matchBtn).toBeTruthy();
  });

  it('selection puis appel POST match-category', async () => {
    create();
    http.expectOne(`${BASE}/unmatched`).flush({
      geststockCategories: [{ id: 'g1', name: 'Boissons GS' }],
      localCategories: [{ id: 'l1', name: 'Boissons' }],
    });
    await settle();

    // Selectionner une categorie GestStock
    const gsButtons = el().querySelectorAll<HTMLButtonElement>('.cat-item');
    gsButtons[0].click();
    await settle();

    // Selectionner une categorie locale
    gsButtons[1].click();
    await settle();

    // Cliquer sur Rapprocher
    const matchBtn = Array.from(el().querySelectorAll<HTMLButtonElement>('button'))
      .find(b => b.textContent?.includes('Rapprocher') && !b.disabled);
    expect(matchBtn).toBeTruthy();
    matchBtn!.click();
    await settle();

    const req = http.expectOne(`${BASE}/match-category`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ geststockCategoryId: 'g1', localCategoryId: 'l1' });

    // Apres succes, recharge la liste
    req.flush(null);
    await settle();
    http.expectOne(`${BASE}/unmatched`).flush({
      geststockCategories: [],
      localCategories: [],
    });
    await settle();
    // Ferme le dialogue quand les deux listes sont vides
    expect(closed.length).toBe(1);
  });

  it('affiche un message d\'erreur si le chargement initial echoue', async () => {
    create();
    http.expectOne(`${BASE}/unmatched`).flush(null, { status: 500, statusText: 'Server Error' });
    await settle();
    expect(text()).toContain('Impossible de charger');
  });

  it('affiche une erreur si le rapprochement echoue', async () => {
    create();
    http.expectOne(`${BASE}/unmatched`).flush({
      geststockCategories: [{ id: 'g1', name: 'Cat GS' }],
      localCategories: [{ id: 'l1', name: 'Cat Locale' }],
    });
    await settle();

    const catBtns = el().querySelectorAll<HTMLButtonElement>('.cat-item');
    catBtns[0].click();
    await settle();
    catBtns[1].click();
    await settle();

    const matchBtn = Array.from(el().querySelectorAll<HTMLButtonElement>('button'))
      .find(b => b.textContent?.includes('Rapprocher') && !b.disabled);
    matchBtn!.click();
    await settle();

    http.expectOne(`${BASE}/match-category`).flush(null, { status: 500, statusText: 'Error' });
    await settle();
    expect(text()).toContain('echoue');
  });
});
