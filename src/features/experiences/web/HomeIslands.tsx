'use client';

import Link from 'next/link';
import { useMemo } from 'react';

import { ContentCard } from '@/components/content/ContentCard';
import { ExperienceBookmarkButton } from '@/components/content/SaveButtons';
import { ArrowRight, Compass, Play } from '@/components/icons';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { pickFeaturedExperience, recentlyStarted } from '@/features/home/homeSelectors';
import { computeProgressSummary, findLastInProgress } from '@/features/progress/progressLogic';
import { useAppStore } from '@/store/useAppStore';
import type { Category, CategoryId, Experience } from '@/types';

import styles from './Home.module.css';
import { detailHref, playHref } from './routes';

interface Props {
  experiences: Experience[];
  categories: Category[];
}

const byId = (categories: Category[]) => new Map(categories.map((c) => [c.id, c]));

/** « Reprendre là où vous en étiez » : visible seulement s'il y a un contrechamp en cours. */
export function ResumeBanner({ experiences }: { experiences: Experience[] }) {
  const progress = useAppStore((s) => s.progress);
  const last = findLastInProgress(progress, new Set(experiences.map((e) => e.id)));
  const experience = last ? experiences.find((e) => e.id === last.experienceId) : undefined;
  if (!experience) return null;
  return (
    <Link href={playHref(experience.id)} className={styles.resume} data-testid="experiences-resume">
      <span className={styles.resumeIcon} aria-hidden="true">
        <Play size={20} fill="currentColor" />
      </span>
      <span className={styles.resumeText}>
        <span className="t-overline">Reprendre là où vous en étiez</span>
        <span className="t-title3">{experience.title}</span>
      </span>
      <ArrowRight size={22} aria-hidden="true" />
    </Link>
  );
}

/** Le contrechamp du moment : selon les préférences, en privilégiant ceux pas encore faits. */
export function FeaturedExperience({ experiences, categories }: Props) {
  const progress = useAppStore((s) => s.progress);
  const preferences = useAppStore((s) => s.preferences);
  const featured = pickFeaturedExperience(experiences, progress, preferences);
  if (!featured) return null;
  return (
    <section className={styles.section} aria-labelledby="featured-title">
      <SectionHeader kicker="À découvrir" title="Le contrechamp du moment" id="featured-title" />
      <div className={styles.featured}>
        <ContentCard
          variant="feature"
          experience={featured}
          category={byId(categories).get(featured.categoryId)}
          testId="experiences-featured"
        />
        <div className={styles.featuredBookmark}>
          <ExperienceBookmarkButton experienceId={featured.id} />
        </div>
      </div>
    </section>
  );
}

/** Mention « Thème favori » sur une tuile (après hydratation). */
export function FavoriteMark({ categoryId }: { categoryId: CategoryId }) {
  const favorite = useAppStore((s) => s.preferences.favoriteCategoryIds.includes(categoryId));
  return favorite ? <span className="t-caption c-accent">Thème favori</span> : null;
}

export function RecentExperiences({ experiences, categories }: Props) {
  const progress = useAppStore((s) => s.progress);
  const preferences = useAppStore((s) => s.preferences);
  const recent = recentlyStarted(experiences, progress);
  const featured = pickFeaturedExperience(experiences, progress, preferences);
  const categoryById = useMemo(() => byId(categories), [categories]);
  return (
    <section className={styles.section} aria-labelledby="recent-title">
      <SectionHeader kicker="Votre parcours" title="Récemment ouverts" id="recent-title" />
      {recent.length === 0 ? (
        <EmptyState
          icon={Compass}
          headingLevel={3}
          title="Rien de commencé pour l’instant"
          description="Les contrechamps que vous ouvrez apparaîtront ici, prêts à être repris."
          actions={
            featured ? (
              <ButtonLink href={detailHref(featured.id)} variant="secondary">
                Commencer par celui-ci
              </ButtonLink>
            ) : null
          }
        />
      ) : (
        <ul>
          {recent.map((experience, index) => (
            <li key={experience.id}>
              <ContentCard
                variant="compact"
                index={index}
                experience={experience}
                category={categoryById.get(experience.categoryId)}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/** Carte de progression vers le Profil : ni note, ni comparaison. */
export function ProgressCard({ experiences, categories }: Props) {
  const progress = useAppStore((s) => s.progress);
  const summary = computeProgressSummary(progress, experiences, categories);
  return (
    <Link href="/profil" className={styles.progressCard} data-testid="experiences-progress">
      <span className="t-overline">Votre exploration</span>
      <span className="t-title2">
        {summary.completedCount} sur {summary.totalCount}{' '}
        {summary.totalCount > 1 ? 'contrechamps terminés' : 'contrechamp terminé'}
      </span>
      <progress
        className={styles.progress}
        value={summary.completedCount}
        max={Math.max(summary.totalCount, 1)}
        aria-label="Contrechamps terminés"
      />
      <span className={styles.progressFooter}>
        <span className="t-body-sm c-2">
          Thèmes explorés : {summary.exploredCategoryIds.length} sur {categories.length}
        </span>
        <span className={`t-label c-primary ${styles.more}`}>
          Voir le détail
          <ArrowRight size={18} aria-hidden="true" />
        </span>
      </span>
    </Link>
  );
}
