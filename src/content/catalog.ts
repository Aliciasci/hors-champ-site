import { categories } from '@/data/categories';
import { events } from '@/data/culture/events';
import { ideas } from '@/data/culture/ideas';
import { movements } from '@/data/culture/movements';
import { people } from '@/data/culture/people';
import { laws, organizations, rights, rightsEvents, rightsPeople } from '@/data/culture/rights';
import { discoveries, matildaIdea, scienceEvents, scientists } from '@/data/culture/sciences';
import { works } from '@/data/culture/works';
import { localExperiences } from '@/data/experiences';
import { localYouthItems, youthLives } from '@/data/youth';
import { applyRedaction } from '@/content/redaction';
import { prepareCultureEntities, type CultureIssue } from '@/features/culture/validateCulture';
import { resolveThemes, type ResolvedTheme } from '@/features/portraits/portraitThemes';
import { validateYouth } from '@/features/youth/youthCatalog';
import { INCLUDE_DEV_EXAMPLES, prepareExperiences } from '@/services/contentRepository';
import type {
  Category,
  CategoryId,
  CultureEntity,
  Experience,
  YouthItem,
  YouthLife,
} from '@/types';

/**
 * Catalogue du site, chargé et validé une fois, au build.
 * Contrairement au mobile, qui écarte silencieusement un contenu invalide, le site refuse de se
 * construire : un message indique le fichier, la fiche et la règle non respectée.
 */

/** Fichier de données d'origine de chaque fiche, pour des messages d'erreur utiles. */
const CULTURE_FILES: [file: string, items: readonly unknown[]][] = [
  ['src/data/culture/people.ts', people],
  ['src/data/culture/sciences.ts', [...scientists, ...discoveries, ...scienceEvents, matildaIdea]],
  ['src/data/culture/works.ts', works],
  ['src/data/culture/movements.ts', movements],
  ['src/data/culture/events.ts', events],
  ['src/data/culture/ideas.ts', ideas],
  [
    'src/data/culture/rights.ts',
    [...rights, ...rightsPeople, ...organizations, ...laws, ...rightsEvents],
  ],
];

export class ContentValidationError extends Error {
  constructor(public readonly problems: string[]) {
    super(
      `Contenus invalides (${problems.length}) — le build est interrompu :\n` +
        problems.map((p) => `  • ${p}`).join('\n'),
    );
    this.name = 'ContentValidationError';
  }
}

function fileOf(id: string | null): string {
  if (!id) return 'fichier inconnu';
  const found = CULTURE_FILES.find(([, items]) =>
    items.some((item) => (item as { id?: unknown }).id === id),
  );
  return found?.[0] ?? 'fichier inconnu';
}

export interface Catalog {
  categories: Category[];
  /** Contrechamps publiés (sans les exemples de développement en production, sauf drapeau). */
  experiences: Experience[];
  culture: CultureEntity[];
  youthItems: YouthItem[];
  youthLives: YouthLife[];
  themes: ResolvedTheme[];
}

export interface BuildCatalogOptions {
  includeDevExamples: boolean;
}

/** Valide l'ensemble des contenus. Lève `ContentValidationError` au premier lot de problèmes. */
export function buildCatalog(
  raw: {
    experiences: readonly unknown[];
    culture: readonly [string, readonly unknown[]][];
    youthItems: readonly YouthItem[];
    youthLives: readonly YouthLife[];
    categories: readonly Category[];
  },
  options: BuildCatalogOptions,
): Catalog {
  const problems: string[] = [];

  const experiences = prepareExperiences(raw.experiences, {
    includeDevExamples: options.includeDevExamples,
    onInvalidContent: (issue) =>
      problems.push(
        `src/data/experiences/${issue.id ?? '?'}.ts — contrechamp « ${issue.id ?? '?'} » : ${issue.errors.join(' ; ')}`,
      ),
  });
  for (const experience of experiences) {
    for (const relatedId of raw.experiences
      .filter((e): e is Experience => (e as Experience).id === experience.id)
      .flatMap((e) => e.relatedExperienceIds)) {
      if (!raw.experiences.some((e) => (e as Experience).id === relatedId)) {
        problems.push(
          `src/data/experiences/${experience.id}.ts — relatedExperienceIds : contrechamp inconnu « ${relatedId} »`,
        );
      }
    }
  }

  const culture = prepareCultureEntities(
    raw.culture.flatMap(([, items]) => items),
    (issue: CultureIssue) =>
      problems.push(
        `${fileOf(issue.id)} — fiche « ${issue.id ?? '?'} » : ${issue.errors.join(' ; ')}`,
      ),
  );

  for (const issue of validateYouth(raw.youthItems, raw.youthLives, culture)) {
    problems.push(`src/data/youth — élément « ${issue.id} » : ${issue.error}`);
  }

  if (problems.length > 0) throw new ContentValidationError(problems);

  return {
    categories: [...raw.categories],
    experiences,
    culture,
    youthItems: [...raw.youthItems],
    youthLives: [...raw.youthLives],
    themes: resolveThemes(culture),
  };
}

let cached: Catalog | null = null;

/** Fiches locales, avec les réécritures validées par la rédaction (src/content/redaction.json). */
function cultureWithRedaction(): [string, readonly unknown[]][] {
  const problems: string[] = [];
  const rewritten = applyRedaction(
    CULTURE_FILES.flatMap(([, items]) => items),
    problems,
  );
  if (problems.length > 0) throw new ContentValidationError(problems);
  let index = 0;
  return CULTURE_FILES.map(([file, items]) => [file, items.map(() => rewritten[index++])]);
}

/** Catalogue local, validé une fois. */
export function getCatalog(): Catalog {
  cached ??= buildCatalog(
    {
      experiences: localExperiences,
      culture: cultureWithRedaction(),
      youthItems: localYouthItems,
      youthLives,
      categories,
    },
    { includeDevExamples: INCLUDE_DEV_EXAMPLES },
  );
  return cached;
}

/* Accès pratiques, pour les pages. */

export const getCultureEntity = (id: string) => getCatalog().culture.find((e) => e.id === id);
export const getExperience = (id: string) => getCatalog().experiences.find((e) => e.id === id);
export const getCategory = (id: CategoryId) => getCatalog().categories.find((c) => c.id === id);
export const getYouthItem = (id: string) => getCatalog().youthItems.find((i) => i.id === id);
export const getYouthLife = (id: string) => getCatalog().youthLives.find((l) => l.id === id);
export const getTheme = (id: string) => getCatalog().themes.find((t) => t.id === id);
