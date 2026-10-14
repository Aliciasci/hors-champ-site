/**
 * Nombre de navigations internes depuis l'arrivée sur le site (onglet courant).
 * Sert au bouton « Retour » : on ne remonte l'historique que s'il vient du site.
 */
let internalNavigations = 0;
let lastPath: string | null = null;

export function trackPath(path: string) {
  if (lastPath !== null && lastPath !== path) internalNavigations += 1;
  lastPath = path;
}

export const hasInternalHistory = () => internalNavigations > 0;
