import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { environment } from '../../../../environments/environment';
import { Product } from '../../../models/product.model';
import { Category } from '../../../models/category.model';
import { UploadService } from '../../../core/services/upload.service';
import { ProductFormComponent, ProductFormData } from './product-form.component';

const PRODUCTS_API = `${environment.apiUrl}/products`;

function category(): Category {
  return { id: 'cat1', name: 'Boissons', icon: 'local_drink', color: '#1E88E5', createdAt: new Date() };
}

function geststockProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'p1',
    categoryId: 'cat1',
    name: 'Eau minerale',
    price: 500,
    image: '',
    createdAt: new Date(),
    inStock: true,
    external: { source: 'geststock', id: 'gs-p1', version: 1 },
    ...overrides,
  };
}

/** Formulaire produit avec produit GestStock (lot 3, JA2). */
describe('ProductFormComponent — GestStock', () => {
  let http: HttpTestingController;
  let fixture: ComponentFixture<ProductFormComponent>;
  let closed: unknown[];

  function create(data: ProductFormData): void {
    closed = [];
    TestBed.configureTestingModule({
      imports: [ProductFormComponent],
      providers: [
        provideHttpClient(withXhr()),
        provideHttpClientTesting(),
        provideNoopAnimations(),
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: MatDialogRef, useValue: { close: (v: unknown) => closed.push(v) } },
        { provide: UploadService, useValue: { upload: () => { throw new Error('no upload'); } } },
      ],
    });
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ProductFormComponent);
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

  it('affiche le badge « Synchronise par GestStock » pour un produit GestStock', () => {
    create({ mode: 'edit', product: geststockProduct(), category: category() });
    expect(el().querySelector('[data-test="geststock-badge"]')).not.toBeNull();
    expect(text()).toContain('Synchronise par GestStock');
  });

  it('pas de badge GestStock pour un produit ordinaire', () => {
    create({
      mode: 'edit',
      product: { id: 'p2', categoryId: 'cat1', name: 'Lait', price: 300, image: '', createdAt: new Date(), inStock: true },
      category: category(),
    });
    expect(el().querySelector('[data-test="geststock-badge"]')).toBeNull();
  });

  it('champ nom desactive pour un produit GestStock', () => {
    create({ mode: 'edit', product: geststockProduct(), category: category() });
    const nameInput = el().querySelector<HTMLInputElement>('input[formcontrolname="name"], input[ng-reflect-name="name"]');
    // Le champ est desactive (FormControl.disable())
    const comp = fixture.componentInstance;
    expect(comp.form.get('name')?.disabled).toBe(true);
  });

  it('champ unite desactive pour un produit GestStock', () => {
    create({ mode: 'edit', product: geststockProduct({ unit: 'litre' }), category: category() });
    const comp = fixture.componentInstance;
    expect(comp.form.get('unit')?.disabled).toBe(true);
  });

  it('affiche l\'avis de prix GestStock si externalPrice != price', async () => {
    create({
      mode: 'edit',
      product: geststockProduct({ price: 500, externalPrice: 600 }),
      category: category(),
    });
    await settle();
    expect(el().querySelector('[data-test="price-suggestion"]')).not.toBeNull();
    expect(text()).toContain('Prix de reference GestStock');
    expect(text()).toContain('600');
  });

  it('pas d\'avis de prix si externalPrice == price', () => {
    create({
      mode: 'edit',
      product: geststockProduct({ price: 500, externalPrice: 500 }),
      category: category(),
    });
    expect(el().querySelector('[data-test="price-suggestion"]')).toBeNull();
  });

  it('bouton Appliquer appelle POST accept-external-price', async () => {
    create({
      mode: 'edit',
      product: geststockProduct({ price: 500, externalPrice: 600 }),
      category: category(),
    });
    await settle();

    const btn = el().querySelector<HTMLButtonElement>('[data-test="accept-price"]');
    expect(btn).not.toBeNull();
    btn!.click();
    await settle();

    const req = http.expectOne(`${PRODUCTS_API}/p1/accept-external-price`);
    expect(req.request.method).toBe('POST');
    req.flush({ ...geststockProduct(), price: 600, externalPrice: 600 });
    await settle();

    // Le prix doit etre mis a jour dans le formulaire
    expect(fixture.componentInstance.form.get('price')?.value).toBe(600);
  });
});
