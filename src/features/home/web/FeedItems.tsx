import Link from 'next/link';

import { cultureHref } from '@/components/content/CultureCard';
import { CoverArt } from '@/components/content/CoverArt';
import { Emblem } from '@/components/content/CultureThumb';
import { StoryRow } from '@/components/content/StoryRow';
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
  minutes,
  priority = false,
}: {
  entity: CultureEntity;
  minutes: number;
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
        <span className={`t-deck ${styles.clamp3}`}>{entity.summary}</span>
        <span className="t-caption c-muted">
          {[byline(entity), `${minutes} min de lecture`].filter(Boolean).join(' · ')}
        </span>
      </span>
    </Link>
  );
}

/** Article du fil : texte à gauche, vignette à droite. */
export function FeedRow({ entity, minutes }: { entity: CultureEntity; minutes: number }) {
  return (
    <StoryRow
      entity={entity}
      kicker={kicker(entity)}
      minutes={minutes}
      testId={`feed-${entity.id}`}
    />
  );
}
