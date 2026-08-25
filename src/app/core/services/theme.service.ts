import { Injectable, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';

/** Doit rester synchronisé avec `theme_color` dans src/manifest.webmanifest. */
export const DEFAULT_THEME_COLOR = '#008060';

const HEX_COLOR_RE = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

/**
 * Pilote la balise <meta name="theme-color"> pour que la barre système
 * Android (PWA / TWA PWABuilder) reflète la couleur de la boutique visitée.
 *
 * Chrome lit cette balise en direct sur la page chargée — aucune
 * reconstruction de l'AAB n'est nécessaire. Seul l'écran de démarrage natif
 * (avant chargement de la page) reste figé sur `theme_color` du manifest.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private meta = inject(Meta);

  /** Applique la couleur donnée, ou la couleur par défaut si absente/invalide. */
  setThemeColor(color?: string | null): void {
    const value = color && HEX_COLOR_RE.test(color) ? color : DEFAULT_THEME_COLOR;
    this.meta.updateTag({ name: 'theme-color', content: value });
  }

  resetThemeColor(): void {
    this.setThemeColor(undefined);
  }
}
