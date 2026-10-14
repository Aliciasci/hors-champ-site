import { getCatalog } from '@/content/catalog';

/**
 * Identifiant réservé quand aucun contrechamp n'est publié (build de production sans les
 * exemples de développement) : l'export statique exige au moins un chemin par route dynamique.
 * Cette page rend l'état « introuvable » et n'est pas indexée.
 */
export const EMPTY_CATALOG_ID = 'aucun';

export function experienceStaticParams() {
  const { experiences } = getCatalog();
  return experiences.length > 0
    ? experiences.map((experience) => ({ id: experience.id }))
    : [{ id: EMPTY_CATALOG_ID }];
}
