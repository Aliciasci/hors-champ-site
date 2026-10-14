'use client';

import { CircleCheck, CircleDot, Clock3 } from '@/components/icons';
import { CONTENT_TYPE_LABELS, DIFFICULTY_LABELS } from '@/constants/labels';
import { hasCompleted, isInProgress } from '@/features/progress/progressLogic';
import { useAppStore } from '@/store/useAppStore';
import type { Experience } from '@/types';
import { formatMinutes } from '@/utils/text';

import styles from './ExperienceMeta.module.css';

/** Statut personnel d'un contrechamp (icône + texte, jamais la couleur seule). Vide avant hydratation. */
export function ExperienceStatus({ experienceId }: { experienceId: string }) {
  const progress = useAppStore((s) => s.progress[experienceId]);
  if (hasCompleted(progress)) {
    return (
      <span className={`${styles.item} ${styles.done}`}>
        <CircleCheck size={14} strokeWidth={2.5} aria-hidden="true" />
        Terminé
      </span>
    );
  }
  if (isInProgress(progress)) {
    return (
      <span className={`${styles.item} ${styles.current}`}>
        <CircleDot size={14} strokeWidth={2.5} aria-hidden="true" />
        En cours
      </span>
    );
  }
  return null;
}

/** Ligne de métadonnées : durée, format, niveau, statut personnel. */
export function ExperienceMeta({ experience }: { experience: Experience }) {
  return (
    <span className={`${styles.row} t-caption c-2`}>
      <span className={styles.item}>
        <Clock3 size={14} strokeWidth={2.25} aria-hidden="true" />
        {formatMinutes(experience.estimatedMinutes)}
      </span>
      <span>{CONTENT_TYPE_LABELS[experience.contentType]}</span>
      <span>{DIFFICULTY_LABELS[experience.difficulty]}</span>
      <ExperienceStatus experienceId={experience.id} />
    </span>
  );
}
