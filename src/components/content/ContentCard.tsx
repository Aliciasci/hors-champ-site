import Link from 'next/link';

import type { Category, Experience } from '@/types';

import styles from './ContentCard.module.css';
import { CoverArt } from './CoverArt';
import { ExperienceMeta } from './ExperienceMeta';

export const experienceHref = (id: string) => `/contrechamps/${id}`;

/**
 * Carte de contrechamp. La carte entière est un seul lien.
 * - `standard` : couverture + texte, pour les grilles ;
 * - `compact` : rangée horizontale, pour les listes ;
 * - `feature` : grande carte de mise en avant (numéro de cartel dans Cartel).
 */
export function ContentCard({
  experience,
  category,
  variant = 'standard',
  index = 0,
  href,
  eager = false,
  testId,
}: {
  experience: Experience;
  category?: Category;
  variant?: 'standard' | 'compact' | 'feature';
  index?: number;
  /** Destination, si différente du détail (reprise, analyse). */
  href?: string;
  /** Image visible dès l'arrivée (premières cartes d'une grille) : chargée en priorité. */
  eager?: boolean;
  testId?: string;
}) {
  const tone = (index % 3) as 0 | 1 | 2;
  const motif = category?.motif ?? 'circles';
  const target = href ?? experienceHref(experience.id);

  if (variant === 'compact') {
    return (
      <Link href={target} className={`${styles.card} ${styles.compact}`} data-testid={testId}>
        <CoverArt
          motif={motif}
          tone={tone}
          image={experience.coverImage}
          artwork={category?.artwork}
          sizes="80px"
          className={styles.compactCover}
        />
        <span className={styles.text}>
          {category ? <span className="t-overline c-accent">{category.shortTitle}</span> : null}
          <span className={`t-title3 ${styles.title}`}>{experience.title}</span>
          <ExperienceMeta experience={experience} />
        </span>
      </Link>
    );
  }

  if (variant === 'feature') {
    return (
      <Link href={target} className={`${styles.card} ${styles.feature}`} data-testid={testId}>
        <CoverArt
          motif={motif}
          tone={1}
          image={experience.coverImage}
          artwork={category?.artwork}
          offset
          sizes="(min-width: 900px) 560px, 100vw"
          className={styles.featureCover}
        />
        <span className={styles.featureBody}>
          <span className={`t-mono c-accent only-cartel ${styles.number}`}>
            N° {String(index + 1).padStart(2, '0')}
          </span>
          <span className={styles.text}>
            {category ? <span className="t-overline c-muted">{category.title}</span> : null}
            <span className={`t-title1 ${styles.title}`}>{experience.title}</span>
            <span className="t-body c-2">{experience.shortDescription}</span>
            <ExperienceMeta experience={experience} />
          </span>
        </span>
      </Link>
    );
  }

  return (
    <Link href={target} className={`${styles.card} ${styles.standard}`} data-testid={testId}>
      <CoverArt
        motif={motif}
        tone={tone}
        image={experience.coverImage}
        artwork={category?.artwork}
        sizes="(min-width: 1200px) 360px, (min-width: 600px) 50vw, 100vw"
        eager={eager}
        className={styles.standardCover}
      />
      <span className={styles.standardBody}>
        {category ? <span className="t-overline c-accent">{category.shortTitle}</span> : null}
        <span className={`t-title2 ${styles.title}`}>{experience.title}</span>
        <span className="t-body-sm c-2">{experience.shortDescription}</span>
        <ExperienceMeta experience={experience} />
      </span>
    </Link>
  );
}
