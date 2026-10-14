import type { Metadata } from 'next';

import type { Artwork } from '@/types';

import { absoluteUrl, SITE_NAME } from './site';

/** Résumé court pour les balises description (≈ 160 caractères, coupé sur un mot). */
export function describe(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).replace(/\s+\S*$/, '')}…`;
}

/** URL absolue d'une illustration locale (déclinaison WebP la plus large). */
export function imageUrl(artwork: Artwork): string {
  const src = typeof artwork.image === 'string' ? artwork.image : artwork.image.src;
  if (!src.startsWith('/images/')) return src;
  return absoluteUrl('/').replace(/\/$/, '') + src.replace(/\.[^.]+$/, '-900.webp');
}

/**
 * Métadonnées d'une page : titre (« X — Hors-Champ » via le gabarit), description, URL canonique,
 * Open Graph et Twitter. `noindex` pour les pages personnelles ou les exemples de développement.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
  noindex = false,
  type = 'website',
}: {
  title: string;
  description: string;
  path: string;
  image?: Artwork;
  noindex?: boolean;
  type?: 'website' | 'article' | 'profile';
}): Metadata {
  const url = absoluteUrl(path);
  const images = image
    ? [{ url: imageUrl(image), alt: image.alt }]
    : [
        {
          url: absoluteUrl('/og-default.jpg').replace(/\/$/, ''),
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ];
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type, siteName: SITE_NAME, locale: 'fr_FR', images },
    twitter: {
      card: image ? 'summary' : 'summary_large_image',
      title,
      description,
      images: images.map((i) => i.url),
    },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}
