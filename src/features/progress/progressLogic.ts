import { EXPLORED_ENTITIES_LIMIT, RECENTLY_VIEWED_LIMIT } from '@/constants/config';
import type {
  Bookmark,
  Category,
  CategoryId,
  Experience,
  ExperienceProgress,
  ExperienceStep,
  PersistedState,
} from '@/types';

/**
 * Transitions pures de l'état persisté. Le store Zustand ne fait que les appeler :
 * elles sont ainsi testables sans React ni stockage.
 */

export const INITIAL_STATE: PersistedState = {
  preferences: {
    onboardingCompleted: false,
    favoriteCategoryIds: [],
    preferredDifficulty: null,
    themeId: 'cartel',
    ageBand: null,
  },
  bookmarks: [],
  progress: {},
  recentlyViewedIds: [],
  savedDiscoveries: [],
  exploredEntityIds: [],
};

function updateProgress(
  state: PersistedState,
  experienceId: string,
  now: string,
  patch: (current: ExperienceProgress) => Partial<ExperienceProgress>,
): PersistedState {
  const current = state.progress[experienceId];
  if (!current) return state;
  return {
    ...state,
    progress: {
      ...state.progress,
      [experienceId]: { ...current, ...patch(current), updatedAt: now },
    },
  };
}

function freshProgress(
  experienceId: string,
  now: string,
  previous: ExperienceProgress | undefined,
): ExperienceProgress {
  return {
    experienceId,
    status: 'in-progress',
    currentStep: 'scenario',
    selectedOptionIds: [],
    submittedOptionIds: null,
    startedAt: now,
    updatedAt: now,
    lastCompletedOptionIds: previous?.lastCompletedOptionIds ?? null,
    firstCompletedAt: previous?.firstCompletedAt ?? null,
    completedCount: previous?.completedCount ?? 0,
  };
}

/** Démarre une expérience, ou ne fait rien si une tentative est déjà en cours. */
export function startExperience(
  state: PersistedState,
  experienceId: string,
  now: string,
): PersistedState {
  const current = state.progress[experienceId];
  if (current?.status === 'in-progress') return state;
  return restartExperience(state, experienceId, now);
}

/** Recommence une expérience depuis le début, en conservant l'historique de complétion. */
export function restartExperience(
  state: PersistedState,
  experienceId: string,
  now: string,
): PersistedState {
  const previous = state.progress[experienceId];
  return {
    ...state,
    progress: { ...state.progress, [experienceId]: freshProgress(experienceId, now, previous) },
  };
}

export function goToStep(
  state: PersistedState,
  experienceId: string,
  step: ExperienceStep,
  now: string,
): PersistedState {
  return updateProgress(state, experienceId, now, (current) => {
    // On ne peut atteindre le retour qu'une fois la réponse validée.
    if (step === 'feedback' && current.submittedOptionIds === null) return {};
    return { currentStep: step };
  });
}

export function setSelection(
  state: PersistedState,
  experienceId: string,
  optionIds: string[],
  now: string,
): PersistedState {
  return updateProgress(state, experienceId, now, (current) =>
    current.submittedOptionIds === null ? { selectedOptionIds: optionIds } : {},
  );
}

export function submitAnswer(
  state: PersistedState,
  experienceId: string,
  optionIds: string[],
  now: string,
): PersistedState {
  if (optionIds.length === 0) return state;
  return updateProgress(state, experienceId, now, () => ({
    selectedOptionIds: optionIds,
    submittedOptionIds: optionIds,
    currentStep: 'feedback',
  }));
}

export function completeExperience(
  state: PersistedState,
  experienceId: string,
  now: string,
): PersistedState {
  return updateProgress(state, experienceId, now, (current) => {
    if (current.submittedOptionIds === null || current.status === 'completed') return {};
    return {
      status: 'completed',
      lastCompletedOptionIds: current.submittedOptionIds,
      firstCompletedAt: current.firstCompletedAt ?? now,
      completedCount: current.completedCount + 1,
    };
  });
}

export function recordView(state: PersistedState, experienceId: string): PersistedState {
  if (state.recentlyViewedIds[0] === experienceId) return state;
  const next = [experienceId, ...state.recentlyViewedIds.filter((id) => id !== experienceId)];
  return { ...state, recentlyViewedIds: next.slice(0, RECENTLY_VIEWED_LIMIT) };
}

