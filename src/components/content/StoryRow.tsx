import Link from 'next/link';

import type { CultureEntity } from '@/types';

import { cultureHref } from './CultureCard';
import { CultureThumb } from './CultureThumb';
import { SavedMark } from './SavedMark';
import styles from './StoryRow.module.css';

/**
 * Article en liste, à la manière d'une newsletter : rubrique, titre, chapeau sur deux lignes,
 * signature (nom, dates, temps de lecture) et vignette à droite. La rangée entière est un lien.
 */
export function StoryRow({
  entity,
  kicker,
  minutes,
  testId,
}: {
  entity: CultureEntity;
  /** Rubrique, ou nature du lien vu depuis une autre fiche. */
  kicker?: string;
  minutes?: number;
  testId?: string;
}) {
  // Quand le titre est une accroche, le nom passe dans la signature.
  const title = entity.hook ?? entity.title;
  const dek = entity.hook ? entity.summary : (entity.subtitle ?? entity.summary);
  const meta = [entity.period?.label, minutes ? `${minutes} min` : null].filter(Boolean);
  return (
    <Link
      href={cultureHref(entity.id)}
      className={styles.row}
      data-domain={entity.domain}
      data-testid={testId}
    >
      <span className={styles.text}>
        {kicker ? <span className="t-overline c-domain">{kicker}</span> : null}
        <span className={`t-title3 ${styles.title}`}>{title}</span>
        <span className={`t-body-sm c-2 ${styles.dek}`}>{dek}</span>
        <span className={styles.metaRow}>
          <span className={`t-caption c-muted ${styles.meta}`}>
            {entity.hook ? <span className={styles.name}>{entity.title}</span> : null}
            {meta.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </span>
          <SavedMark entityId={entity.id} size={14} />
        </span>
      </span>
      <span className={styles.thumbFrame}>
        <CultureThumb entity={entity} size={96} />
      </span>
    </Link>
  );
}
