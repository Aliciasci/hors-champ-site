/** Adresse publique du site (URL canoniques, sitemap, Open Graph). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(
  /\/$/,
  '',
);

export const SITE_NAME = 'Hors-Champ';

export const SITE_DESCRIPTION =
  'Des peintres, des mathématiciennes, des militantes que l’histoire a laissées au bord du cadre. Leurs vies, leurs œuvres et les droits qu’elles ont arrachés, sources à l’appui. Et des contrechamps pour apprendre à repérer le sexisme ordinaire.';

/** URL absolue d'un chemin du site (avec la barre finale de l'export statique). */
export function absoluteUrl(path: string): string {
  const clean = path === '/' ? '/' : `${path.replace(/\/$/, '')}/`;
  return `${SITE_URL}${clean}`;
}