/** Mémorise l'ouverture d'une fiche culturelle (la plus récente en premier). */
export function recordExploration(state: PersistedState, entityId: string): PersistedState {
  if (state.exploredEntityIds[0] === entityId) return state;
  const next = [entityId, ...state.exploredEntityIds.filter((id) => id !== entityId)];
  return { ...state, exploredEntityIds: next.slice(0, EXPLORED_ENTITIES_LIMIT) };
}

export function isDiscoverySaved(
  state: Pick<PersistedState, 'savedDiscoveries'>,
  entityId: string,
): boolean {
  return state.savedDiscoveries.some((d) => d.entityId === entityId);
}

export function toggleDiscovery(
  state: PersistedState,
  entityId: string,
  now: string,
): PersistedState {
  const savedDiscoveries = isDiscoverySaved(state, entityId)
    ? state.savedDiscoveries.filter((d) => d.entityId !== entityId)
    : [{ entityId, savedAt: now }, ...state.savedDiscoveries];
  return { ...state, savedDiscoveries };
}

export function isBookmarked(bookmarks: readonly Bookmark[], experienceId: string): boolean {
  return bookmarks.some((bookmark) => bookmark.experienceId === experienceId);
}

export function toggleBookmark(
  state: PersistedState,
  experienceId: string,
  now: string,
): PersistedState {
  const bookmarks = isBookmarked(state.bookmarks, experienceId)
    ? state.bookmarks.filter((bookmark) => bookmark.experienceId !== experienceId)
    : [{ experienceId, savedAt: now }, ...state.bookmarks];
  return { ...state, bookmarks };
}

/** Une expérience est « terminée » dès qu'elle l'a été au moins une fois. */
export function hasCompleted(progress: ExperienceProgress | undefined): boolean {
  return (progress?.completedCount ?? 0) > 0;
}

/** Réponse à analyser : celle de la tentative en cours si validée, sinon la dernière terminée. */
export function answerForResult(progress: ExperienceProgress | undefined): string[] | null {
  if (!progress) return null;
  return progress.submittedOptionIds ?? progress.lastCompletedOptionIds;
}

export function isInProgress(progress: ExperienceProgress | undefined): boolean {
  return progress?.status === 'in-progress';
}

/** Expérience en cours la plus récemment manipulée, parmi celles qui existent encore. */
export function findLastInProgress(
  progress: Record<string, ExperienceProgress>,
  knownIds: ReadonlySet<string>,
): ExperienceProgress | null {
  return (
    Object.values(progress)
      .filter((entry) => entry.status === 'in-progress' && knownIds.has(entry.experienceId))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0] ?? null
  );
}

export interface CategoryCoverage {
  categoryId: CategoryId;
  title: string;
  completed: number;
  total: number;
}

export interface ProgressSummary {
  startedCount: number;
  inProgressCount: number;
  completedCount: number;
  totalCount: number;
  exploredCategoryIds: CategoryId[];
  coverage: CategoryCoverage[];
}

/**
 * Mesure l'exploration : combien d'expériences ouvertes, terminées, quels thèmes parcourus.
 * Volontairement, aucune note ni aucun score de « justesse » n'est calculé.
 */
export function computeProgressSummary(
  progress: Record<string, ExperienceProgress>,
  experiences: readonly Experience[],
  categories: readonly Category[],
): ProgressSummary {
  const known = experiences.filter((experience) => progress[experience.id] !== undefined);
  const completed = known.filter((experience) => hasCompleted(progress[experience.id]));
  const inProgress = known.filter((experience) => isInProgress(progress[experience.id]));

  const explored = new Set(known.map((experience) => experience.categoryId));

  return {
    startedCount: known.length,
    inProgressCount: inProgress.length,
    completedCount: completed.length,
    totalCount: experiences.length,
    exploredCategoryIds: categories.map((c) => c.id).filter((id) => explored.has(id)),
    coverage: categories.map((category) => ({
      categoryId: category.id,
      title: category.title,
      completed: completed.filter((e) => e.categoryId === category.id).length,
      total: experiences.filter((e) => e.categoryId === category.id).length,
    })),
  };
}
