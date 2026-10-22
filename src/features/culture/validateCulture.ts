import { CATEGORY_IDS, EDITORIAL_STATUSES } from '@/constants/enums';
import { validateSource } from '@/features/experiences/validateExperience';
import type {
  ContributionKind,
  CultureEntity,
  CultureKind,
  CultureRelation,
  RightCategory,
} from '@/types';
import { isIsoDate, isNonEmptyString, isOneOf, isRecord } from '@/utils/guards';

export const CULTURE_KINDS = [
  'person',
  'work',
  'science',
  'movement',
  'event',
  'idea',
  'right',
  'organization',
  'law',
] as const satisfies readonly CultureKind[];

const RELATIONS = [
  'created',
  'member-of',
  'took-part',
  'illustrates',
  'contributed',
  'enacted',
  'context',
] as const satisfies readonly CultureRelation[];

export const CONTRIBUTION_KINDS = [
  'claim',
  'mobilization',
  'publication',
  'research',
  'legal-action',
  'advocacy',
  'drafting',
  'reform',
  'continuation',
] as const satisfies readonly ContributionKind[];

export const RIGHT_CATEGORIES = [
  'politique',
  'autonomie',
  'reproduction',
  'education',
  'travail',
  'violences',
  'famille',
  'libertes',
] as const satisfies readonly RightCategory[];

/** Types autorisés de part et d'autre d'un lien (sens déclaré dans les données). */
const ALLOWED: Record<CultureRelation, { from: CultureKind[]; to: CultureKind[] }> = {
  created: { from: ['person'], to: ['work', 'science'] },
  'member-of': { from: ['person'], to: ['movement', 'organization'] },
  'took-part': { from: ['person'], to: ['event'] },
  illustrates: { from: ['work'], to: ['idea'] },
  contributed: { from: ['person', 'organization'], to: ['right'] },
  enacted: { from: ['law'], to: ['right'] },
  context: { from: [...CULTURE_KINDS], to: [...CULTURE_KINDS] },
};

/** Fiches porteuses d'affirmations factuelles : au moins une source exigée. */
const SOURCED_KINDS: CultureKind[] = [
  'person',
  'work',
  'science',
  'movement',
  'event',
  'right',
  'organization',
  'law',
];

export interface CultureIssue {
  id: string | null;
  errors: string[];
}

function validateRightDetails(value: unknown, errors: string[]): void {
  if (!isRecord(value)) {
    errors.push('une conquête doit avoir ses détails (catégorie, pays, étapes…)');
    return;
  }
  if (!isOneOf(value.category, RIGHT_CATEGORIES)) errors.push('catégorie de droit inconnue');
  for (const key of ['country', 'before', 'outcome'] as const) {
    if (!isNonEmptyString(value[key])) errors.push(`right.${key} manquant`);
  }
  if (
    !Array.isArray(value.steps) ||
    value.steps.length === 0 ||
    !value.steps.every(
      (step) => isRecord(step) && isNonEmptyString(step.date) && isNonEmptyString(step.text),
    )
  ) {
    errors.push('une conquête doit décrire au moins une étape datée');
  }
  if (!Array.isArray(value.limits) || !value.limits.every(isNonEmptyString)) {
    errors.push('right.limits invalide');
  }
  if (
    !Array.isArray(value.later) ||
    !value.later.every(
      (item) =>
        isRecord(item) &&
        isNonEmptyString(item.text) &&
        (item.involves === undefined ||
          (Array.isArray(item.involves) && item.involves.every(isNonEmptyString))),
    )
  ) {
    errors.push('right.later invalide');
  }
}

