import { relatedEntities } from '@/features/culture/cultureGraph';
import { hasCompleted } from '@/features/progress/progressLogic';
import type {
  CultureEntity,
  CultureKind,
  Experience,
  ExperienceProgress,
  Preferences,
} from '@/types';

/**
 * Expérience à mettre en avant : la première non commencée qui correspond aux préférences,
 * puis la première non terminée, puis la première du catalogue.
 */
export function pickFeaturedExperience(
  experiences: readonly Experience[],
  progress: Record<string, ExperienceProgress>,
  preferences: Preferences,
): Experience | null {
  const notStarted = experiences.filter((experience) => !progress[experience.id]);
  const matchesPrefs = (experience: Experience) =>
    (preferences.favoriteCategoryIds.length === 0 ||
      preferences.favoriteCategoryIds.includes(experience.categoryId)) &&
    (preferences.preferredDifficulty === null ||
      preferences.preferredDifficulty === experience.difficulty);

  return (
    notStarted.find(matchesPrefs) ??
    notStarted.find(
      (experience) =>
        preferences.favoriteCategoryIds.length === 0 ||
        preferences.favoriteCategoryIds.includes(experience.categoryId),
    ) ??
    notStarted[0] ??
    experiences.find((experience) => !hasCompleted(progress[experience.id])) ??
    experiences[0] ??
    null
  );
}

/** Expériences ouvertes récemment (en cours ou terminées), de la plus récente à la plus ancienne. */
export function recentlyStarted(
  experiences: readonly Experience[],
  progress: Record<string, ExperienceProgress>,
  limit = 3,
): Experience[] {
  return experiences
    .filter((experience) => progress[experience.id] !== undefined)
    .sort((a, b) =>
      (progress[b.id]?.updatedAt ?? '').localeCompare(progress[a.id]?.updatedAt ?? ''),
    )
    .slice(0, limit);
}

/**
 * Fiches culturelles à proposer : une femme, une œuvre, une invention et un événement, en privilégiant
 * celles pas encore explorées et en évitant de proposer des fiches liées entre elles.
 */
export function pickCultureSuggestions(
  entities: readonly CultureEntity[],
  exploredIds: readonly string[],
): CultureEntity[] {
  const explored = new Set(exploredIds);
  const picked: CultureEntity[] = [];
  const isRelatedToPicked = (entity: CultureEntity) =>
    picked.some((p) => relatedEntities(entities, p.id).some((r) => r.entity.id === entity.id));
  for (const kind of ['person', 'work', 'science', 'event'] as CultureKind[]) {
    const ofKind = entities.filter((e) => e.kind === kind);
    const choice =
      ofKind.find((e) => !explored.has(e.id) && !isRelatedToPicked(e)) ??
      ofKind.find((e) => !isRelatedToPicked(e)) ??
      ofKind[0];
    if (choice) picked.push(choice);
  }
  return picked;
}

/**
 * Fiche à la une de l'écran Découvrir : une femme illustrée pas encore explorée,
 * en alternant sciences, arts et droits selon le nombre de fiches déjà ouvertes.
 */
const FEATURED_DOMAINS = ['sciences', 'arts', 'droits'] as const;

export function pickFeaturedEntity(
  entities: readonly CultureEntity[],
  exploredIds: readonly string[],
): CultureEntity | null {
  const explored = new Set(exploredIds);
  const people = entities.filter((e) => e.kind === 'person' && e.image);
  const domain = FEATURED_DOMAINS[explored.size % FEATURED_DOMAINS.length];
  return (
    people.find((e) => e.domain === domain && !explored.has(e.id)) ??
    people.find((e) => !explored.has(e.id)) ??
    people[0] ??
    null
  );
}

/** Rubriques de l'accueil : « À la une » mélange les trois domaines. */
export type FeedSection = 'all' | 'arts' | 'sciences' | 'droits';

/** Dans le fil, on lit d'abord des femmes et des conquêtes, puis ce qui les entoure. */
const FEED_KIND_ORDER: CultureKind[] = [
  'person',
  'right',
  'science',
  'work',
  'event',
  'organization',
  'law',
  'movement',
  'idea',
];

const byYear = (a: CultureEntity, b: CultureEntity) =>
  (a.period?.sortYear ?? 0) - (b.period?.sortYear ?? 0) || a.title.localeCompare(b.title, 'fr');

/** Prend un élément de chaque file à tour de rôle. */
function interleave<T>(lanes: T[][]): T[] {
  const out: T[] = [];
  for (let i = 0; lanes.some((lane) => i < lane.length); i++) {
    for (const lane of lanes) {
      const item = lane[i];
      if (item !== undefined) out.push(item);
    }
  }
  return out;
}

/** Fiches d'un ensemble, en alternant les types (une femme, une conquête, une œuvre…). */
const mixKinds = (entities: CultureEntity[]) =>
  interleave(FEED_KIND_ORDER.map((kind) => entities.filter((e) => e.kind === kind).sort(byYear)));

/**
 * Fil de l'accueil, à la manière d'une publication : la fiche à la une en tête, puis les
 * autres fiches. « À la une » alterne les domaines (sciences, arts, droits, idées) ; une
 * rubrique ne garde que son domaine. Dans les deux cas, les types de fiches alternent.
 */
export function buildFeed(
  entities: readonly CultureEntity[],
  section: FeedSection,
  leadId?: string,
): CultureEntity[] {
  const feed =
    section === 'all'
      ? interleave(
          [...FEATURED_DOMAINS, undefined].map((d) =>
            mixKinds(entities.filter((e) => e.domain === d)),
          ),
        )
      : mixKinds(entities.filter((e) => e.domain === section));
  const lead = feed.find((e) => e.id === leadId);
  return lead ? [lead, ...feed.filter((e) => e.id !== leadId)] : feed;
}
