import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-features-section',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './features-section.component.html',
  styleUrl: './features-section.component.scss'
})
export class FeaturesSectionComponent {
  readonly features: Feature[] = [
    { icon: 'inventory_2',    title: 'Gestion des produits',  description: 'Ajoutez, organisez et gérez vos produits facilement avec photos et prix.' },
    { icon: 'link',            title: 'Lien partageable',      description: 'Un lien unique pour votre boutique à partager partout sur les réseaux sociaux.' },
    // { icon: 'receipt_long',    title: 'Commandes clients',     description: 'Toutes vos commandes centralisées et accessibles depuis votre tableau de bord.' },
    { icon: 'public',          title: 'Boutique publique',     description: 'Votre boutique accessible à tout moment, sur tous les appareils.' },
    { icon: 'smartphone',      title: 'Responsive mobile',     description: 'Interface parfaite sur tous les écrans — téléphone, tablette ou ordinateur.' },
    { icon: 'bar_chart',       title: 'Statistiques',          description: 'Suivez les visites, les sources de trafic et les performances de votre boutique.' },
    // { icon: 'payments',        title: 'Paiement mobile',       description: 'Intégration Mobile Money (Orange Money, Moov) en cours de déploiement.' },
    { icon: 'chat',            title: 'WhatsApp intégré',      description: 'Vos clients passent commande directement via WhatsApp en un seul clic.' },
  ];
}
