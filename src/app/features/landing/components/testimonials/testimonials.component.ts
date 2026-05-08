import { Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

interface Testimonial {
  stars: number;
  text: string;
  name: string;
  role: string;
  initials: string;
  color: string;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.scss'
})
export class TestimonialsComponent {
  readonly testimonials: Testimonial[] = [
    {
      stars: 5,
      text: 'Grâce à JeCreeMaBoutique, j\'ai reçu mes premières commandes en ligne en seulement 2 jours. L\'outil est tellement simple que j\'ai tout fait sur mon téléphone !',
      name: 'Jean K.',
      role: 'Vendeur de vêtements',
      initials: 'JK',
      color: '#5B21B6'
    },
    {
      stars: 5,
      text: 'Je partage mon lien sur WhatsApp et Facebook directement. Mes clients voient mes produits et commandent sans me déranger à chaque fois. C\'est parfait !',
      name: 'Mamadou B.',
      role: 'Boutiquier & Tailleur',
      initials: 'MB',
      color: '#8B5CF6'
    },
    {
      stars: 5,
      text: 'JeCreeMaBoutique m\'a permis de développer mon activité de vente en ligne facilement. Le lien partageable est mon meilleur outil de vente sur TikTok.',
      name: 'Fatou B.',
      role: 'Vendeuse en ligne',
      initials: 'FB',
      color: '#7C3AED'
    }
  ];

  currentIndex = signal(0);

  prev(): void {
    this.currentIndex.update(i => (i - 1 + this.testimonials.length) % this.testimonials.length);
  }

  next(): void {
    this.currentIndex.update(i => (i + 1) % this.testimonials.length);
  }

  range(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i);
  }
}
