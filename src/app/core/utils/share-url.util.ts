// Liens publics partagés sur WhatsApp / réseaux sociaux. Toujours le domaine de
// production : un lien copié depuis un environnement de test doit rester valide.
const PUBLIC_SITE_URL = 'https://www.jecreemaboutique.com';

export function shopShareUrl(slug: string): string {
  return `${PUBLIC_SITE_URL}/shop/${slug}`;
}

/** `source` alimente les statistiques de provenance des visites. */
export function productShareUrl(slug: string, productId: string, source = 'produit'): string {
  return `${shopShareUrl(slug)}?p=${productId}&source=${source}`;
}

/**
 * Partage natif du téléphone (WhatsApp, statut, Facebook…) ; sur ordinateur,
 * repli sur WhatsApp, canal principal des commerçants.
 */
export function shareLink(title: string, text: string, url: string): void {
  if (navigator.share) {
    navigator.share({ title, text, url }).catch(() => { /* partage annulé */ });
  } else {
    window.open(`https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`, '_blank');
  }
}
