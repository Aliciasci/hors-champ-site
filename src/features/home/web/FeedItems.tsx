import Link from 'next/link';

import { cultureHref } from '@/components/content/CultureCard';
import { CoverArt } from '@/components/content/CoverArt';
import { CultureThumb, Emblem } from '@/components/content/CultureThumb';
import { KIND_LABELS } from '@/features/culture/cultureGraph';
import { initials } from '@/lib/initials';
import type { CultureDomain, CultureEntity } from '@/types';

import styles from './FeedItems.module.css';

export const DOMAIN_LABELS: Record<CultureDomain, string> = {
  arts: 'Arts',
  sciences: 'Sciences',
  droits: 'Droits',
  sport: 'Sport',
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

/** Image d'une fiche : son œuvre, les initiales d'une femme sans portrait, sinon son emblème. */
function Media({
  entity,
  className,
  sizes,
  priority = false,
}: {
  entity: CultureEntity;
  className?: string;
  sizes: string;
  priority?: boolean;
}) {
  if (entity.image)
    return (
      <CoverArt artwork={entity.image} sizes={sizes} priority={priority} className={className} />
    );
  if (entity.kind === 'person')
    return (
      <span className={`${className ?? ''} ${styles.monogram}`} aria-hidden="true">
        {initials(entity.title)}
      </span>
    );
  return (
    <Emblem entity={entity} showPeriod={false} className={`${className ?? ''} ${styles.emblem}`} />
  );
}

/**
 * Article principal de la Une : grande image, rubrique, très grand titre, chapô sur deux
 * colonnes, signature.
 */
export function FeedFront({
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
      className={styles.front}
      data-domain={entity.domain}
      data-testid={`feed-lead-${entity.id}`}
    >
      <span className={styles.media}>
        <Media
          entity={entity}
          priority={priority}
          sizes="(min-width: 900px) 560px, 100vw"
          className={styles.frontCover}
        />
      </span>
      <span className="t-overline c-domain">{kicker(entity)}</span>
      <span className={styles.frontTitle}>{entity.hook ?? entity.title}</span>
      <span className={styles.frontDek}>{entity.summary}</span>
      <span className="t-caption c-muted">
        {byline(entity) ? <strong className={styles.name}>{byline(entity)}</strong> : null}
        {byline(entity) ? ' · ' : null}
        {minutes} min de lecture
      </span>
    </Link>
  );
}

/** Carte avec image, en tête de la deuxième colonne de la Une. */
export function FeedCard({ entity }: { entity: CultureEntity }) {
  return (
    <Link
      href={cultureHref(entity.id)}
      className={styles.card}
      data-domain={entity.domain}
      data-testid={`card-${entity.id}`}
    >
      <span className={styles.media}>
        <Media
          entity={entity}
          sizes="(min-width: 900px) 300px, 100vw"
          className={styles.cardCover}
        />
      </span>
      <span className="t-overline c-domain">{kicker(entity)}</span>
      <span className={styles.cardTitle}>{entity.hook ?? entity.title}</span>
      {byline(entity) ? <span className="t-caption c-muted">{byline(entity)}</span> : null}
    </Link>
  );
}

/** Article en texte seul : rubrique, titre, chapô court (selon le bloc), signature. */
export function FeedText({ entity }: { entity: CultureEntity }) {
  return (
    <Link
      href={cultureHref(entity.id)}
      className={styles.text}
      data-domain={entity.domain}
      data-testid={`feed-${entity.id}`}
    >
      <span className="t-overline c-domain">{kicker(entity)}</span>
      <span className={styles.textTitle}>{entity.hook ?? entity.title}</span>
      <span className={styles.textDek}>{entity.summary}</span>
      {byline(entity) ? <span className="t-caption c-muted">{byline(entity)}</span> : null}
    </Link>
  );
}

/** Brève « En bref » : vignette, rubrique, titre. */
export function FeedBrief({ entity }: { entity: CultureEntity }) {
  return (
    <Link
      href={cultureHref(entity.id)}
      className={styles.brief}
      data-domain={entity.domain}
      data-testid={`brief-${entity.id}`}
    >
      <CultureThumb entity={entity} size={56} />
      <span className={styles.briefText}>
        <span className="t-overline c-domain">
          {entity.domain ? DOMAIN_LABELS[entity.domain] : KIND_LABELS[entity.kind].singular}
        </span>
        <span className={styles.briefTitle}>{entity.hook ?? entity.title}</span>
      </span>
    </Link>
  );
}

/** Brève de la colonne de côté : vignette, type et date, titre. */
export function FeedSideRow({ entity }: { entity: CultureEntity }) {
  const meta = [KIND_LABELS[entity.kind].singular, entity.period?.label].filter(Boolean);
  return (
    <Link
      href={cultureHref(entity.id)}
      className={styles.side}
      data-domain={entity.domain}
      data-testid={`side-${entity.id}`}
    >
      <CultureThumb entity={entity} size={56} />
      <span className={styles.sideText}>
        <span className="t-overline c-domain">{meta.join(' · ')}</span>
        <span className={styles.sideTitle}>{entity.hook ?? entity.title}</span>
      </span>
    </Link>
  );
}
