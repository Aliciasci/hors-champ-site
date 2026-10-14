'use client';

import { Bookmark } from '@/components/icons';
import { Button } from '@/components/ui/Button';
import { isBookmarked, isDiscoverySaved } from '@/features/progress/progressLogic';
import { useAppStore } from '@/store/useAppStore';

import styles from './SaveButtons.module.css';

/**
 * Signet d'une découverte (fiche culturelle, métier, portrait, activité) : `aria-pressed`.
 * `full` : grand bouton « Enregistrer la découverte » ; sinon bouton icône.
 */
export function DiscoveryButton({ entityId, full = false }: { entityId: string; full?: boolean }) {
  const saved = useAppStore((s) => isDiscoverySaved(s, entityId));
  const toggle = useAppStore((s) => s.toggleDiscovery);
  if (full) {
    return (
      <Button
        variant={saved ? 'secondary' : 'primary'}
        icon={Bookmark}
        iconPosition="start"
        aria-pressed={saved}
        onClick={() => toggle(entityId)}
        data-testid="discovery-save"
        className={saved ? styles.savedFull : undefined}
      >
        {saved ? 'Découverte enregistrée' : 'Enregistrer la découverte'}
      </Button>
    );
  }
  return (
    <button
      type="button"
      className={`${styles.icon} ${saved ? styles.on : ''}`}
      aria-pressed={saved}
      aria-label="Enregistrer dans vos découvertes"
      onClick={() => toggle(entityId)}
      data-testid="discovery-save-icon"
    >
      <Bookmark
        size={20}
        strokeWidth={2}
        fill={saved ? 'currentColor' : 'none'}
        aria-hidden="true"
      />
    </button>
  );
}

/** Signet d'un contrechamp (favoris de la bibliothèque). */
export function ExperienceBookmarkButton({
  experienceId,
  full = false,
}: {
  experienceId: string;
  full?: boolean;
}) {
  const saved = useAppStore((s) => isBookmarked(s.bookmarks, experienceId));
  const toggle = useAppStore((s) => s.toggleBookmark);
  if (full) {
    return (
      <Button
        variant="secondary"
        icon={Bookmark}
        iconPosition="start"
        aria-pressed={saved}
        onClick={() => toggle(experienceId)}
        data-testid="experience-bookmark"
      >
        {saved ? 'Enregistré' : 'Enregistrer'}
      </Button>
    );
  }
  return (
    <button
      type="button"
      className={`${styles.icon} ${saved ? styles.on : ''}`}
      aria-pressed={saved}
      aria-label="Enregistrer dans la bibliothèque"
      onClick={() => toggle(experienceId)}
      data-testid="experience-bookmark-icon"
    >
      <Bookmark
        size={20}
        strokeWidth={2}
        fill={saved ? 'currentColor' : 'none'}
        aria-hidden="true"
      />
    </button>
  );
}
