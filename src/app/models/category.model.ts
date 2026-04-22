export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  description?: string;
  createdAt: Date;
}

export const CATEGORY_ICONS = [
  { label: 'Alimentation', value: 'lunch_dining' },
  { label: 'Boissons',     value: 'local_drink' },
  { label: 'Vêtements',   value: 'checkroom' },
  { label: 'Électronique', value: 'devices' },
  { label: 'Beauté',      value: 'face' },
  { label: 'Maison',      value: 'home' },
  { label: 'Outils',      value: 'build' },
  { label: 'Santé',       value: 'local_pharmacy' },
  { label: 'Agriculture', value: 'grass' },
  { label: 'Animaux',     value: 'pets' },
  { label: 'Sport',       value: 'sports_soccer' },
  { label: 'École',       value: 'school' },
  { label: 'Moto',        value: 'two_wheeler' },
  { label: 'Téléphone',   value: 'phone_android' },
  { label: 'Légumes',     value: 'eco' },
  { label: 'Viande',      value: 'set_meal' },
];

export const CATEGORY_COLORS = [
  '#FF6B35','#F7931E','#FFD23F','#3BB273',
  '#1E88E5','#8E24AA','#E91E63','#00ACC1',
  '#43A047','#FB8C00','#6D4C41','#546E7A',
];
