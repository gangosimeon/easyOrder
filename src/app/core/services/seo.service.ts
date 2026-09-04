import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

export const SEO_DEFAULTS = {
  title:       'JeCreeMaBoutique — Créez votre boutique en ligne gratuitement',
  description: 'Créez votre boutique, partagez votre lien et commencez à vendre dès aujourd\'hui. Gestion facile des produits, commandes via WhatsApp, boutique publique accessible 24/7.',
  canonical:   'https://www.jecreemaboutique.com/',
  image:       'https://www.jecreemaboutique.com/assets/icons/web-app-manifest-512x512.png',
};

export interface SocialTags {
  title:       string;
  description: string;
  url:         string;
  image?:      string;
  type?:       string;
}

/**
 * Point d'entrée unique pour les balises SEO gérées côté client (title,
 * meta description, canonical, robots, Open Graph/Twitter). Un crawler qui
 * n'exécute pas le JS ne verra jamais ces mises à jour — c'est un
 * complément au SSR bot dédié (`/shop/[slug]` côté backend), pas un
 * remplacement.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private title = inject(Title);
  private meta  = inject(Meta);
  private doc   = inject(DOCUMENT);

  setTitle(title: string): void {
    this.title.setTitle(title);
  }

  setDescription(description: string): void {
    const content = description.replace(/\s+/g, ' ').trim();
    this.meta.updateTag({ name: 'description', content });
  }

  /** Ajoute/retire la balise robots. Ne rien appeler = comportement par défaut (indexable). */
  setRobots(content: 'index,follow' | 'noindex,follow' | 'noindex,nofollow'): void {
    this.meta.updateTag({ name: 'robots', content });
  }

  setCanonical(url: string): void {
    let link = this.doc.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  setSocial(tags: SocialTags): void {
    const image = tags.image ?? SEO_DEFAULTS.image;
    const type  = tags.type ?? 'website';
    const entries: Record<string, string> = {
      'og:title':            tags.title,
      'og:description':      tags.description,
      'og:url':              tags.url,
      'og:image':            image,
      'og:image:secure_url': image,
      'og:type':             type,
      'twitter:title':       tags.title,
      'twitter:description': tags.description,
      'twitter:image':       image,
      'twitter:url':         tags.url,
    };
    for (const [prop, content] of Object.entries(entries)) {
      const attr = prop.startsWith('twitter:') ? 'name' : 'property';
      this.meta.updateTag({ [attr]: prop, content });
    }
  }

  /** Remet les balises par défaut (accueil) — à appeler dans ngOnDestroy des pages dynamiques. */
  reset(): void {
    this.setTitle(SEO_DEFAULTS.title);
    this.setDescription(SEO_DEFAULTS.description);
    this.setCanonical(SEO_DEFAULTS.canonical);
    this.setSocial({
      title:       SEO_DEFAULTS.title,
      description: SEO_DEFAULTS.description,
      url:         SEO_DEFAULTS.canonical,
      image:       SEO_DEFAULTS.image,
    });
  }
}
