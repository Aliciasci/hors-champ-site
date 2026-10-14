/** Adresse publique du site (URL canoniques, sitemap, Open Graph). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(
  /\/$/,
  '',
);

export const SITE_NAME = 'Hors-Champ';

export const SITE_DESCRIPTION =
  'Des femmes artistes et scientifiques, leurs œuvres, leurs inventions, les droits conquis et les idées qui les relient. Puis des contrechamps pour exercer son esprit critique face aux mécanismes du sexisme.';

/** URL absolue d'un chemin du site (avec la barre finale de l'export statique). */
export function absoluteUrl(path: string): string {
  const clean = path === '/' ? '/' : `${path.replace(/\/$/, '')}/`;
  return `${SITE_URL}${clean}`;
}
