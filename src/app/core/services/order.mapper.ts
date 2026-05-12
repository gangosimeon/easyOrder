import { CartItem } from './cart.service';

// ── Types stricts alignés avec Zod backend ─────────────────────────────────────

export interface OrderItemInput {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
  unit: string;
}

export interface CreateOrderInput {
  customerName: string;
  customerPhone: string;
  items: OrderItemInput[];
  total: number;
  note?: string;
  whatsappSent: boolean;
}

export interface OrderValidationError {
  field: string;
  message: string;
}

// ── Validation frontend légère ─────────────────────────────────────────────────

export function validateOrderItem(item: OrderItemInput): OrderValidationError | null {
  if (!item.productId?.trim()) return { field: 'productId', message: 'productId requis' };
  if (!item.productName?.trim()) return { field: 'productName', message: 'productName requis' };
  if (typeof item.price !== 'number' || item.price < 0) return { field: 'price', message: 'price doit être ≥ 0' };
  if (typeof item.quantity !== 'number' || item.quantity < 1) return { field: 'quantity', message: 'quantity doit être ≥ 1' };
  return null;
}

export function validateCreateOrderInput(input: CreateOrderInput): OrderValidationError[] {
  const errors: OrderValidationError[] = [];

  if (!input.customerName?.trim()) errors.push({ field: 'customerName', message: 'Nom requis' });
  if (!input.customerPhone?.trim()) errors.push({ field: 'customerPhone', message: 'Téléphone requis' });
  if (input.customerPhone.trim().replace(/\D/g, '').length < 8) {
    errors.push({ field: 'customerPhone', message: 'Numéro invalide (min 8 chiffres)' });
  }

  if (!Array.isArray(input.items) || input.items.length === 0) {
    errors.push({ field: 'items', message: 'Au moins un article requis' });
  } else {
    input.items.forEach((item, idx) => {
      const err = validateOrderItem(item);
      if (err) errors.push({ field: `items[${idx}].${err.field}`, message: err.message });
    });
  }

  if (typeof input.total !== 'number' || input.total < 0) {
    errors.push({ field: 'total', message: 'Total doit être ≥ 0' });
  }

  return errors;
}

// ── Mapping sécurisé CartItem → OrderItemInput ─────────────────────────────────

function mapCartItemToOrderItem(cartItem: CartItem): OrderItemInput {
  const { product, quantity } = cartItem;

  // Fallbacks pour produits incomplets
  return {
    productId: product.id ?? '',
    productName: product.name ?? 'Produit sans nom',
    price: typeof product.price === 'number' ? product.price : 0,
    quantity: typeof quantity === 'number' && quantity >= 1 ? quantity : 1,
    image: product.image ?? '',
    unit: product.unit ?? 'pièce',
  };
}

// ── Fonction principale : mapCartToCreateOrderInput ─────────────────────────────

export interface MapCartToOrderOptions {
  customerName: string;
  customerPhone: string;
  note?: string;
  whatsappSent: boolean;
}

export interface MapCartToOrderResult {
  success: boolean;
  payload?: CreateOrderInput;
  errors?: OrderValidationError[];
}

/**
 * Transforme le panier Angular en payload backend strictement compatible avec le schéma Zod.
 *
 * Recalcul sécurisé du total côté frontend pour éviter fraude.
 * Nettoyage des données (trim, fallbacks).
 */
export function mapCartToCreateOrderInput(
  cartItems: CartItem[],
  options: MapCartToOrderOptions,
): MapCartToOrderResult {
  // 1. Validation entrée
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return { success: false, errors: [{ field: 'items', message: 'Panier vide' }] };
  }

  if (!options.customerName?.trim() || !options.customerPhone?.trim()) {
    return {
      success: false,
      errors: [
        { field: 'customerName', message: 'Nom requis' },
        { field: 'customerPhone', message: 'Téléphone requis' },
      ],
    };
  }

  // 2. Mapping des items avec fallbacks
  const items = cartItems.map(mapCartItemToOrderItem);

  // 3. Recalcul sécurisé du total (anti-fraude)
  const total = items.reduce((sum, item) => {
    const lineTotal = item.price * item.quantity;
    return sum + (Number.isFinite(lineTotal) ? lineTotal : 0);
  }, 0);

  // 4. Construction payload avec nettoyage
  const payload: CreateOrderInput = {
    customerName: options.customerName.trim(),
    customerPhone: options.customerPhone.trim().replace(/[\s\-]/g, ''),
    items,
    total,
    note: options.note?.trim() || undefined,
    whatsappSent: options.whatsappSent,
  };

  // 5. Validation finale
  const errors = validateCreateOrderInput(payload);
  if (errors.length > 0) {
    return { success: false, errors };
  }

  return { success: true, payload };
}

// ── Exemple de payload final JSON ─────────────────────────────────────────────

/**
 * Exemple de sortie JSON valide pour le backend :
 *
 * ```json
 * {
 *   "customerName": "Aminata Traoré",
 *   "customerPhone": "22670938688",
 *   "items": [
 *     {
 *       "productId": "6a0074c6fedddbebd57b4c92",
 *       "productName": "Gombo sec",
 *       "price": 500,
 *       "quantity": 2,
 *       "image": "https://example.com/gombo.jpg",
 *       "unit": "pièce"
 *     },
 *     {
 *       "productId": "6a0074c6fedddbebd57b4c93",
 *       "productName": "Huile de palme 1L",
 *       "price": 1200,
 *       "quantity": 1,
 *       "image": "",
 *       "unit": "litre"
 *     }
 *   ],
 *   "total": 2200,
 *   "note": "Livraison avant midi",
 *   "whatsappSent": true
 * }
 * ```
 */
