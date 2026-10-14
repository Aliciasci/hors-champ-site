import { IMAGE_WIDTHS } from './imageWidths.mjs';

/**
 * Chargeur next/image pour l'export statique : `/images/people/ada-lovelace.jpg` à 480 px
 * devient `/images/people/ada-lovelace-480.webp`, produit par scripts/build-images.mjs.
 * Les URL externes sont servies telles quelles.
 */
export default function imageLoader({ src, width }: { src: string; width: number }): string {
  if (!src.startsWith('/images/')) return src;
  const size = IMAGE_WIDTHS.find((w) => w >= width) ?? IMAGE_WIDTHS[IMAGE_WIDTHS.length - 1];
  return `${src.replace(/\.[^.]+$/, '')}-${size}.webp`;
}
