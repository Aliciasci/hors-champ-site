import type { ThemeId } from '@/theme/types';

import type { CategoryId, Difficulty } from './content';
import type { SavedDiscovery } from './culture';
import type { AgeBand } from './youth';

/** Étapes du parcours interactif d'une expérience. */
export type ExperienceStep = 'scenario' | 'question' | 'feedback';

export const EXPERIENCE_STEPS: readonly ExperienceStep[] = ['scenario', 'question', 'feedback'];

export interface ExperienceProgress {
  experienceId: string;
  status: 'in-progress' | 'completed';
  currentStep: ExperienceStep;
  /** Sélection en cours, avant validation. */
  selectedOptionIds: string[];
  /** Réponse validée lors de la tentative en cours, `null` tant qu'elle n'est pas validée. */
  submittedOptionIds: string[] | null;
  startedAt: string;
  updatedAt: string;
  /** Réponse de la dernière tentative terminée : l'analyse reste consultable après « Recommencer ». */
  lastCompletedOptionIds: string[] | null;
  /** Première date de complétion : conservée si l'expérience est recommencée. */
  firstCompletedAt: string | null;
  completedCount: number;
}

export interface Bookmark {
  experienceId: string;
  savedAt: string;
}

export interface Preferences {
  onboardingCompleted: boolean;
  favoriteCategoryIds: CategoryId[];
  preferredDifficulty: Difficulty | null;
  /** Direction artistique choisie par l'utilisatrice. */
  themeId: ThemeId;
  /** Niveau de lecture de « Tout est possible » : facultatif, modifiable, stocké localement. */
  ageBand: AgeBand | null;
}

/** Forme des données persistées sur l'appareil. */
export interface PersistedState {
  preferences: Preferences;
  bookmarks: Bookmark[];
  progress: Record<string, ExperienceProgress>;
  /** Identifiants des expériences consultées, la plus récente en premier. */
  recentlyViewedIds: string[];
  /** Découvertes culturelles enregistrées dans la bibliothèque. */
  savedDiscoveries: SavedDiscovery[];
  /** Fiches culturelles ouvertes, la plus récente en premier (sans doublon). */
  exploredEntityIds: string[];
}
