import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  popular: boolean;
  features: string[];
  cta: string;
  link: string;
}

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.scss'
})
export class PricingComponent {
  readonly plans: Plan[] = [
    {
      name: 'Gratuit',
      price: '0',
      period: 'FCFA/mois',
      description: 'Parfait pour démarrer et tester JeCreeMaBoutique.',
      popular: false,
      features: [
        '10 produits maximum',
        'Lien partageable',
        'Boutique publique',
        'Support communautaire',
      ],
      cta: 'Commencer gratuitement',
      link: '/register'
    },
    {
      name: 'Pro',
      price: '5 000',
      period: 'FCFA/mois',
      description: 'Pour les vendeurs sérieux qui veulent plus.',
      popular: true,
      features: [
        'Produits illimités',
        'Personnalisation avancée',
        'Statistiques avancées',
        'Annonces & promotions',
        'Support prioritaire',
      ],
      cta: 'Passer au Plan Pro',
      link: '/register'
    },
    {
      name: 'Business',
      price: '15 000',
      period: 'FCFA/mois',
      description: 'Pour les PME et marques en forte croissance.',
      popular: false,
      features: [
        'Tout du Plan Pro',
        'Boutiques illimitées',
        'Rapports de performance',
        'API & intégrations avancées',
        'Support dédié 24/7',
      ],
      cta: 'Passer au Plan Business',
      link: '/register'
    }
  ];
}
