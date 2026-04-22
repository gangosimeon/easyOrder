export type AnnonceType = 'promo' | 'info' | 'alerte' | 'evenement';

export interface Annonce {
  id: string;
  titre: string;
  message: string;
  type: AnnonceType;
  emoji: string;
  dateDebut: Date;
  dateFin?: Date;
  active: boolean;
  epinglee: boolean;
  createdAt: Date;
}

export const ANNONCE_TYPE_CONFIG: Record<AnnonceType, { label: string; color: string; bgColor: string; icon: string }> = {
  promo:     { label: 'Promotion',  color: '#E8521A', bgColor: '#FFF3EE', icon: 'local_offer' },
  info:      { label: 'Info',       color: '#1E88E5', bgColor: '#EEF4FF', icon: 'info' },
  alerte:    { label: 'Alerte',     color: '#F9A825', bgColor: '#FFFBEE', icon: 'warning' },
  evenement: { label: 'Événement',  color: '#43A047', bgColor: '#EEFBEE', icon: 'event' },
};

export const ANNONCE_EMOJIS = [
  '📢','📣','🎉','🛍️','💥','🔥','⭐','🏷️',
  '🎁','💰','📦','🌟','✨','🎊','💡','📅',
  '⚡','🆕','🆓','🏪','🇧🇫','🌍','💳','🎯',
];
