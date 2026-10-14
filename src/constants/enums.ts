import type {
  CategoryId,
  Difficulty,
  EditorialStatus,
  ExperienceContentType,
  OptionAssessment,
  QuestionMode,
  SourceType,
} from '@/types';

/** Valeurs connues à l'exécution, alignées sur les types du modèle de contenu. */
export const CATEGORY_IDS = [
  'doubles-standards',
  'sexisme-quotidien',
  'medias-publicite',
  'stereotypes',
  'raisonnement',
  'histoire-culture',
] as const satisfies readonly CategoryId[];

export const CONTENT_TYPES = [
  'scenario',
  'image-analysis',
  'double-standard',
  'argument-analysis',
  'historical-context',
] as const satisfies readonly ExperienceContentType[];

export const DIFFICULTIES = [
  'decouverte',
  'intermediaire',
  'approfondi',
] as const satisfies readonly Difficulty[];

export const EDITORIAL_STATUSES = [
  'dev-example',
  'draft',
  'in-review',
  'verified',
] as const satisfies readonly EditorialStatus[];

export const SOURCE_TYPES = [
  'academic',
  'institutional',
  'legal',
  'press',
  'book',
  'encyclopedia',
  'archive',
  'other',
] as const satisfies readonly SourceType[];

export const ASSESSMENTS = [
  'solid',
  'partial',
  'open',
  'weak',
] as const satisfies readonly OptionAssessment[];

export const QUESTION_MODES = ['single', 'multiple'] as const satisfies readonly QuestionMode[];
