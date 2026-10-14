import type { AnswerOption, Experience, QuestionMode } from '@/types';

/**
 * Lecture d'ensemble d'une réponse. On qualifie le raisonnement, jamais la personne :
 * aucune issue n'est « fausse » ni « mauvaise ».
 */
export type AnswerOutcome = 'grounded' | 'incomplete' | 'perspective' | 'revisit';

export interface AnswerEvaluation {
  outcome: AnswerOutcome;
  /** Options retenues, dans l'ordre de l'expérience. */
  selected: AnswerOption[];
  /** Éléments solides non retenus (questions à choix multiples uniquement). */
  missed: AnswerOption[];
}

export const OUTCOME_COPY: Record<AnswerOutcome, { title: string; description: string }> = {
  grounded: {
    title: 'Un raisonnement bien appuyé',
    description: 'Votre lecture s’appuie sur ce que montrent les éléments de la situation.',
  },
  incomplete: {
    title: 'Une piste juste, à compléter',
    description: 'Vous avez repéré des éléments importants ; d’autres méritent aussi l’attention.',
  },
  perspective: {
    title: 'Une lecture défendable',
    description: 'La situation admet plusieurs interprétations. Voyons ce que chacune éclaire.',
  },
  revisit: {
    title: 'Un angle à revisiter',
    description: 'C’est une réaction fréquente. Regardons ensemble ce sur quoi elle repose.',
  },
};

/** Ajoute ou retire une option de la sélection selon le mode de la question. */
export function toggleOption(
  mode: QuestionMode,
  selected: readonly string[],
  optionId: string,
): string[] {
  if (mode === 'single') return selected[0] === optionId ? [] : [optionId];
  return selected.includes(optionId)
    ? selected.filter((id) => id !== optionId)
    : [...selected, optionId];
}

/** Ne conserve que les identifiants connus, sans doublon, et en respectant le mode. */
export function sanitizeSelection(experience: Experience, selected: readonly string[]): string[] {
  const known = new Set(experience.answerOptions.map((option) => option.id));
  const unique = [...new Set(selected)].filter((id) => known.has(id));
  return experience.question.mode === 'single' ? unique.slice(0, 1) : unique;
}

export function canSubmit(experience: Experience, selected: readonly string[]): boolean {
  const clean = sanitizeSelection(experience, selected);
  return experience.question.mode === 'single' ? clean.length === 1 : clean.length >= 1;
}

export function evaluateAnswer(
  experience: Experience,
  selectedIds: readonly string[],
): AnswerEvaluation {
  const selectedSet = new Set(sanitizeSelection(experience, selectedIds));
  const selected = experience.answerOptions.filter((option) => selectedSet.has(option.id));

  const first = selected[0];
  if (!first) {
    throw new Error(`Aucune réponse valide pour l’expérience « ${experience.id} »`);
  }

  if (experience.question.mode === 'single') {
    const choice = first;
    const outcomeByAssessment = {
      solid: 'grounded',
      partial: 'incomplete',
      open: 'perspective',
      weak: 'revisit',
    } as const satisfies Record<AnswerOption['assessment'], AnswerOutcome>;
    return { outcome: outcomeByAssessment[choice.assessment], selected, missed: [] };
  }

  const solids = experience.answerOptions.filter((option) => option.assessment === 'solid');
  const missed = solids.filter((option) => !selectedSet.has(option.id));
  const hasWeak = selected.some((option) => option.assessment === 'weak');
  const foundSolid = solids.length - missed.length;

  let outcome: AnswerOutcome;
  if (hasWeak) outcome = 'revisit';
  else if (solids.length > 0 && missed.length === 0) outcome = 'grounded';
  else if (foundSolid > 0) outcome = 'incomplete';
  else outcome = 'perspective';

  return { outcome, selected, missed };
}
