import type { CultureEntity, Experience, YouthItem } from '@/types';

/**
 * Versions allégées des contenus, transmises aux îlots client (bibliothèque, profil) :
 * seulement ce qu'affichent les cartes, pour ne pas embarquer résumés et sources.
 */

export type SlimEntity = CultureEntity;

export function slimEntity(e: CultureEntity): SlimEntity {
  return {
    id: e.id,
    kind: e.kind,
    title: e.title,
    subtitle: e.subtitle,
    period: e.period,
    image: e.image,
    domain: e.domain,
    summary: '',
    links: [],
    sources: [],
    editorialStatus: e.editorialStatus,
    reviewedAt: e.reviewedAt,
  };
}

export type SlimExperience = Experience;

export function slimExperience(e: Experience): SlimExperience {
  return {
    ...e,
    introduction: '',
    scenario: { title: '', blocks: [] },
    answerOptions: [],
    explanation: { summary: '', keyPoints: [] },
    nuance: { canConclude: [], cannotConclude: [], counterArguments: [] },
    sources: [],
  };
}

export interface SlimYouth {
  id: string;
  kind: YouthItem['kind'];
  title: string;
  image?: YouthItem['image'];
}

export const slimYouth = (i: YouthItem): SlimYouth => ({
  id: i.id,
  kind: i.kind,
  title: i.title,
  image: i.image,
});
