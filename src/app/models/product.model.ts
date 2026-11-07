export interface Product {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  originalPrice?: number;
  promotion?: number;
  image: string;
  description?: string;
  unit?: string;
  stock?: number;
  createdAt: Date;
  inStock: boolean;
  /** Prix de référence reçu de GestStock (JA2). */
  externalPrice?: number;
  /** Identification de la source externe (JA2). */
  external?: {
    source: 'geststock';
    id: string;
    version: number;
  };
}

export const PRODUCT_UNITS = [
  'pièce','kg','g','litre','cl','sachet','boîte','paquet','lot','douzaine','complet','mètre',
];

export const PRODUCT_EMOJIS = [
  '🛍️','🥘','🌾','🥩','🐟','🥦','🍅','🧅','🧄','🌽',
  '🥐','🍞','🧃','💧','🥤','☕','🍵','🫙','🧴','💊',
  '📱','💡','🔌','🔧','🏠','👔','👗','🧵','🎒','🌱',
  '🐄','🐐','🐓','🥚','🧀','🫒','🍯','🌿','🪴','⚡',
];
