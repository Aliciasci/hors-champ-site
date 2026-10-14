import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';

import { STORAGE_KEY } from '@/constants/config';
import * as logic from '@/features/progress/progressLogic';
import {
  migratePersistedState,
  sanitizePersistedState,
  STORAGE_SCHEMA_VERSION,
} from '@/services/persistenceSchema';
import { storageService } from '@/services/storageService';
import type { ThemeId } from '@/theme/types';
import type { AgeBand, CategoryId, Difficulty, ExperienceStep, PersistedState } from '@/types';

export interface AppActions {
  completeOnboarding(preferences: {
    favoriteCategoryIds: CategoryId[];
    preferredDifficulty: Difficulty | null;
  }): void;
  /** Ferme le bandeau de bienvenue sans rien choisir (équivaut à « Passer »). */
  skipOnboarding(): void;
  setFavoriteCategories(ids: CategoryId[]): void;
  setPreferredDifficulty(difficulty: Difficulty | null): void;
  setTheme(themeId: ThemeId): void;
  /** Niveau de lecture du parcours jeunesse ; `null` pour ne pas en choisir. */
  setAgeBand(ageBand: AgeBand | null): void;
  toggleBookmark(experienceId: string): void;
  toggleDiscovery(entityId: string): void;
  recordExploration(entityId: string): void;
  recordView(experienceId: string): void;
  startExperience(experienceId: string): void;
  restartExperience(experienceId: string): void;
  goToStep(experienceId: string, step: ExperienceStep): void;
  setSelection(experienceId: string, optionIds: string[]): void;
  submitAnswer(experienceId: string, optionIds: string[]): void;
  completeExperience(experienceId: string): void;
  /** Efface favoris, progression, historique et préférences. L'onboarding n'est pas rejoué, le thème est conservé. */
  resetAllData(): void;
  /** Remplace tout l'état par des données importées (déjà nettoyées). */
  importData(state: PersistedState): void;
}

export interface AppState extends PersistedState, AppActions {
  /** Vrai une fois les données du navigateur chargées. */
  hasHydrated: boolean;
}

const now = () => new Date().toISOString();

export const pickPersisted = (state: AppState): PersistedState => ({
  preferences: state.preferences,
  bookmarks: state.bookmarks,
  progress: state.progress,
  recentlyViewedIds: state.recentlyViewedIds,
  savedDiscoveries: state.savedDiscoveries,
  exploredEntityIds: state.exploredEntityIds,
});

export function createAppStore(storage: StateStorage = storageService) {
  let markHydrated: () => void = () => undefined;

  return create<AppState>()(
    persist(
      (set) => {
        markHydrated = () => set({ hasHydrated: true });
        /** Applique une transition pure à la partie persistée de l'état. */
        const apply = (transition: (state: PersistedState) => PersistedState) =>
          set((state) => transition(pickPersisted(state)));

        return {
          ...logic.INITIAL_STATE,
          hasHydrated: false,

          completeOnboarding: ({ favoriteCategoryIds, preferredDifficulty }) =>
            apply((s) => ({
              ...s,
              preferences: {
                ...s.preferences,
                onboardingCompleted: true,
                favoriteCategoryIds,
                preferredDifficulty,
              },
            })),
          skipOnboarding: () =>
            apply((s) => ({ ...s, preferences: { ...s.preferences, onboardingCompleted: true } })),
          setFavoriteCategories: (ids) =>
            apply((s) => ({ ...s, preferences: { ...s.preferences, favoriteCategoryIds: ids } })),
          setPreferredDifficulty: (difficulty) =>
            apply((s) => ({
              ...s,
              preferences: { ...s.preferences, preferredDifficulty: difficulty },
            })),
          setTheme: (themeId) =>
            apply((s) => ({ ...s, preferences: { ...s.preferences, themeId } })),
          setAgeBand: (ageBand) =>
            apply((s) => ({ ...s, preferences: { ...s.preferences, ageBand } })),
          toggleBookmark: (id) => apply((s) => logic.toggleBookmark(s, id, now())),
          recordView: (id) => apply((s) => logic.recordView(s, id)),
          toggleDiscovery: (id) => apply((s) => logic.toggleDiscovery(s, id, now())),
          recordExploration: (id) => apply((s) => logic.recordExploration(s, id)),
          startExperience: (id) => apply((s) => logic.startExperience(s, id, now())),
          restartExperience: (id) => apply((s) => logic.restartExperience(s, id, now())),
          goToStep: (id, step) => apply((s) => logic.goToStep(s, id, step, now())),
          setSelection: (id, optionIds) =>
            apply((s) => logic.setSelection(s, id, optionIds, now())),
          submitAnswer: (id, optionIds) =>
            apply((s) => logic.submitAnswer(s, id, optionIds, now())),
          completeExperience: (id) => apply((s) => logic.completeExperience(s, id, now())),
          resetAllData: () =>
            apply((s) => ({
              ...logic.INITIAL_STATE,
              preferences: {
                ...logic.INITIAL_STATE.preferences,
                onboardingCompleted: true,
                themeId: s.preferences.themeId,
              },
            })),
          importData: (state) => apply(() => sanitizePersistedState(state)),
        };
      },
      {
        name: STORAGE_KEY,
        version: STORAGE_SCHEMA_VERSION,
        storage: createJSONStorage(() => storage),
        // Jamais de lecture pendant le rendu serveur : l'hydratation est lancée côté client
        // (voir plus bas), et les composants affichent l'état initial jusqu'à leur montage.
        skipHydration: true,
        partialize: pickPersisted,
        migrate: (persisted, version) => migratePersistedState(persisted, version),
        // Les données lues sont toujours nettoyées avant d'être fusionnées.
        // Stockage vide (première visite) : l'état courant est conservé tel quel.
        merge: (persisted, current) =>
          persisted === undefined || persisted === null
            ? current
            : { ...current, ...sanitizePersistedState(persisted) },
        // Appelé aussi en cas d'erreur (données illisibles) : le site démarre alors
        // avec l'état initial plutôt que de rester bloqué.
        onRehydrateStorage: () => (_state, error) => {
          if (error) console.warn('[storage] restauration impossible, état initial utilisé', error);
          markHydrated();
        },
      },
    ),
  );
}

export const useAppStore = createAppStore();

if (typeof window !== 'undefined') {
  // localStorage est synchrone : l'état est restauré avant le premier effet des composants,
  // donc avant toute écriture. Pendant l'hydratation React, `useAppStore` renvoie l'état
  // initial (instantané serveur) : aucune erreur d'hydratation, puis l'état réel s'affiche.
  void useAppStore.persist.rehydrate();
  // Synchronisation entre onglets.
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY || event.key === null) void useAppStore.persist.rehydrate();
  });
}
