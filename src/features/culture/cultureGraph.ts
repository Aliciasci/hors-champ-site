import type {
  CategoryId,
  ContributionKind,
  CultureEntity,
  CultureKind,
  CultureLink,
  CultureRelation,
  Experience,
  RightCategory,
} from '@/types';

export const KIND_LABELS: Record<CultureKind, { singular: string; plural: string }> = {
  person: { singular: 'Femme', plural: 'Femmes' },
  work: { singular: 'Œuvre', plural: 'Œuvres' },
  science: { singular: 'Invention ou découverte', plural: 'Inventions et découvertes' },
  movement: { singular: 'Mouvement', plural: 'Mouvements' },
  event: { singular: 'Événement', plural: 'Événements' },
  idea: { singular: 'Idée', plural: 'Idées' },
  right: { singular: 'Conquête', plural: 'Conquêtes' },
  organization: { singular: 'Organisation', plural: 'Organisations' },
  law: { singular: 'Texte de loi', plural: 'Textes de loi' },
};

/** Ordre d'affichage des types, sur la vue d'ensemble comme dans les liens d'une fiche. */
export const KIND_ORDER: CultureKind[] = [
  'person',
  'right',
  'organization',
  'law',
  'work',
  'science',
  'movement',
  'event',
  'idea',
];

export interface RelatedEntity {
  entity: CultureEntity;
  relation: CultureRelation;
  /** `outgoing` : lien déclaré par la fiche courante ; `incoming` : déclaré par l'autre fiche. */
  direction: 'outgoing' | 'incoming';
}

/** Fiches liées à `entityId`, dans les deux sens, sans doublon. */
export function relatedEntities(
  entities: readonly CultureEntity[],
  entityId: string,
): RelatedEntity[] {
  const byId = new Map(entities.map((e) => [e.id, e]));
  const self = byId.get(entityId);
  if (!self) return [];
  const result = new Map<string, RelatedEntity>();
  for (const link of self.links) {
    const target = byId.get(link.targetId);
    if (target)
      result.set(target.id, { entity: target, relation: link.relation, direction: 'outgoing' });
  }
  for (const other of entities) {
    if (other.id === entityId || result.has(other.id)) continue;
    const link = other.links.find((l) => l.targetId === entityId);
    if (link)
      result.set(other.id, { entity: other, relation: link.relation, direction: 'incoming' });
  }
  return [...result.values()];
}

/** Regroupe les fiches liées par type, dans l'ordre d'affichage ; les événements par date. */
export function groupByKind(
  related: readonly RelatedEntity[],
): { kind: CultureKind; items: RelatedEntity[] }[] {
  return KIND_ORDER.map((kind) => ({
    kind,
    items: related
      .filter((r) => r.entity.kind === kind)
      .sort((a, b) => (a.entity.period?.sortYear ?? 0) - (b.entity.period?.sortYear ?? 0)),
  })).filter((group) => group.items.length > 0);
}

/** Expériences à faire depuis une fiche : celles du thème de l'idée liée (ou de la fiche si c'est une idée). */
export function relatedExperiences(
  entities: readonly CultureEntity[],
  entityId: string,
  experiences: readonly Experience[],
): Experience[] {
  const self = entities.find((e) => e.id === entityId);
  if (!self) return [];
  const categoryIds = new Set<CategoryId>();
  if (self.kind === 'idea' && self.categoryId) categoryIds.add(self.categoryId);
  for (const { entity } of relatedEntities(entities, entityId)) {
    if (entity.kind === 'idea' && entity.categoryId) categoryIds.add(entity.categoryId);
  }
  return experiences.filter((experience) => categoryIds.has(experience.categoryId));
}

/** Fiche « idée » correspondant à une catégorie d'expériences. */
export function ideaIdForCategory(categoryId: CategoryId): string {
  return `idea-${categoryId}`;
}

/** Tri de la vue d'ensemble : par type, puis chronologique, puis alphabétique. */
export function sortForBrowsing(entities: readonly CultureEntity[]): CultureEntity[] {
  return [...entities].sort(
    (a, b) =>
      KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind) ||
      (a.period?.sortYear ?? 0) - (b.period?.sortYear ?? 0) ||
      a.title.localeCompare(b.title, 'fr'),
  );
}

export const CONTRIBUTION_LABELS: Record<ContributionKind, string> = {
  claim: 'Revendication',
  mobilization: 'Mobilisation',
  publication: 'Publication',
  research: 'Recherche',
  'legal-action': 'Action juridique',
  advocacy: 'Plaidoyer politique',
  drafting: 'Rédaction d’un texte',
  reform: 'Défense et adoption d’une réforme',
  continuation: 'Poursuite du combat après l’adoption',
};

export const RIGHT_CATEGORY_LABELS: Record<RightCategory, string> = {
  politique: 'Droit politique et citoyenneté',
  autonomie: 'Autonomie juridique et financière',
  reproduction: 'Contraception et droits reproductifs',
  education: 'Éducation et accès aux savoirs',
  travail: 'Travail et égalité professionnelle',
  violences: 'Lutte contre les violences et les discriminations',
  famille: 'Famille et parentalité',
  libertes: 'Libertés culturelles et sociales',
};

export const RIGHT_CATEGORY_ORDER = Object.keys(RIGHT_CATEGORY_LABELS) as RightCategory[];

