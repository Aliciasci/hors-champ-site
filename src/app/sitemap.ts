import type { MetadataRoute } from 'next';

import { getCatalog } from '@/content/catalog';
import { absoluteUrl } from '@/lib/site';

export const dynamic = 'force-static';

/**
 * Toutes les pages publiques pré-rendues. Exclues : pages personnelles (bibliothèque, profil,
 * bienvenue), jeu et analyse des contrechamps, exemples de développement.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const { culture, experiences, themes, youthItems, youthLives } = getCatalog();
  const paths = [
    '/',
    '/elles',
    '/activites',
    '/possible',
    '/droits',
    '/droits/monde',
    '/feminicides',
    '/collection',
    '/contrechamps',
    '/contrechamps/catalogue',
    '/credits',
    '/a-propos',
    ...themes.map((t) => `/elles/${t.id}`),
    ...youthItems.map((i) => `/possible/${i.id}`),
    ...youthLives.map((l) => `/possible/${l.id}`),
    ...culture.map((e) => `/culture/${e.id}`),
    ...experiences
      .filter((x) => x.editorialStatus !== 'dev-example')
      .map((x) => `/contrechamps/${x.id}`),
  ];
  return paths.map((path) => ({ url: absoluteUrl(path) }));
}
