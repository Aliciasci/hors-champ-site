import type { CategoryId, Experience, ExperienceContentType } from '@/types';
import { normalizeForSearch } from '@/utils/text';

export type DurationFilter = 'short' | 'medium' | 'long';

export const DURATION_FILTERS: { id: DurationFilter; label: string; accessibilityLabel: string }[] =
  [
    { id: 'short', label: '≤ 4 min', accessibilityLabel: '4 minutes ou moins' },
    { id: 'medium', label: '5–7 min', accessibilityLabel: 'de 5 à 7 minutes' },
    { id: 'long', label: '8 min et +', accessibilityLabel: '8 minutes ou plus' },
  ];

export function matchesDuration(minutes: number, filter: DurationFilter): boolean {
  switch (filter) {
    case 'short':
      return minutes <= 4;
    case 'medium':
      return minutes >= 5 && minutes <= 7;
    case 'long':
      return minutes >= 8;
  }
}

export interface ExperienceFilters {
  query: string;
  categoryIds: CategoryId[];
  contentTypes: ExperienceContentType[];
  durations: DurationFilter[];
}

export const EMPTY_FILTERS: ExperienceFilters = {
  query: '',
  categoryIds: [],
  contentTypes: [],
  durations: [],
};

/** Nombre de filtres sélectionnés (hors recherche textuelle). */
export function countActiveFilters(filters: ExperienceFilters): number {
  return filters.categoryIds.length + filters.contentTypes.length + filters.durations.length;
}

export function hasActiveFilters(filters: ExperienceFilters): boolean {
  return (
    filters.query.trim().length > 0 ||
    filters.categoryIds.length > 0 ||
    filters.contentTypes.length > 0 ||
    filters.durations.length > 0
  );
}

function searchableText(experience: Experience, categoryTitle: string): string {
  return normalizeForSearch(
    [experience.title, experience.shortDescription, experience.introduction, categoryTitle].join(
      ' ',
    ),
  );
}

/**
 * Filtre local. À l'intérieur d'un même groupe de filtres, les valeurs sont combinées par « ou » ;
 * entre groupes, par « et ». Chaque mot de la recherche doit apparaître.
 */
export function filterExperiences(
  experiences: readonly Experience[],
  filters: ExperienceFilters,
  categoryTitles: Partial<Record<CategoryId, string>> = {},
): Experience[] {
  const terms = normalizeForSearch(filters.query).split(' ').filter(Boolean);

  return experiences.filter((experience) => {
    if (filters.categoryIds.length > 0 && !filters.categoryIds.includes(experience.categoryId)) {
      return false;
    }
    if (filters.contentTypes.length > 0 && !filters.contentTypes.includes(experience.contentType)) {
      return false;
    }
    if (
      filters.durations.length > 0 &&
      !filters.durations.some((filter) => matchesDuration(experience.estimatedMinutes, filter))
    ) {
      return false;
    }
    if (terms.length === 0) return true;
    const haystack = searchableText(experience, categoryTitles[experience.categoryId] ?? '');
    return terms.every((term) => haystack.includes(term));
  });
}

export function toggleInList<T>(list: readonly T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}
