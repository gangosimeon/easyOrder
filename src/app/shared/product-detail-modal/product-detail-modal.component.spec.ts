import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ProductDetailModalComponent } from './product-detail-modal.component';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';

const PRODUCT_A: Product = {
  id: 'p1', categoryId: 'cat1', name: 'Pagne tissé', price: 15000,
  image: '🧵', inStock: true, createdAt: new Date(),
};
const PRODUCT_B: Product = {
  id: 'p2', categoryId: 'cat1', name: 'Boubou brodé', price: 25000,
  image: '👘', inStock: true, createdAt: new Date(),
};
const PRODUCT_C: Product = {
  id: 'p3', categoryId: 'cat1', name: 'Foulard', price: 5000,
  image: '🧣', inStock: false, createdAt: new Date(),
};
const CATEGORY: Category = {
  id: 'cat1', name: 'Vêtements', icon: 'checkroom', color: '#8B5CF6', createdAt: new Date(),
};

function setup(opts: { relatedProducts?: Product[]; product?: Product | null } = {}) {
  const cartItems$ = { subscribe: (obs: { next: (v: unknown[]) => void }) => { obs.next([]); return { unsubscribe() {} }; } };
  const cartService = { items$: cartItems$, addProduct: () => {}, updateQuantity: () => {} };

  TestBed.configureTestingModule({
    imports: [ProductDetailModalComponent],
    providers: [{ provide: CartService, useValue: cartService }],
  });

  const fixture = TestBed.createComponent(ProductDetailModalComponent);
  const component = fixture.componentInstance;

  component.product = opts.product !== undefined ? opts.product : PRODUCT_A;
  component.category = CATEGORY;
  if (opts.relatedProducts !== undefined) component.relatedProducts = opts.relatedProducts;

  fixture.detectChanges();
  return { fixture, component, element: fixture.nativeElement as HTMLElement };
}

describe('ProductDetailModalComponent', () => {

  describe('Section "Vous aimerez aussi"', () => {
    it('est absente quand relatedProducts est vide', () => {
      const { element } = setup({ relatedProducts: [] });
      expect(element.querySelector('.pd-related')).toBeNull();
    });

    it('est absente par défaut (aucun relatedProducts passé)', () => {
      const { element } = setup();
      expect(element.querySelector('.pd-related')).toBeNull();
    });

    it('apparaît quand des produits similaires sont fournis', () => {
      const { element } = setup({ relatedProducts: [PRODUCT_B] });
      expect(element.querySelector('.pd-related')).not.toBeNull();
      expect(element.querySelector('.pd-related-title')?.textContent).toContain('Vous aimerez aussi');
    });

    it('affiche exactement autant de cartes que de produits similaires', () => {
      const { element } = setup({ relatedProducts: [PRODUCT_B, PRODUCT_C] });
      const cards = element.querySelectorAll('.pd-related-card');
      expect(cards.length).toBe(2);
    });

    it('affiche le nom et le prix de chaque produit similaire', () => {
      const { element } = setup({ relatedProducts: [PRODUCT_B] });
      const card = element.querySelector('.pd-related-card') as HTMLElement;
      expect(card.querySelector('.pd-related-name')?.textContent).toContain('Boubou brodé');
      expect(card.querySelector('.pd-related-price')?.textContent).toContain('FCFA');
    });

    it('affiche le badge "Épuisé" sur un produit hors stock', () => {
      const { element } = setup({ relatedProducts: [PRODUCT_C] });
      expect(element.querySelector('.pd-related-out-badge')?.textContent).toContain('Épuisé');
    });

    it('n\'affiche pas le badge "Épuisé" sur un produit en stock', () => {
      const { element } = setup({ relatedProducts: [PRODUCT_B] });
      expect(element.querySelector('.pd-related-out-badge')).toBeNull();
    });

    it('affiche le bouton "Voir plus" quand une catégorie est fournie', () => {
      const { element } = setup({ relatedProducts: [PRODUCT_B] });
      expect(element.querySelector('.pd-related-more')).not.toBeNull();
    });
  });

  describe('Événements des produits similaires', () => {
    it('émet productSelected avec le produit au clic sur une carte', () => {
      const { element, component } = setup({ relatedProducts: [PRODUCT_B] });
      const emitted: Product[] = [];
      component.productSelected.subscribe((p: Product) => emitted.push(p));
      (element.querySelector('.pd-related-card') as HTMLButtonElement).click();
      expect(emitted).toHaveLength(1);
      expect(emitted[0].id).toBe('p2');
    });

    it('émet viewCategory avec le categoryId au clic sur "Voir plus"', () => {
      const { element, component } = setup({ relatedProducts: [PRODUCT_B] });
      const emitted: string[] = [];
      component.viewCategory.subscribe((id: string) => emitted.push(id));
      (element.querySelector('.pd-related-more') as HTMLButtonElement).click();
      expect(emitted).toEqual(['cat1']);
    });
  });

  describe('Rendu du produit principal', () => {
    it('affiche le nom et le prix du produit', () => {
      const { element } = setup();
      expect(element.querySelector('.pd-name')?.textContent).toContain('Pagne tissé');
      expect(element.querySelector('.pd-price-main')?.textContent).toContain('FCFA');
    });

    it('affiche le badge "En stock" pour un produit disponible', () => {
      const { element } = setup();
      expect(element.querySelector('.pd-stock-dot')?.textContent).toContain('En stock');
    });

    it('affiche le badge "Épuisé" pour un produit indisponible', () => {
      const { element } = setup({ product: PRODUCT_C });
      expect(element.querySelector('.pd-stock-dot')?.textContent).toContain('Épuisé');
    });

    it('n\'affiche rien quand product est null', () => {
      const { element } = setup({ product: null });
      expect(element.querySelector('.pd-sheet')).toBeNull();
    });
  });

  describe('Footer — boutons d\'action toujours accessibles', () => {
    it('le footer est présent en dehors de pd-scroll-area', () => {
      const { element } = setup();
      const sheet = element.querySelector('.pd-sheet') as HTMLElement;
      const scrollArea = sheet.querySelector('.pd-scroll-area') as HTMLElement;
      const footer = sheet.querySelector('.pd-footer') as HTMLElement;
      // Le footer est un enfant direct du sheet, pas du scroll area
      expect(footer).not.toBeNull();
      expect(scrollArea.contains(footer)).toBe(false);
    });
  });
});
