import { hasCompleted, isInProgress } from '@/features/progress/progressLogic';
import type { Bookmark, Experience, ExperienceProgress } from '@/types';

export type LibrarySection = 'saved' | 'in-progress' | 'completed';

/**
 * Contenu d'une section de la bibliothèque. Les identifiants qui ne correspondent
 * plus à une expérience du catalogue sont ignorés silencieusement.
 */
export function selectLibrarySection(
  section: LibrarySection,
  experiences: readonly Experience[],
  bookmarks: readonly Bookmark[],
  progress: Record<string, ExperienceProgress>,
): Experience[] {
  const byId = new Map(experiences.map((experience) => [experience.id, experience]));

  if (section === 'saved') {
    // Ordre : la plus récemment enregistrée en premier.
    return [...bookmarks]
      .sort((a, b) => b.savedAt.localeCompare(a.savedAt))
      .map((bookmark) => byId.get(bookmark.experienceId))
      .filter((experience): experience is Experience => experience !== undefined);
  }

  const matches = section === 'in-progress' ? isInProgress : hasCompleted;
  const sortKey = (entry: ExperienceProgress | undefined) =>
    (section === 'completed' ? entry?.firstCompletedAt : entry?.updatedAt) ?? '';

  return experiences
    .filter((experience) => matches(progress[experience.id]))
    .sort((a, b) => sortKey(progress[b.id]).localeCompare(sortKey(progress[a.id])));
}
