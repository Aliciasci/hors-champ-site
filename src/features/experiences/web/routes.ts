import type { ExperienceStep } from '@/types';

export const detailHref = (id: string) => `/contrechamps/${id}`;
export const playHref = (id: string) => `/contrechamps/${id}/jouer`;
export const analysisHref = (id: string) => `/contrechamps/${id}/analyse`;
export const catalogueHref = (themes?: string) =>
  themes ? `/contrechamps/catalogue?themes=${themes}` : '/contrechamps/catalogue';

/** Étapes du contrechamp dans l'URL (`?etape=1|2|3`). */
export const STEP_NUMBERS: Record<ExperienceStep, number> = {
  scenario: 1,
  question: 2,
  feedback: 3,
};

export function stepFromParam(value: string | null): ExperienceStep | null {
  switch (value) {
    case '1':
      return 'scenario';
    case '2':
      return 'question';
    case '3':
      return 'feedback';
    default:
      return null;
  }
}

export const STEP_LABELS: Record<ExperienceStep, string> = {
  scenario: 'La situation',
  question: 'Votre lecture',
  feedback: 'Premier retour',
};

const MARKERS = 'ABCDEFGHIJ';
export const marker = (index: number) => MARKERS[index] ?? String(index + 1);

/** Déroulé présenté sur la page de détail. */
export const OUTLINE = [
  { title: 'La situation', text: 'Une scène courte, à lire à votre rythme.' },
  {
    title: 'Votre lecture',
    text: 'Une question. Souvent, plusieurs réponses se défendent.',
  },
  { title: 'L’analyse', text: 'Ce qu’on peut en dire, ce qu’on ne peut pas, et nos sources.' },
];
