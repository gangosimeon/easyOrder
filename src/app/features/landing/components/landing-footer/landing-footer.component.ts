import { Component } from '@angular/core';
import { MatIcon } from "@angular/material/icon";

interface FooterSection {
  title: string;
  expanded: boolean;
  links: { label: string; href: string }[];
}

@Component({
  selector: 'app-landing-footer',
  standalone: true,
  imports: [],
  templateUrl: './landing-footer.component.html',
  styleUrl: './landing-footer.component.scss'
})
export class LandingFooterComponent {
  readonly currentYear = new Date().getFullYear();

  sections: FooterSection[] = [
    {
      title: 'Produit', expanded: false,
      links: [
        { label: 'Fonctionnalités', href: '#features' },
        { label: 'Tarifs',          href: '#pricing'  },
        { label: 'Guide de démarrage', href: '#how-it-works' },
        { label: 'Mises à jour',    href: '#' },
      ]
    },
    {
      title: 'Ressources', expanded: false,
      links: [
        { label: 'Blog',          href: '#' },
        { label: 'FAQ',           href: '#' },
        { label: "Centre d'aide", href: '#' },
        { label: 'Démos',         href: '#' },
      ]
    },
    {
      title: 'Entreprise', expanded: false,
      links: [
        { label: 'À propos',      href: '#' },
        { label: 'Carrières',     href: '#' },
        { label: 'Presse',        href: '#' },
        { label: 'Investisseurs', href: '#' },
      ]
    },
    {
      title: 'Légal', expanded: false,
      links: [
        { label: "Conditions d'utilisation", href: '#' },
        { label: 'Politique de confidentialité', href: '#' },
        { label: 'Cookies',          href: '#' },
        { label: 'Mentions légales', href: '#' },
      ]
    },
  ];

  readonly socials = [
    { label: 'Facebook',  icon: '𝐟', href: '#' },
    { label: 'Instagram', icon: '◉', href: '#' },
    { label: 'TikTok',    icon: '♪', href: '#' },
    { label: 'Twitter/X', icon: '𝕏', href: '#' },
  ];

  toggleSection(index: number): void {
    this.sections[index].expanded = !this.sections[index].expanded;
  }
}
