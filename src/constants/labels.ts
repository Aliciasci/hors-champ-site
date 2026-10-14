import type {
  Difficulty,
  EditorialStatus,
  ExperienceContentType,
  OptionAssessment,
  SourceType,
} from '@/types';

export const CONTENT_TYPE_LABELS: Record<ExperienceContentType, string> = {
  scenario: 'Scénario',
  'image-analysis': 'Décryptage visuel',
  'double-standard': 'Double standard',
  'argument-analysis': 'Analyse d’argument',
  'historical-context': 'Contexte historique',
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  decouverte: 'Découverte',
  intermediaire: 'Intermédiaire',
  approfondi: 'Approfondi',
};

export const DIFFICULTY_DESCRIPTIONS: Record<Difficulty, string> = {
  decouverte: 'Des situations courtes pour repérer les mécanismes.',
  intermediaire: 'Des cas plus ambigus, avec plusieurs lectures possibles.',
  approfondi: 'Des raisonnements à démonter pas à pas.',
};

export const EDITORIAL_STATUS_LABELS: Record<EditorialStatus, string> = {
  'dev-example': 'Exemple de développement',
  draft: 'Brouillon',
  'in-review': 'En relecture',
  verified: 'Vérifié',
};

export const ASSESSMENT_LABELS: Record<OptionAssessment, string> = {
  solid: 'Raisonnement solide',
  partial: 'En partie fondé',
  open: 'Lecture défendable',
  weak: 'Raisonnement fragile',
};

export const SOURCE_TYPE_LABELS: Record<SourceType, string> = {
  academic: 'Recherche',
  institutional: 'Institution',
  legal: 'Texte juridique',
  press: 'Presse',
  book: 'Livre',
  encyclopedia: 'Encyclopédie',
  archive: 'Archive',
  other: 'Autre',
};
