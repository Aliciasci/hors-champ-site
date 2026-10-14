import Link from 'next/link';

import { KIND_LABELS } from '@/features/culture/cultureGraph';
import type { CultureEntity } from '@/types';

import styles from './CultureCard.module.css';
import { CultureThumb } from './CultureThumb';
import { SavedMark } from './SavedMark';

export const cultureHref = (id: string) => `/culture/${id}`;

/** Fiche culturelle en liste : vignette, type, titre, précision. La carte entière est un lien. */
export function CultureCard({
  entity,
  context,
  hidePeriod,
  layout = 'row',
  testId,
}: {
  entity: CultureEntity;
  /** Précision affichée sous le titre (ex. nature du lien), à la place du sous-titre. */
  context?: string;
  hidePeriod?: boolean;
  /** `row` : rangée de liste ; `tile` : tuile de grille, grande vignette. */
  layout?: 'row' | 'tile';
  testId?: string;
}) {
  const kind = KIND_LABELS[entity.kind].singular;
  const detail = context ?? entity.subtitle;
  return (
    <Link
      href={cultureHref(entity.id)}
      className={`${styles.card} ${layout === 'tile' ? styles.tile : styles.row}`}
      data-testid={testId}
    >
      <CultureThumb entity={entity} size={layout === 'tile' ? 72 : 64} />
      <span className={styles.text}>
        <span className="t-overline c-accent">
          {kind}
          {entity.period && !hidePeriod ? ` · ${entity.period.label}` : ''}
        </span>
        <span className={`t-title3 ${styles.title}`}>{entity.title}</span>
        {detail ? <span className={`t-caption c-2 ${styles.detail}`}>{detail}</span> : null}
      </span>
      <SavedMark entityId={entity.id} size={18} />
    </Link>
  );
}
