import { categories as localCategories } from '@/data/categories';
import { localCultureEntities } from '@/data/culture';
import { localExperiences } from '@/data/experiences';
import { prepareCultureEntities } from '@/features/culture/validateCulture';
import { validateExperience } from '@/features/experiences/validateExperience';
import type { Category, CultureEntity, Experience } from '@/types';

/**
 * Interface d'accès aux contenus éditoriaux.
 * Asynchrone dès maintenant pour qu'une implémentation distante (API, Supabase…)
 * puisse remplacer la source locale sans modifier les écrans.
 */
export interface ContentRepository {
  listCategories(): Promise<Category[]>;
  listExperiences(): Promise<Experience[]>;
  getExperience(id: string): Promise<Experience | null>;
  /** Fiches de découverte culturelle (femmes, œuvres, mouvements, événements, idées). */
  listCultureEntities(): Promise<CultureEntity[]>;
}

export interface ContentIssue {
  id: string | null;
  errors: string[];
}

export interface LocalRepositoryOptions {
  /** Inclure les contenus marqués `dev-example`. */
  includeDevExamples: boolean;
  onInvalidContent?: (issue: ContentIssue) => void;
}

/** Valide un lot de contenus bruts et retire les références vers des expériences absentes. */
export function prepareExperiences(
  raw: readonly unknown[],
  options: LocalRepositoryOptions,
): Experience[] {
  const valid: Experience[] = [];
  const seen = new Set<string>();
  for (const item of raw) {
    const result = validateExperience(item);
    if (!result.ok) {
      options.onInvalidContent?.({ id: result.id, errors: result.errors });
      continue;
    }
    if (seen.has(result.value.id)) {
      options.onInvalidContent?.({ id: result.value.id, errors: ['identifiant dupliqué'] });
      continue;
    }
    if (!options.includeDevExamples && result.value.editorialStatus === 'dev-example') continue;
    seen.add(result.value.id);
    valid.push(result.value);
  }
  return valid.map((experience) => ({
    ...experience,
    relatedExperienceIds: experience.relatedExperienceIds.filter(
      (id) => id !== experience.id && seen.has(id),
    ),
  }));
}

export function createLocalContentRepository(
  data: {
    experiences: readonly unknown[];
    categories: readonly Category[];
    culture?: readonly unknown[];
  },
  options: LocalRepositoryOptions,
): ContentRepository {
  let cache: Experience[] | null = null;
  const experiences = () => (cache ??= prepareExperiences(data.experiences, options));
  let cultureCache: CultureEntity[] | null = null;
  const culture = () =>
    (cultureCache ??= prepareCultureEntities(data.culture ?? [], options.onInvalidContent));

  return {
    async listCategories() {
      return [...data.categories];
    },
    async listExperiences() {
      return experiences();
    },
    async getExperience(id) {
      return experiences().find((experience) => experience.id === id) ?? null;
    },
    async listCultureEntities() {
      return culture();
    },
  };
}

const IS_DEV = process.env.NODE_ENV !== 'production';

/**
 * Les exemples de développement sont visibles en développement uniquement,
 * sauf si `NEXT_PUBLIC_INCLUDE_DEV_EXAMPLES=true` est défini (build de démonstration).
 */
export const INCLUDE_DEV_EXAMPLES =
  IS_DEV || process.env.NEXT_PUBLIC_INCLUDE_DEV_EXAMPLES === 'true';

export const contentRepository: ContentRepository = createLocalContentRepository(
  { experiences: localExperiences, categories: localCategories, culture: localCultureEntities },
  {
    includeDevExamples: INCLUDE_DEV_EXAMPLES,
    onInvalidContent: (issue) => {
      if (IS_DEV) console.warn(`[contenu] expérience ignorée (${issue.id ?? '?'})`, issue.errors);
    },
  },
);
