import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { environment } from '../../../../environments/environment';
import { GeststockCallbackComponent } from './geststock-callback.component';

@Component({ template: 'page' })
class PageComponent {}

const API = `${environment.apiUrl}/integrations/geststock`;
const PATH = '/integrations/geststock/callback';
const CODE = 'Code-Secret-De-Test_0123456789abcdef';
const STATE = 'State-Secret-De-Test_0123456789abcdefghijklmn';
const ISS = 'geststock-integration';

/** Page de retour de l'écran d'autorisation GestStock (lot 2, JA1 ; v14-D1 étape 4). */
describe('GeststockCallbackComponent', () => {
  let http: HttpTestingController;
  let consoleCalls: unknown[][];
  /** URL du navigateur au moment de chaque requête HTTP. */
  let urlsAtRequest: string[];

  function session(role: 'user' | 'admin' | null = 'user'): void {
    localStorage.clear();
    if (role) {
      localStorage.setItem('bs_token', 'jeton-de-test');
      localStorage.setItem('bs_auth', JSON.stringify({ id: 'u1', name: 'Boutique Awa', slug: 'awa', role }));
    }
  }

  function configure(extraProviders: unknown[] = []): void {
    consoleCalls = [];
    urlsAtRequest = [];
    for (const method of ['log', 'info', 'warn', 'error', 'debug'] as const) {
      vi.spyOn(console, method).mockImplementation((...args: unknown[]) => void consoleCalls.push(args));
    }
    const record: HttpInterceptorFn = (req, next) => {
      urlsAtRequest.push(TestBed.inject(Location).path());
      return next(req);
    };
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([record])),
        provideHttpClientTesting(),
        provideRouter([
          { path: 'integrations/geststock/callback', component: GeststockCallbackComponent },
          { path: 'profile', component: PageComponent },
          { path: 'login', component: PageComponent },
        ]),
        ...(extraProviders as never[]),
      ],
    });
    http = TestBed.inject(HttpTestingController);
  }

  async function open(query: string): Promise<RouterTestingHarness> {
    configure();
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(`${PATH}${query}`);
    harness.detectChanges();
    await harness.fixture.whenStable();
    harness.detectChanges();
    return harness;
  }

  async function settle(harness: RouterTestingHarness): Promise<void> {
    harness.detectChanges();
    await harness.fixture.whenStable();
    harness.detectChanges();
  }

  const query = `?code=${CODE}&state=${STATE}&iss=${ISS}`;

  afterEach(() => {
    http.verify();
    // Aucune valeur de code ni de state dans la console.
    const logs = consoleCalls.map((args) => args.map(String).join(' ')).join('\n');
    expect(logs).not.toContain(CODE);
    expect(logs).not.toContain(STATE);
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('paramètres retirés de l’URL avant l’appel, puis un seul POST complete avec code, state et iss', async () => {
    session();
    const harness = await open(query);
    const request = http.expectOne(`${API}/complete`);
    expect(urlsAtRequest).toEqual([PATH]);
    expect(TestBed.inject(Location).path()).toBe(PATH);
    expect(TestBed.inject(Router).url).toBe(PATH);
    expect(request.request.body).toEqual({ code: CODE, state: STATE, iss: ISS });
    // Aucun Referer vers un autre site pendant la page.
    expect(document.head.querySelector('meta[name="referrer"]')?.getAttribute('content')).toBe('no-referrer');
    request.flush({ link: null });
    await settle(harness);
    // Page quittée (retour vers le profil) : méta retirée.
    expect(document.head.querySelector('meta[name="referrer"]')).toBeNull();
  });

  it('succès : retour vers l’écran de liaison avec le message de réussite', async () => {
    session();
    const harness = await open(query);
    http.expectOne(`${API}/complete`).flush({ link: { status: 'ACTIVE' } });
    await settle(harness);
    const location = TestBed.inject(Location);
    expect(location.path(true)).toBe('/profile#geststock');
    expect((location.getState() as { geststock?: string })?.geststock).toBe('linked');
  });

  it('double initialisation : un seul appel', async () => {
    session();
    configure([
      {
        provide: ActivatedRoute,
        useValue: { snapshot: { queryParamMap: convertToParamMap({ code: CODE, state: STATE, iss: ISS }) } },
      },
    ]);
    const first = TestBed.createComponent(GeststockCallbackComponent);
    first.detectChanges();
    const second = TestBed.createComponent(GeststockCallbackComponent);
    second.detectChanges();
    http.expectOne(`${API}/complete`).flush({ link: null });
    await first.whenStable();
  });

  it.each([
    ['?error=access_denied&state=' + STATE + '&iss=' + ISS, 'refusé'],
    ['?error=server_error&state=' + STATE, 'n’a pas abouti'],
  ])('error renvoyé par GestStock (%s) : message, aucun appel', async (q, expected) => {
    session();
    const harness = await open(q);
    http.expectNone(`${API}/complete`);
    expect(TestBed.inject(Location).path()).toBe(PATH);
    expect(harness.routeNativeElement?.textContent).toContain(expected);
    expect(harness.routeNativeElement?.querySelector('a[href="/profile#geststock"]')).not.toBeNull();
  });

  it.each([
    [`?code=${CODE}&state=${STATE}`],
    [`?code=${CODE}&iss=${ISS}`],
    [`?code=a%20b&state=${STATE}&iss=${ISS}`],
    [`?code=${CODE}&state=court&iss=${ISS}`],
  ])('paramètres incomplets ou mal formés (%s) : message, aucun appel', async (q) => {
    session();
    const harness = await open(q);
    http.expectNone(`${API}/complete`);
    expect(TestBed.inject(Location).path()).toBe(PATH);
    expect(harness.routeNativeElement?.textContent).toContain('incomplet');
  });

  it('aucun paramètre (rechargement après succès) : retour vers l’écran, aucun appel', async () => {
    session();
    await open('');
    http.expectNone(`${API}/complete`);
    expect(TestBed.inject(Location).path(true)).toBe('/profile#geststock');
  });

  it('non connecté : message et lien vers la connexion, sans le code dans une URL de retour', async () => {
    session(null);
    const harness = await open(query);
    http.expectNone(`${API}/complete`);
    const element = harness.routeNativeElement as HTMLElement;
    expect(element.textContent).toContain('reconnectez-vous');
    const login = element.querySelector<HTMLAnchorElement>('a[href^="/login"]');
    expect(login).not.toBeNull();
    expect(login!.getAttribute('href')).toBe('/login');
    expect(TestBed.inject(Location).path()).toBe(PATH);
  });

  it('administrateur : message, aucun appel', async () => {
    session('admin');
    const harness = await open(query);
    http.expectNone(`${API}/complete`);
    expect(harness.routeNativeElement?.textContent).toContain('boutiques');
  });

  it.each([
    [400, 'AUTHORIZATION_REQUEST_INVALID', 'expirée ou déjà utilisée'],
    [409, 'ALREADY_LINKED', 'déjà liée'],
    [400, 'INVALID_ISSUER', 'recommencez'],
    [500, 'LINK_SAVE_FAILED', 'enregistrée'],
    [503, 'GESTSTOCK_UNAVAILABLE', 'réessayez plus tard'],
  ])('échec (%s %s) : message et lien pour recommencer', async (status, code, expected) => {
    session();
    const harness = await open(query);
    http.expectOne(`${API}/complete`).flush({ success: false, message: 'message du serveur', code }, { status, statusText: 'Erreur' });
    await settle(harness);
    const element = harness.routeNativeElement as HTMLElement;
    expect(element.textContent).toContain(expected);
    expect(element.textContent).not.toContain('message du serveur');
    expect(element.querySelector('a[href="/profile#geststock"]')).not.toBeNull();
    expect(TestBed.inject(Location).path()).toBe(PATH);
  });
});
