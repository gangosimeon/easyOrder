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
}

export const PRODUCT_UNITS = [
  'pièce','kg','g','litre','cl','sachet','boîte','paquet','lot','douzaine','complet',
];

export const PRODUCT_EMOJIS = [
  '🛍️','🥘','🌾','🥩','🐟','🥦','🍅','🧅','🧄','🌽',
  '🥐','🍞','🧃','💧','🥤','☕','🍵','🫙','🧴','💊',
  '📱','💡','🔌','🔧','🏠','👔','👗','🧵','🎒','🌱',
  '🐄','🐐','🐓','🥚','🧀','🫒','🍯','🌿','🪴','⚡',
];
