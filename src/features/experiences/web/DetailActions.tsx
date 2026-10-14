'use client';

import { useRouter } from 'next/navigation';

import { ArrowRight, RotateCcw } from '@/components/icons';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { hasCompleted, isInProgress } from '@/features/progress/progressLogic';
import { useAppStore } from '@/store/useAppStore';

import styles from './Detail.module.css';
import { analysisHref, playHref } from './routes';

/**
 * Actions selon la progression locale. Pré-rendu : « Commencer » ; après hydratation :
 * Reprendre + Recommencer, ou Revoir l'analyse + Recommencer.
 */
export function DetailActions({ experienceId }: { experienceId: string }) {
  const router = useRouter();
  const progress = useAppStore((s) => s.progress[experienceId]);
  const restartExperience = useAppStore((s) => s.restartExperience);
  const restart = () => {
    restartExperience(experienceId);
    router.push(`${playHref(experienceId)}?etape=1`);
  };

  if (isInProgress(progress)) {
    return (
      <div className={styles.actions}>
        <ButtonLink href={playHref(experienceId)} icon={ArrowRight} data-testid="detail-resume">
          Reprendre
        </ButtonLink>
        <Button
          variant="secondary"
          icon={RotateCcw}
          iconPosition="start"
          onClick={restart}
          data-testid="detail-restart"
        >
          Recommencer
        </Button>
      </div>
    );
  }
  if (hasCompleted(progress)) {
    return (
      <div className={styles.actions}>
        <ButtonLink
          href={analysisHref(experienceId)}
          variant="secondary"
          data-testid="detail-analysis"
        >
          Revoir l’analyse
        </ButtonLink>
        <Button
          icon={RotateCcw}
          iconPosition="start"
          onClick={restart}
          data-testid="detail-restart"
        >
          Recommencer
        </Button>
      </div>
    );
  }
  return (
    <div className={styles.actions}>
      <ButtonLink
        href={playHref(experienceId)}
        variant="accent"
        icon={ArrowRight}
        data-testid="detail-start"
      >
        Commencer
      </ButtonLink>
    </div>
  );
}

/** Pastille « Déjà terminé » (après hydratation). */
export function CompletedTag({ experienceId }: { experienceId: string }) {
  const completed = useAppStore((s) => hasCompleted(s.progress[experienceId]));
  return completed ? <Tag tone="solid">Déjà terminé</Tag> : null;
}
