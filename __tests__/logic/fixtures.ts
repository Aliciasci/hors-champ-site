import type { AnswerOption, Experience, QuestionMode } from '@/types';

/** Données de test uniquement : URL en example.org, aucune valeur éditoriale. */
export function makeOption(id: string, assessment: AnswerOption['assessment']): AnswerOption {
  return { id, label: `Option ${id}`, assessment, feedback: `Retour ${id}` };
}

export function makeExperience(
  overrides: Partial<Experience> = {},
  mode: QuestionMode = 'single',
): Experience {
  return {
    id: 'exp-test',
    slug: 'exp-test',
    title: 'Expérience de test',
    shortDescription: 'Description courte',
    introduction: 'Introduction',
    categoryId: 'doubles-standards',
    estimatedMinutes: 5,
    difficulty: 'decouverte',
    coverImage: null,
    contentType: 'scenario',
    scenario: { title: 'Situation', blocks: [{ kind: 'paragraph', text: 'Texte' }] },
    question: { prompt: 'Question ?', mode },
    answerOptions: [
      makeOption('a', 'solid'),
      makeOption('b', 'partial'),
      makeOption('c', 'open'),
      makeOption('d', 'weak'),
    ],
    explanation: { summary: 'Résumé', keyPoints: ['Point 1'] },
    nuance: { canConclude: ['Oui'], cannotConclude: ['Non'], counterArguments: [] },
    sources: [],
    relatedExperienceIds: [],
    editorialStatus: 'dev-example',
    reviewedAt: null,
    ...overrides,
  };
}

export const TEST_SOURCE = {
  id: 'source-test',
  title: 'Source de test',
  publisher: 'Éditeur de test',
  url: 'https://example.org/source',
  sourceType: 'other',
  accessedAt: '2026-01-15',
  note: 'Note de test',
} as const;
