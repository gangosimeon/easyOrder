import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

interface Profile {
  icon: string;
  title: string;
  description: string;
  color: string;
}

@Component({
  selector: 'app-for-who',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './for-who.component.html',
  styleUrl: './for-who.component.scss'
})
export class ForWhoComponent {
  readonly profiles: Profile[] = [
    { icon: 'smartphone',    title: 'Vendeurs WhatsApp',        description: 'Transforme tes groupes WhatsApp en véritable boutique professionnelle.',  color: '#25D366' },
    { icon: 'storefront',    title: 'Commerçants locaux',       description: 'Digitalise ton commerce et touche des clients bien au-delà du quartier.', color: '#F59E0B' },
    { icon: 'school',        title: 'Étudiants entrepreneurs',  description: 'Lance ton business sans capital et vends depuis ton téléphone.',          color: '#3B82F6' },
    { icon: 'music_note',    title: 'Influenceurs TikTok',       description: 'Monétise ta communauté avec une boutique liée à ton profil TikTok.',      color: '#010101' },
    { icon: 'photo_camera',  title: 'Boutiques Instagram',       description: 'Un lien en bio qui dirige tes followers vers une boutique complète.',     color: '#E1306C' },
    { icon: 'business',      title: 'PME & Marques',            description: 'Une solution simple et abordable pour vendre en ligne sans technicité.',  color: '#5B21B6' },
  ];
}