export interface Contribution {
  /** La femme ou l'organisation qui a contribué. */
  contributor: CultureEntity;
  link: CultureLink;
}

/** Contributions à une conquête, dans l'ordre chronologique (année de contribution). */
export function contributorsOf(
  entities: readonly CultureEntity[],
  rightId: string,
): Contribution[] {
  return entities
    .flatMap((contributor) =>
      contributor.links
        .filter((link) => link.relation === 'contributed' && link.targetId === rightId)
        .map((link) => ({ contributor, link })),
    )
    .sort((a, b) => (a.link.year ?? 0) - (b.link.year ?? 0));
}

/** Textes de loi qui établissent une conquête. */
export function lawsFor(entities: readonly CultureEntity[], rightId: string): CultureEntity[] {
  return entities.filter(
    (e) =>
      e.kind === 'law' && e.links.some((l) => l.relation === 'enacted' && l.targetId === rightId),
  );
}

/**
 * Situation d'une conquête par rapport à la vie d'une personne :
 * - `lifetime` : obtenue de son vivant ;
 * - `posthumous` : obtenue après sa mort (elle a contribué au combat, pas à l'adoption) ;
 * - `after-adoption` : elle a poursuivi le combat après l'adoption ;
 * - `unknown` : dates insuffisantes pour le dire.
 */
export type CombatTiming = 'lifetime' | 'posthumous' | 'after-adoption' | 'unknown';

export interface Combat {
  right: CultureEntity;
  link: CultureLink;
  timing: CombatTiming;
}

export function combatTiming(
  contributor: CultureEntity,
  right: CultureEntity,
  link: CultureLink,
): CombatTiming {
  if (link.contribution === 'continuation') return 'after-adoption';
  const adopted = right.period?.sortYear;
  const death = contributor.period?.endYear;
  if (adopted === undefined) return 'unknown';
  if (death === undefined) return contributor.kind === 'person' ? 'unknown' : 'lifetime';
  return adopted <= death ? 'lifetime' : 'posthumous';
}

/** Les combats d'une femme ou d'une organisation, dans l'ordre chronologique d'adoption. */
export function combatsOf(entities: readonly CultureEntity[], contributorId: string): Combat[] {
  const byId = new Map(entities.map((e) => [e.id, e]));
  const contributor = byId.get(contributorId);
  if (!contributor) return [];
  return contributor.links
    .filter((link) => link.relation === 'contributed')
    .map((link) => ({ link, right: byId.get(link.targetId) }))
    .filter((c): c is { link: CultureLink; right: CultureEntity } => c.right !== undefined)
    .map(({ link, right }) => ({ right, link, timing: combatTiming(contributor, right, link) }))
    .sort((a, b) => (a.right.period?.sortYear ?? 0) - (b.right.period?.sortYear ?? 0));
}

export type PeriodFilter = 'before-1900' | '1900-1945' | '1945-1970' | 'after-1970';

export const PERIOD_FILTERS: { id: PeriodFilter; label: string }[] = [
  { id: 'before-1900', label: 'Avant 1900' },
  { id: '1900-1945', label: '1900 – 1945' },
  { id: '1945-1970', label: '1946 – 1970' },
  { id: 'after-1970', label: 'Après 1970' },
];

export function matchesPeriod(year: number, filter: PeriodFilter): boolean {
  switch (filter) {
    case 'before-1900':
      return year < 1900;
    case '1900-1945':
      return year >= 1900 && year <= 1945;
    case '1945-1970':
      return year >= 1946 && year <= 1970;
    case 'after-1970':
      return year > 1970;
  }
}

export interface RightFilters {
  query: string;
  categories: RightCategory[];
  periods: PeriodFilter[];
  /** Personnalités : identifiants de fiches `person`. */
  people: string[];
}

export const EMPTY_RIGHT_FILTERS: RightFilters = {
  query: '',
  categories: [],
  periods: [],
  people: [],
};

/**
 * Filtre les conquêtes. Une conquête est trouvée par la recherche si le texte apparaît dans
 * son titre, son résumé ou le nom d'une personne ou organisation qui y a contribué.
 */
export function filterRights(
  entities: readonly CultureEntity[],
  filters: RightFilters,
): CultureEntity[] {
  const norm = (v: string) =>
    v
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  const terms = norm(filters.query).split(/\s+/).filter(Boolean);
  return entities
    .filter(
      (e) =>
        e.kind === 'right' &&
        e.right !== undefined &&
        (filters.categories.length === 0 || filters.categories.includes(e.right.category)),
    )
    .filter(
      (e) =>
        filters.periods.length === 0 ||
        filters.periods.some((p) => e.period !== undefined && matchesPeriod(e.period.sortYear, p)),
    )
    .filter((e) => {
      if (filters.people.length === 0) return true;
      const ids = contributorsOf(entities, e.id).map((c) => c.contributor.id);
      return filters.people.some((id) => ids.includes(id));
    })
    .filter((e) => {
      if (terms.length === 0) return true;
      const names = contributorsOf(entities, e.id).map((c) => c.contributor.title);
      const haystack = norm([e.title, e.summary, ...names].join(' '));
      return terms.every((t) => haystack.includes(t));
    })
    .sort((a, b) => (a.period?.sortYear ?? 0) - (b.period?.sortYear ?? 0));
}
