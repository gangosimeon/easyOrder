import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

interface Step {
  icon: string;
  step: number;
  title: string;
  description: string;
}

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './how-it-works.component.html',
  styleUrls: ['./how-it-works.component.scss']
})
export class HowItWorksComponent {
  readonly steps: Step[] = [
    {
      icon: 'storefront',
      step: 1,
      title: 'Crée ta boutique',
      description: 'Ajoute ton logo, tes produits, tes prix et personnalise ta boutique en quelques clics.'
    },
    {
      icon: 'link',
      step: 2,
      title: 'Obtiens ton lien',
      description: 'Reçois un lien unique pour ta boutique et partage-le où tu veux — WhatsApp, TikTok, Instagram.'
    },
    {
      icon: 'shopping_bag',
      step: 3,
      title: 'Reçois des commandes',
      description: 'Tes clients commandent directement et tu reçois les commandes facilement.'
    }
  ];
}
