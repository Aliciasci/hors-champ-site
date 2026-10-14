import Link from 'next/link';

import { cultureHref } from '@/components/content/CultureCard';
import { CoverArt } from '@/components/content/CoverArt';
import { CultureThumb, Emblem } from '@/components/content/CultureThumb';
import { SavedMark } from '@/components/content/SavedMark';
import { KIND_LABELS } from '@/features/culture/cultureGraph';
import type { CultureDomain, CultureEntity } from '@/types';

import styles from './FeedItems.module.css';

export const DOMAIN_LABELS: Record<CultureDomain, string> = {
  arts: 'Arts',
  sciences: 'Sciences',
  droits: 'Droits',
};

/** Rubrique · type, comme l'en-tête d'un article. */
function kicker(entity: CultureEntity) {
  const kind = KIND_LABELS[entity.kind].singular;
  return entity.domain ? `${DOMAIN_LABELS[entity.domain]} · ${kind}` : kind;
}

/** Byline : le nom (et les dates) quand le titre est une accroche, sinon les dates seules. */
function byline(entity: CultureEntity) {
  const period = entity.period?.label;
  if (!entity.hook) return period;
  return period ? `${entity.title} · ${period}` : entity.title;
}

/**
 * Article de tête : grande image, rubrique · type, accroche (ce qu'elle a fait), nom et dates,
 * chapô. Sur grand écran, image et texte côte à côte.
 */
export function FeedLead({
  entity,
  priority = false,
}: {
  entity: CultureEntity;
  priority?: boolean;
}) {
  return (
    <Link
      href={cultureHref(entity.id)}
      className={styles.lead}
      data-testid={`feed-lead-${entity.id}`}
    >
      <span className={styles.leadMedia}>
        {entity.image ? (
          <CoverArt
            artwork={entity.image}
            offset
            priority={priority}
            sizes="(min-width: 1200px) 340px, (min-width: 900px) 320px, 100vw"
            className={styles.leadCover}
          />
        ) : (
          <Emblem entity={entity} showPeriod={false} className={styles.leadCover} />
        )}
      </span>
      <span className={styles.leadText}>
        <span className="t-overline c-accent">{kicker(entity)}</span>
        <span className={`t-title1 ${styles.title}`}>{entity.hook ?? entity.title}</span>
        {entity.hook ? <span className="t-label c-primary">{byline(entity)}</span> : null}
        <span className={`t-body c-2 ${styles.clamp3}`}>{entity.summary}</span>
        {!entity.hook && entity.period ? (
          <span className="t-caption c-muted">{entity.period.label}</span>
        ) : null}
      </span>
    </Link>
  );
}

/** Article du fil : texte à gauche, vignette à droite. */
export function FeedRow({ entity }: { entity: CultureEntity }) {
  const by = byline(entity);
  return (
    <Link href={cultureHref(entity.id)} className={styles.row} data-testid={`feed-${entity.id}`}>
      <span className={styles.rowText}>
        <span className="t-overline c-accent">{kicker(entity)}</span>
        <span className={`t-title3 ${styles.title} ${styles.clamp3}`}>
          {entity.hook ?? entity.title}
        </span>
        {entity.hook ? null : (
          <span className={`t-caption c-2 ${styles.clamp2}`}>{entity.summary}</span>
        )}
        <span className={styles.meta}>
          {by ? (
            <span className={`t-caption ${entity.hook ? 'c-primary' : 'c-muted'}`}>{by}</span>
          ) : null}
          <SavedMark entityId={entity.id} size={14} />
        </span>
      </span>
      <CultureThumb entity={entity} size={96} />
    </Link>
  );
}
