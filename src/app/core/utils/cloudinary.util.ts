/**
 * Insère des paramètres de transformation Cloudinary (resize à la volée, sans
 * infra ni upload supplémentaire) dans une URL d'image déjà hébergée sur
 * Cloudinary. Les URLs non-Cloudinary sont retournées inchangées.
 */
export function cloudinaryThumb(url: string | undefined | null, width: number, height = width): string {
  if (!url) return '';
  const marker = '/image/upload/';
  const idx = url.indexOf(marker);
  if (idx === -1) return url;
  const insertAt = idx + marker.length;
  const transform = `w_${width},h_${height},c_fill,q_auto,f_auto/`;
  return url.slice(0, insertAt) + transform + url.slice(insertAt);
}
