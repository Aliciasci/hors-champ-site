import type { AgeBand, CultureEntity, ExploreDoor, Leveled, YouthItem, YouthLife } from '@/types';

export const AGE_BANDS: { id: AgeBand; label: string }[] = [
  { id: '6-10', label: '6 – 10 ans' },
  { id: '11-14', label: '11 – 14 ans' },
];

/** Sans choix, on lit la version 11–14 ans, plus complète ; le choix reste facultatif. */
export const DEFAULT_AGE_BAND: AgeBand = '11-14';

export const read = (text: Leveled, band: AgeBand | null) => text[band ?? DEFAULT_AGE_BAND];

export const YOUTH_PREFIXES = {
  career: 'metier-',
  portrait: 'portrait-',
  activity: 'activite-',
} as const;

export const isYouthId = (id: string) =>
  Object.values(YOUTH_PREFIXES).some((prefix) => id.startsWith(prefix));

const isLeveled = (value: unknown): value is Leveled =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as Leveled)['6-10'] === 'string' &&
  (value as Leveled)['6-10'].trim().length > 0 &&
  typeof (value as Leveled)['11-14'] === 'string' &&
  (value as Leveled)['11-14'].trim().length > 0;

/** Tous les textes à deux niveaux d'un élément, pour vérifier qu'aucun n'est vide. */
function leveledFields(item: YouthItem): unknown[] {
  switch (item.kind) {
    case 'career':
      return [
        item.hook,
        item.daily,
        item.problems,
        ...item.paths.map((p) => p.text),
        ...(item.regulated ? [item.regulated] : []),
        ...item.cultureLinks.map((l) => l.explanation),
      ];
    case 'portrait':
      return [
        item.curiosity,
        item.learning,
        item.achievements,
        item.takeaway,
        ...(item.difficulties ? [item.difficulties] : []),
        ...(item.helpers ? [item.helpers] : []),
        ...item.cultureLinks.map((l) => l.explanation),
      ];
    case 'activity':
      return [
        item.intro,
        item.explanation,
        item.discipline,
        ...(item.question ? [item.question] : []),
        ...(item.choices ?? []).map((c) => c.feedback),
        ...(item.steps ?? []),
        ...(item.details ?? []).flatMap((d) => [d.label, d.explanation]),
        ...(item.design ?? []).map((d) => d.prompt),
      ];
  }
}

export interface YouthIssue {
  id: string;
  error: string;
}

/**
 * Vérifie le corpus jeunesse : préfixes, sources, deux niveaux de lecture pour chaque texte,
 * références vers des éléments existants (jeunesse ou fiches culturelles), liens culturels
 * appuyés par une source de l'élément, et contenu propre à chaque type d'activité.
 */
export function validateYouth(
  items: readonly YouthItem[],
  lives: readonly YouthLife[],
  culture: readonly CultureEntity[],
): YouthIssue[] {
  const issues: YouthIssue[] = [];
  const ids = new Set(items.map((i) => i.id));
  const cultureIds = new Set(culture.map((e) => e.id));
  const exists = (id: string) => ids.has(id) || cultureIds.has(id);
  const push = (id: string, error: string) => issues.push({ id, error });

  const seen = new Set<string>();
  for (const item of items) {
    if (seen.has(item.id)) push(item.id, 'identifiant en double');
    seen.add(item.id);
    if (!item.id.startsWith(YOUTH_PREFIXES[item.kind])) push(item.id, 'préfixe incorrect');
    if (item.sources.length === 0) push(item.id, 'aucune source');
    if (item.editorialStatus === 'verified' && !item.reviewedAt)
      push(item.id, 'relecture non datée');
    if (item.doors.length === 0) push(item.id, 'aucune porte d’entrée');
    if (!leveledFields(item).every(isLeveled))
      push(item.id, 'texte manquant pour une tranche d’âge');
    const sourceIds = new Set(item.sources.map((s) => s.id));

    if (item.kind === 'career' || item.kind === 'portrait') {
      for (const link of item.cultureLinks) {
        if (!cultureIds.has(link.targetId))
          push(item.id, `fiche culturelle inconnue : ${link.targetId}`);
        if (!sourceIds.has(link.sourceId)) push(item.id, 'lien culturel sans source de l’élément');
      }
    }
    if (item.kind === 'career') {
      if (!ids.has(item.portraitId)) push(item.id, 'portrait inconnu');
      if (item.activityId && !ids.has(item.activityId)) push(item.id, 'activité inconnue');
      for (const path of item.paths) {
        if (path.sourceId && !sourceIds.has(path.sourceId))
          push(item.id, 'voie d’accès mal sourcée');
      }
      if (item.skills.length === 0) push(item.id, 'compétences manquantes');
    }
    if (item.kind === 'portrait' || item.kind === 'activity') {
      for (const careerId of item.careerIds) {
        if (!ids.has(careerId)) push(item.id, `métier inconnu : ${careerId}`);
      }
    }
    if (item.kind === 'activity') {
      const needs: Record<typeof item.activityKind, boolean> = {
        riddle: !!item.question && (item.choices?.length ?? 0) > 1,
        build: (item.steps?.length ?? 0) > 0 && item.materials.length > 0 && !!item.safety?.length,
        observe: !!item.image && (item.details?.length ?? 0) > 0,
        design: (item.design?.length ?? 0) > 0,
      };
      if (!needs[item.activityKind]) push(item.id, 'contenu incomplet pour ce type d’activité');
    }
  }
  for (const life of lives) {
    if (!isLeveled(life.intro)) push(life.id, 'introduction manquante');
    if (life.itemIds.length === 0) push(life.id, 'collection vide');
    for (const id of life.itemIds) if (!exists(id)) push(life.id, `élément inconnu : ${id}`);
  }
  return issues;
}

/** Filtre par porte d'entrée ; sans porte choisie, tout reste visible. */
export function byDoor<T extends { doors: ExploreDoor[] }>(
  items: readonly T[],
  door: ExploreDoor | null,
) {
  return door ? items.filter((i) => i.doors.includes(door)) : [...items];
}

/** Ne garde que les éléments valides : un élément signalé par la validation est écarté. */
export function prepareYouth(
  items: readonly YouthItem[],
  lives: readonly YouthLife[],
  culture: readonly CultureEntity[],
  onIssue?: (issue: YouthIssue) => void,
) {
  const issues = validateYouth(items, lives, culture);
  issues.forEach((issue) => onIssue?.(issue));
  const bad = new Set(issues.map((i) => i.id));
  const kept = items.filter((i) => !bad.has(i.id));
  const keptIds = new Set([...kept.map((i) => i.id), ...culture.map((e) => e.id)]);
  return {
    items: kept,
    lives: lives
      .filter((l) => !bad.has(l.id))
      .map((l) => ({ ...l, itemIds: l.itemIds.filter((id) => keptIds.has(id)) }))
      .filter((l) => l.itemIds.length > 0),
  };
}
