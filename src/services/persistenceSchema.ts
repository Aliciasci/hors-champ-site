import { CATEGORY_IDS, DIFFICULTIES } from '@/constants/enums';
import { EXPLORED_ENTITIES_LIMIT, RECENTLY_VIEWED_LIMIT } from '@/constants/config';
import { DEFAULT_THEME_ID, THEME_IDS } from '@/theme/types';
import { INITIAL_STATE } from '@/features/progress/progressLogic';
import type { Bookmark, ExperienceProgress, PersistedState, SavedDiscovery } from '@/types';
import { EXPERIENCE_STEPS } from '@/types';
import { isNonEmptyString, isOneOf, isRecord, isStringArray } from '@/utils/guards';

/**
 * Version du schéma des données stockées sur l'appareil.
 * À incrémenter à chaque changement de forme, en ajoutant une migration ci-dessous.
 */
export const STORAGE_SCHEMA_VERSION = 4;

/** Migration de la version N vers N + 1. */
export type Migration = (state: Record<string, unknown>) => Record<string, unknown>;

/**
 * Migrations indexées par version de départ.
 * Exemple pour une future v2 : `1: (state) => ({ ...state, nouveauChamp: valeurParDefaut })`.
 */
export const MIGRATIONS: Record<number, Migration> = {
  // v1 → v2 : ajout du choix de direction artistique (thème Cartel par défaut).
  1: (state) => {
    const preferences = isRecord(state.preferences) ? state.preferences : {};
    return { ...state, preferences: { ...preferences, themeId: DEFAULT_THEME_ID } };
  },
  // v2 → v3 : découverte culturelle (découvertes enregistrées, fiches explorées).
  2: (state) => ({ ...state, savedDiscoveries: [], exploredEntityIds: [] }),
  // v3 → v4 : niveau de lecture facultatif du parcours jeunesse (aucun par défaut).
  3: (state) => {
    const preferences = isRecord(state.preferences) ? state.preferences : {};
    return { ...state, preferences: { ...preferences, ageBand: null } };
  },
};

export function migratePersistedState(
  persisted: unknown,
  fromVersion: number,
  migrations: Record<number, Migration> = MIGRATIONS,
  targetVersion: number = STORAGE_SCHEMA_VERSION,
): PersistedState {
  if (!isRecord(persisted)) return INITIAL_STATE;
  let state: Record<string, unknown> = persisted;
  for (let version = fromVersion; version < targetVersion; version += 1) {
    const migrate = migrations[version];
    if (migrate) state = migrate(state);
  }
  return sanitizePersistedState(state);
}

function sanitizeProgressEntry(id: string, value: unknown): ExperienceProgress | null {
  if (!isRecord(value)) return null;
  const { status, currentStep, startedAt, updatedAt } = value;
  if (!isOneOf(status, ['in-progress', 'completed'] as const)) return null;
  if (!isNonEmptyString(startedAt) || !isNonEmptyString(updatedAt)) return null;
  const submitted = isStringArray(value.submittedOptionIds) ? value.submittedOptionIds : null;
  const step = isOneOf(currentStep, EXPERIENCE_STEPS) ? currentStep : 'scenario';
  const completedCount =
    typeof value.completedCount === 'number' && value.completedCount >= 0
      ? Math.floor(value.completedCount)
      : 0;
  return {
    experienceId: id,
    status,
    // Un retour ne peut pas être affiché sans réponse validée.
    currentStep: step === 'feedback' && submitted === null ? 'question' : step,
    selectedOptionIds: isStringArray(value.selectedOptionIds) ? value.selectedOptionIds : [],
    submittedOptionIds: submitted,
    lastCompletedOptionIds: isStringArray(value.lastCompletedOptionIds)
      ? value.lastCompletedOptionIds
      : null,
    startedAt,
    updatedAt,
    firstCompletedAt: isNonEmptyString(value.firstCompletedAt) ? value.firstCompletedAt : null,
    completedCount,
  };
}

/**
 * Reconstruit un état valide à partir de données potentiellement corrompues ou partielles.
 * Les champs invalides sont remplacés par leur valeur par défaut, jamais propagés.
 */
export function sanitizePersistedState(raw: unknown): PersistedState {
  if (!isRecord(raw)) return INITIAL_STATE;

  const prefs = isRecord(raw.preferences) ? raw.preferences : {};
  const favoriteCategoryIds = isStringArray(prefs.favoriteCategoryIds)
    ? prefs.favoriteCategoryIds.filter((id) => isOneOf(id, CATEGORY_IDS))
    : [];

  const bookmarks: Bookmark[] = [];
  if (Array.isArray(raw.bookmarks)) {
    const seen = new Set<string>();
    for (const entry of raw.bookmarks) {
      if (
        isRecord(entry) &&
        isNonEmptyString(entry.experienceId) &&
        !seen.has(entry.experienceId)
      ) {
        seen.add(entry.experienceId);
        bookmarks.push({
          experienceId: entry.experienceId,
          savedAt: isNonEmptyString(entry.savedAt) ? entry.savedAt : new Date(0).toISOString(),
        });
      }
    }
  }

  const progress: Record<string, ExperienceProgress> = {};
  if (isRecord(raw.progress)) {
    for (const [id, value] of Object.entries(raw.progress)) {
      const entry = sanitizeProgressEntry(id, value);
      if (entry) progress[id] = entry;
    }
  }

  const savedDiscoveries: SavedDiscovery[] = [];
  if (Array.isArray(raw.savedDiscoveries)) {
    const seen = new Set<string>();
    for (const entry of raw.savedDiscoveries) {
      if (isRecord(entry) && isNonEmptyString(entry.entityId) && !seen.has(entry.entityId)) {
        seen.add(entry.entityId);
        savedDiscoveries.push({
          entityId: entry.entityId,
          savedAt: isNonEmptyString(entry.savedAt) ? entry.savedAt : new Date(0).toISOString(),
        });
      }
    }
  }

  const exploredEntityIds = isStringArray(raw.exploredEntityIds)
    ? [...new Set(raw.exploredEntityIds)].slice(0, EXPLORED_ENTITIES_LIMIT)
    : [];

  const recentlyViewedIds = isStringArray(raw.recentlyViewedIds)
    ? [...new Set(raw.recentlyViewedIds)].slice(0, RECENTLY_VIEWED_LIMIT)
    : [];

  return {
    preferences: {
      onboardingCompleted: prefs.onboardingCompleted === true,
      favoriteCategoryIds,
      preferredDifficulty: isOneOf(prefs.preferredDifficulty, DIFFICULTIES)
        ? prefs.preferredDifficulty
        : null,
      themeId: isOneOf(prefs.themeId, THEME_IDS) ? prefs.themeId : DEFAULT_THEME_ID,
      ageBand: isOneOf(prefs.ageBand, ['6-10', '11-14'] as const) ? prefs.ageBand : null,
    },
    bookmarks,
    progress,
    recentlyViewedIds,
    savedDiscoveries,
    exploredEntityIds,
  };
}
