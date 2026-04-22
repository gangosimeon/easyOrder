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
}

export const PRODUCT_UNITS = [
  'pièce','kg','g','litre','cl','sachet','boîte','paquet','lot','douzaine',
];

export const PRODUCT_EMOJIS = [
  '🛍️','🥘','🌾','🥩','🐟','🥦','🍅','🧅','🧄','🌽',
  '🥐','🍞','🧃','💧','🥤','☕','🍵','🫙','🧴','💊',
  '📱','💡','🔌','🔧','🏠','👔','👗','🧵','🎒','🌱',
  '🐄','🐐','🐓','🥚','🧀','🫒','🍯','🌿','🪴','⚡',
];
