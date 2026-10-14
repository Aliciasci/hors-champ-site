import type { StaticImageData } from 'next/image';

import { imageManifest } from '@/generated/imageManifest';

/**
 * Illustration locale, à partir de son chemin dans `assets/` (ex. `people/ada-lovelace.jpg`).
 * Largeur et hauteur viennent du manifeste généré : une image absente fait échouer le build.
 */
export function img(path: string): StaticImageData {
  const size = imageManifest[path];
  if (!size) throw new Error(`[images] illustration inconnue : assets/${path}`);
  return { src: `/images/${path}`, width: size.width, height: size.height };
}
