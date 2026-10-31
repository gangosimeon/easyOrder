import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting, TestRequest } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { BROWSER_NAVIGATE, GeststockLink } from '../../../core/services/geststock-link.service';
import { GeststockLinkSectionComponent } from './geststock-link-section.component';

const API = `${environment.apiUrl}/integrations/geststock`;
const AUTHORIZE = `${environment.geststockOrigin}/integrations/jecreemaboutique/authorize?client_id=jcmb&request_uri=urn%3Aietf%3Aparams%3Aoauth%3Arequest_uri%3AZx9`;

function link(overrides: Partial<GeststockLink> = {}): GeststockLink {
  return {
    status: 'ACTIVE',
    companyCode: 'optique-principale',
    companyName: 'Optique Principale',
    suspensionReason: null,
    revocationReason: null,
    linkedAt: '2026-10-30T10:00:00.000Z',
    lastStateSyncAt: '2026-10-30T10:00:00.000Z',
    revokedAt: null,
    ...overrides,
  };
}

/** Section « GestStock » de l'espace de la boutique (lot 2, JA1). */
describe('GeststockLinkSectionComponent', () => {
  let http: HttpTestingController;
  let fixture: ComponentFixture<GeststockLinkSectionComponent>;
  let navigations: string[];
  let dialogResult: unknown;
  let dialogs: number;

  function session(role: 'user' | 'admin' = 'user'): void {
    localStorage.clear();
    localStorage.setItem('bs_token', 'jeton-de-test');
    localStorage.setItem('bs_auth', JSON.stringify({ id: 'u1', name: 'Boutique Awa', slug: 'awa', role }));
  }

  function create(historyState: unknown = null): void {
    navigations = [];
    dialogs = 0;
    dialogResult = undefined;
    window.history.replaceState(historyState, '');
    TestBed.configureTestingModule({
      imports: [GeststockLinkSectionComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideNoopAnimations(),
        { provide: BROWSER_NAVIGATE, useValue: (url: string) => void navigations.push(url) },
      ],
    });
    TestBed.overrideProvider(MatDialog, {
      useValue: {
        open: () => {
          dialogs += 1;
          return { afterClosed: () => of(dialogResult) };
        },
      },
    });
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(GeststockLinkSectionComponent);
    fixture.detectChanges();
  }

  async function settle(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  async function serve(state: object): Promise<void> {
    http.expectOne(`${API}/link`).flush(state);
    await settle();
  }

  function fail(request: TestRequest, status: number, code: string, headers: Record<string, string> = {}): void {
    request.flush({ success: false, message: 'message du serveur', code }, { status, statusText: 'Erreur', headers });
  }

  function text(): string {
    return (fixture.nativeElement as HTMLElement).textContent ?? '';
  }

  function button(name: string): HTMLButtonElement {
    const found = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>(`[data-test="${name}"]`);
    if (!found) throw new Error(`bouton ${name} absent`);
    return found;
  }

  afterEach(() => {
    http.verify();
    window.history.replaceState(null, '');
  });

  // --- Accès et masquage --------------------------------------------------------------------------------

  it('administrateur : section absente, aucun appel', () => {
    session('admin');
    create();
    http.expectNone(`${API}/link`);
    expect(text().trim()).toBe('');
  });

  it('intégration désactivée (404 INTEGRATION_DISABLED) : section masquée, sans message d’erreur', async () => {
    session();
    create();
    fail(http.expectOne(`${API}/link`), 404, 'INTEGRATION_DISABLED');
    await settle();
    expect(text().trim()).toBe('');
  });

  // --- États ---------------------------------------------------------------------------------------------

  it('non liée : bouton « Connecter à GestStock »', async () => {
    session();
    create();
    await serve({ link: null, refreshed: false, stale: false });
    expect(button('connect').textContent).toContain('Connecter à GestStock');
  });

  it('active : nom de l’entreprise, date de liaison ; code si le nom est absent', async () => {
    session();
    create();
    await serve({ link: link(), refreshed: true, stale: false });
    expect(text()).toContain('Optique Principale');
    expect(text()).toContain('Active');
    expect(text()).toContain('30/10/2026');
    expect(text()).not.toContain('non actualisé');

    TestBed.resetTestingModule();
    session();
    create();
    await serve({ link: link({ companyName: null }), refreshed: false, stale: false });
    expect(text()).toContain('optique-principale');
  });

  it('suspendue : motif traduit si connu, brut sinon', async () => {
    session();
    create();
    await serve({ link: link({ status: 'SUSPENDED', suspensionReason: 'AUTHORIZER_LOST_ACCESS' }), refreshed: true, stale: false });
    expect(text()).toContain('Suspendue');
    expect(text()).toContain('n’a plus les droits');

    TestBed.resetTestingModule();
    session();
    create();
    await serve({ link: link({ status: 'SUSPENDED', suspensionReason: 'MOTIF_FUTUR' }), refreshed: true, stale: false });
    expect(text()).toContain('MOTIF_FUTUR');
  });

  it('état non actualisé (stale) : signalé discrètement', async () => {
    session();
    create();
    await serve({ link: link(), refreshed: false, stale: true });
    expect((fixture.nativeElement as HTMLElement).querySelector('[data-test="stale"]')?.textContent).toContain('non actualisé');
  });

  it('nom d’entreprise contenant du HTML : affiché comme du texte', async () => {
    session();
    create();
    await serve({ link: link({ companyName: '<img src=x onerror="alert(1)"><b>Optique</b>' }), refreshed: true, stale: false });
    expect((fixture.nativeElement as HTMLElement).querySelector('img')).toBeNull();
    expect(text()).toContain('<b>Optique</b>');
  });

  it('message de réussite après le retour de GestStock', async () => {
    session();
    create({ geststock: 'linked' });
    await serve({ link: link(), refreshed: false, stale: false });
    expect(text()).toContain('Votre boutique est liée à GestStock');
  });

  // --- Démarrer ------------------------------------------------------------------------------------------

  it('démarrer : POST start, bouton inactif pendant l’appel, navigation vers l’URL de GestStock', async () => {
    session();
    create();
    await serve({ link: null, refreshed: false, stale: false });
    button('connect').click();
    await settle();
    expect(button('connect').disabled).toBe(true);
    button('connect').click();
    const request = http.expectOne(`${API}/start`);
    expect(request.request.method).toBe('POST');
    request.flush({ authorizationUrl: AUTHORIZE });
    await settle();
    expect(navigations).toEqual([AUTHORIZE]);
  });

  it('démarrer : URL d’une autre origine → aucune navigation, message d’erreur', async () => {
    session();
    create();
    await serve({ link: null, refreshed: false, stale: false });
    button('connect').click();
    http.expectOne(`${API}/start`).flush({ authorizationUrl: 'https://evil.example/integrations/jecreemaboutique/authorize' });
    await settle();
    expect(navigations).toEqual([]);
    expect(text()).toContain('adresse');
    expect(button('connect').disabled).toBe(false);
  });

  it.each([
    [409, 'ALREADY_LINKED', {}, 'déjà liée'],
    [429, 'GESTSTOCK_RATE_LIMITED', { 'Retry-After': '120' }, '2 min'],
    [503, 'GESTSTOCK_UNAVAILABLE', {}, 'réessayez plus tard'],
  ])('démarrer refusé (%s %s) : message, aucune navigation', async (status, code, headers, expected) => {
    session();
    create();
    await serve({ link: null, refreshed: false, stale: false });
    button('connect').click();
    fail(http.expectOne(`${API}/start`), status, code, headers);
    await settle();
    expect(text()).toContain(expected);
    expect(navigations).toEqual([]);
  });

  // --- Révoquer ------------------------------------------------------------------------------------------

  it('révoquer : rien sans confirmation ; puis POST avec le motif, et la boutique redevient non liée', async () => {
    session();
    create();
    await serve({ link: link(), refreshed: true, stale: false });
    dialogResult = undefined;
    button('revoke').click();
    await settle();
    expect(dialogs).toBe(1);
    http.expectNone(`${API}/revoke`);

    dialogResult = { reason: 'Fermeture' };
    button('revoke').click();
    await settle();
    const request = http.expectOne(`${API}/revoke`);
    expect(request.request.body).toEqual({ reason: 'Fermeture' });
    request.flush({ link: link({ status: 'REVOKED', revocationReason: 'SHOP_REQUEST' }), revoked: true });
    await settle();
    expect(text()).toContain('La liaison avec GestStock est révoquée');
    expect(button('connect')).toBeTruthy();
  });

  it('révoquer sans motif : corps vide', async () => {
    session();
    create();
    await serve({ link: link(), refreshed: true, stale: false });
    dialogResult = {};
    button('revoke').click();
    await settle();
    const request = http.expectOne(`${API}/revoke`);
    expect(request.request.body).toEqual({});
    request.flush({ link: null, revoked: false });
    await settle();
  });

  it('révoquer : GestStock indisponible → « réessayez plus tard », l’état reste lié', async () => {
    session();
    create();
    await serve({ link: link(), refreshed: true, stale: false });
    dialogResult = {};
    button('revoke').click();
    await settle();
    fail(http.expectOne(`${API}/revoke`), 503, 'GESTSTOCK_UNAVAILABLE');
    await settle();
    expect(text()).toContain('réessayez plus tard');
    expect(text()).toContain('Optique Principale');
    expect(button('revoke').disabled).toBe(false);
  });
});
