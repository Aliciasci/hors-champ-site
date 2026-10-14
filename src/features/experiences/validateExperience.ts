import {
  ASSESSMENTS,
  CATEGORY_IDS,
  CONTENT_TYPES,
  DIFFICULTIES,
  EDITORIAL_STATUSES,
  QUESTION_MODES,
  SOURCE_TYPES,
} from '@/constants/enums';
import type { Experience } from '@/types';
import { isIsoDate, isNonEmptyString, isOneOf, isRecord, isStringArray } from '@/utils/guards';

export type ValidationResult =
  { ok: true; value: Experience } | { ok: false; id: string | null; errors: string[] };

const BLOCK_KINDS = [
  'paragraph',
  'dialogue',
  'comparison',
  'visual',
  'argument',
  'context',
] as const;

export function validateSource(source: unknown, index: number, errors: string[]): void {
  const at = `sources[${index}]`;
  if (!isRecord(source)) {
    errors.push(`${at} : objet attendu`);
    return;
  }
  for (const key of ['id', 'title', 'publisher'] as const) {
    if (!isNonEmptyString(source[key])) errors.push(`${at}.${key} manquant`);
  }
  if (typeof source.url !== 'string' || !/^https:\/\/\S+$/.test(source.url)) {
    errors.push(`${at}.url doit être une URL https`);
  }
  if (!isOneOf(source.sourceType, SOURCE_TYPES)) errors.push(`${at}.sourceType inconnu`);
  if (!isIsoDate(source.accessedAt)) errors.push(`${at}.accessedAt doit être une date AAAA-MM-JJ`);
  if (source.publishedAt !== undefined && !isIsoDate(source.publishedAt)) {
    errors.push(`${at}.publishedAt doit être une date AAAA-MM-JJ`);
  }
  if (!isNonEmptyString(source.relevantExcerpt) && !isNonEmptyString(source.note)) {
    errors.push(`${at} : un extrait pertinent ou une note est requis`);
  }
}

/**
 * Vérifie qu'une donnée inconnue respecte le modèle `Experience`
 * ainsi que les règles éditoriales (une expérience vérifiée doit être sourcée et datée).
 */
export function validateExperience(value: unknown): ValidationResult {
  const errors: string[] = [];
  if (!isRecord(value)) return { ok: false, id: null, errors: ['objet attendu'] };

  const id = isNonEmptyString(value.id) ? value.id : null;
  if (!id) errors.push('id manquant');

  for (const key of ['slug', 'title', 'shortDescription', 'introduction'] as const) {
    if (!isNonEmptyString(value[key])) errors.push(`${key} manquant`);
  }
  if (!isOneOf(value.categoryId, CATEGORY_IDS)) errors.push('categoryId inconnu');
  if (!isOneOf(value.contentType, CONTENT_TYPES)) errors.push('contentType inconnu');
  if (!isOneOf(value.difficulty, DIFFICULTIES)) errors.push('difficulty inconnue');
  if (!isOneOf(value.editorialStatus, EDITORIAL_STATUSES)) errors.push('editorialStatus inconnu');
  if (
    typeof value.estimatedMinutes !== 'number' ||
    !Number.isInteger(value.estimatedMinutes) ||
    value.estimatedMinutes <= 0
  ) {
    errors.push('estimatedMinutes doit être un entier positif');
  }
  if (value.coverImage !== null) {
    if (!isRecord(value.coverImage) || !isNonEmptyString(value.coverImage.alt)) {
      errors.push('coverImage doit être null ou comporter un texte alternatif');
    }
  }
  if (value.reviewedAt !== null && !isIsoDate(value.reviewedAt)) {
    errors.push('reviewedAt doit être null ou une date AAAA-MM-JJ');
  }

  // Mise en situation
  const scenario = value.scenario;
  if (!isRecord(scenario) || !isNonEmptyString(scenario.title) || !Array.isArray(scenario.blocks)) {
    errors.push('scenario invalide');
  } else if (scenario.blocks.length === 0) {
    errors.push('scenario.blocks ne peut pas être vide');
  } else {
    scenario.blocks.forEach((block, index) => {
      if (!isRecord(block) || !isOneOf(block.kind, BLOCK_KINDS)) {
        errors.push(`scenario.blocks[${index}] : type de bloc inconnu`);
      }
    });
  }

  // Question et options
  const question = value.question;
  if (!isRecord(question) || !isNonEmptyString(question.prompt)) {
    errors.push('question invalide');
  } else if (!isOneOf(question.mode, QUESTION_MODES)) {
    errors.push('question.mode inconnu');
  }

  if (!Array.isArray(value.answerOptions) || value.answerOptions.length < 2) {
    errors.push('answerOptions doit contenir au moins deux options');
  } else {
    const seen = new Set<string>();
    value.answerOptions.forEach((option, index) => {
      const at = `answerOptions[${index}]`;
      if (!isRecord(option)) {
        errors.push(`${at} : objet attendu`);
        return;
      }
      if (!isNonEmptyString(option.id)) errors.push(`${at}.id manquant`);
      else if (seen.has(option.id)) errors.push(`${at}.id dupliqué : ${option.id}`);
      else seen.add(option.id);
      if (!isNonEmptyString(option.label)) errors.push(`${at}.label manquant`);
      if (!isNonEmptyString(option.feedback)) errors.push(`${at}.feedback manquant`);
      if (!isOneOf(option.assessment, ASSESSMENTS)) errors.push(`${at}.assessment inconnu`);
    });
  }

  // Explications
  const explanation = value.explanation;
  if (
    !isRecord(explanation) ||
    !isNonEmptyString(explanation.summary) ||
    !isStringArray(explanation.keyPoints)
  ) {
    errors.push('explanation invalide');
  }
  const nuance = value.nuance;
  if (
    !isRecord(nuance) ||
    !isStringArray(nuance.canConclude) ||
    !isStringArray(nuance.cannotConclude) ||
    !Array.isArray(nuance.counterArguments)
  ) {
    errors.push('nuance invalide');
  }

  // Sources
  if (!Array.isArray(value.sources)) {
    errors.push('sources doit être une liste');
  } else {
    value.sources.forEach((source, index) => validateSource(source, index, errors));
    if (value.editorialStatus === 'verified') {
      if (value.sources.length === 0)
        errors.push('une expérience vérifiée doit citer au moins une source');
      if (!isIsoDate(value.reviewedAt))
        errors.push('une expérience vérifiée doit avoir une date de relecture');
    }
  }

  if (!isStringArray(value.relatedExperienceIds)) {
    errors.push('relatedExperienceIds doit être une liste d’identifiants');
  }

  if (errors.length > 0) return { ok: false, id, errors };
  return { ok: true, value: value as unknown as Experience };
}