/** Valide une fiche isolément (champs, sources, statut). */
export function validateCultureEntity(
  value: unknown,
): { ok: true; value: CultureEntity } | { ok: false; issue: CultureIssue } {
  const errors: string[] = [];
  if (!isRecord(value)) return { ok: false, issue: { id: null, errors: ['objet attendu'] } };
  const id = isNonEmptyString(value.id) ? value.id : null;
  if (!id) errors.push('id manquant');
  if (!isOneOf(value.kind, CULTURE_KINDS)) errors.push('kind inconnu');
  else if (id && !id.startsWith(`${value.kind}-`))
    errors.push(`l’id doit commencer par « ${value.kind}- »`);
  if (!isNonEmptyString(value.title)) errors.push('title manquant');
  if (!isNonEmptyString(value.summary)) errors.push('summary manquant');
  if (!isOneOf(value.editorialStatus, EDITORIAL_STATUSES)) errors.push('editorialStatus inconnu');
  if (value.reviewedAt !== null && !isIsoDate(value.reviewedAt)) errors.push('reviewedAt invalide');
  if (value.kind === 'idea' && !isOneOf(value.categoryId, CATEGORY_IDS))
    errors.push('une idée doit référencer une catégorie');
  if (
    value.domain !== undefined &&
    !isOneOf(value.domain, ['arts', 'sciences', 'droits', 'sport'] as const)
  ) {
    errors.push('domain inconnu');
  }
  if (value.hook !== undefined && !isNonEmptyString(value.hook)) errors.push('hook invalide');
  if (value.kind === 'right') validateRightDetails(value.right, errors);
  else if (value.right !== undefined)
    errors.push('seule une conquête peut avoir des détails de droit');
  if (value.kind === 'law') {
    if (!isRecord(value.law) || !isNonEmptyString(value.law.institution)) {
      errors.push('un texte de loi doit préciser l’institution qui l’a adopté');
    }
  }
  if (Array.isArray(value.links) && Array.isArray(value.sources)) {
    const sourceIds = new Set(value.sources.map((src) => (isRecord(src) ? src.id : null)));
    value.links.forEach((link, index) => {
      if (!isRecord(link) || link.relation !== 'contributed') return;
      const at = `links[${index}]`;
      // Une personne n'est associée à un droit que si son rôle est documenté.
      if (!isOneOf(link.contribution, CONTRIBUTION_KINDS))
        errors.push(`${at} : nature de contribution manquante`);
      if (!isNonEmptyString(link.detail)) errors.push(`${at} : contribution précise manquante`);
      if (!isNonEmptyString(link.sourceId) || !sourceIds.has(link.sourceId)) {
        errors.push(`${at} : la contribution doit citer une source de la fiche`);
      }
    });
  }
  if (value.period !== undefined) {
    if (
      !isRecord(value.period) ||
      !isNonEmptyString(value.period.label) ||
      typeof value.period.sortYear !== 'number'
    ) {
      errors.push('period invalide');
    }
  }
  if (!Array.isArray(value.links)) errors.push('links doit être une liste');
  if (!Array.isArray(value.sources)) {
    errors.push('sources doit être une liste');
  } else {
    value.sources.forEach((source, index) => validateSource(source, index, errors));
    const sourceIds = value.sources.map((source) => (isRecord(source) ? source.id : null));
    if (new Set(sourceIds).size !== sourceIds.length)
      errors.push('identifiants de sources dupliqués');
    if (isOneOf(value.kind, SOURCED_KINDS) && value.sources.length === 0) {
      errors.push('cette fiche doit citer au moins une source');
    }
    if (value.editorialStatus === 'verified' && !isIsoDate(value.reviewedAt)) {
      errors.push('une fiche vérifiée doit avoir une date de relecture');
    }
  }
  if (errors.length > 0) return { ok: false, issue: { id, errors } };
  return { ok: true, value: value as unknown as CultureEntity };
}

/**
 * Valide le catalogue : fiches valides, identifiants uniques, liens vers des fiches existantes
 * et cohérents avec leur nature. Les fiches invalides sont écartées, les liens cassés retirés.
 */
export function prepareCultureEntities(
  raw: readonly unknown[],
  onIssue?: (issue: CultureIssue) => void,
): CultureEntity[] {
  const valid: CultureEntity[] = [];
  const byId = new Map<string, CultureEntity>();
  for (const item of raw) {
    const result = validateCultureEntity(item);
    if (!result.ok) {
      onIssue?.(result.issue);
      continue;
    }
    if (byId.has(result.value.id)) {
      onIssue?.({ id: result.value.id, errors: ['identifiant dupliqué'] });
      continue;
    }
    byId.set(result.value.id, result.value);
    valid.push(result.value);
  }
  return valid.map((entity) => {
    const errors: string[] = [];
    const links = entity.links.filter((link) => {
      const target = byId.get(link.targetId);
      if (!isOneOf(link.relation, RELATIONS)) {
        errors.push(`relation inconnue vers ${link.targetId}`);
        return false;
      }
      if (!target || target.id === entity.id) {
        errors.push(`lien vers une fiche absente : ${link.targetId}`);
        return false;
      }
      const rule = ALLOWED[link.relation];
      if (!rule.from.includes(entity.kind) || !rule.to.includes(target.kind)) {
        errors.push(
          `relation « ${link.relation} » impossible de ${entity.kind} vers ${target.kind}`,
        );
        return false;
      }
      return true;
    });
    if (errors.length > 0) onIssue?.({ id: entity.id, errors });
    return links.length === entity.links.length ? entity : { ...entity, links };
  });
}
