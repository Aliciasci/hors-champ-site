import type { CultureKind, CultureRelation } from '@/types';

import { KIND_LABELS } from '../cultureGraph';

/** Libellé d'un lien vu depuis la fiche courante (repris du mobile). */
export function relationLabel(
  relation: CultureRelation,
  direction: 'outgoing' | 'incoming',
  targetKind: CultureKind,
  sourceKind: CultureKind,
): string {
  if (relation === 'created') {
    if (targetKind === 'science') return 'Invention ou découverte';
    if (targetKind === 'person') return 'À l’origine';
    return direction === 'outgoing' ? 'Œuvre de cette artiste' : 'Artiste';
  }
  if (relation === 'member-of') {
    if (direction === 'outgoing')
      return targetKind === 'organization'
        ? 'Organisation dont elle a été membre'
        : 'Mouvement de rattachement';
    return sourceKind === 'organization' ? 'Membre ou dirigeante' : 'Artiste rattachée';
  }
  if (relation === 'enacted')
    return direction === 'outgoing' ? 'Conquête établie par ce texte' : 'Texte qui l’établit';
  if (relation === 'contributed')
    return direction === 'outgoing' ? 'Combat auquel elle a contribué' : 'A contribué à ce combat';
  if (relation === 'took-part')
    return direction === 'outgoing' ? 'Événement de sa vie' : 'Femme concernée';
  if (relation === 'illustrates')
    return direction === 'outgoing'
      ? 'Thème que l’œuvre illustre dans Hors-Champ'
      : 'Œuvre choisie pour illustrer ce thème';
  return `${KIND_LABELS[targetKind].singular} en lien`;
}
