import { contributorsOf } from '@/features/culture/cultureGraph';
import type { CultureEntity } from '@/types';

/** Vitesse de lecture d'un texte informatif en français, en mots par minute. */
const WORDS_PER_MINUTE = 200;

const countWords = (text: string | undefined) =>
  text ? text.split(/\s+/).filter((word) => /[\p{L}\p{N}]/u.test(word)).length : 0;

/** Tout le texte lu sur la fiche : accroche, résumé, détails d'une conquête, contributions. */
function ficheTexts(entity: CultureEntity, all: readonly CultureEntity[]): (string | undefined)[] {
  const right = entity.right;
  return [
    entity.hook,
    entity.summary,
    right?.before,
    ...(right?.steps.map((step) => step.text) ?? []),
    right?.outcome,
    ...(right?.limits ?? []),
    ...(right?.later.map((item) => item.text) ?? []),
    ...(entity.article?.paragraphs.flatMap((p) => [p.heading, p.text]) ?? []),
    // Contributions décrites sur cette fiche (vers une conquête) ou reçues (d'autres fiches).
    ...entity.links.map((link) => link.detail),
    ...(entity.kind === 'right' ? contributorsOf(all, entity.id).map((c) => c.link.detail) : []),
  ];
}

/** Temps de lecture d'une fiche, en minutes entières (au moins 1). */
export function readingMinutes(entity: CultureEntity, all: readonly CultureEntity[]): number {
  const words = ficheTexts(entity, all).reduce((sum, text) => sum + countWords(text), 0);
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export const readingLabel = (minutes: number) => `${minutes} min de lecture`;
