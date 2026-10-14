import Link from 'next/link';

import type { Artwork, Leveled } from '@/types';

import { Lv } from './Leveled';
import styles from './youth.module.css';
import { YOUTH_KIND_LABELS, YouthThumb, youthHref, type YouthKind } from './YouthThumb';

/** Carte de la rubrique : grande vignette, type, titre, une ligne. La carte entière est un lien. */
export function YouthTile({
  id,
  kind,
  title,
  line,
  image,
}: {
  id: string;
  kind: YouthKind;
  title: string;
  line?: string | Leveled;
  image?: Artwork;
}) {
  return (
    <Link
      href={youthHref(id)}
      className={styles.tile}
      data-tone="ocre"
      data-testid={`possible-${id}`}
    >
      <YouthThumb kind={kind} image={image} size={148} fluid />
      <span className="t-overline c-domain">{YOUTH_KIND_LABELS[kind]}</span>
      <span className={`t-title3 ${styles.tileTitle}`}>{title}</span>
      {line ? (
        typeof line === 'string' ? (
          <span className={`t-caption c-2 ${styles.tileLine}`}>{line}</span>
        ) : (
          <Lv text={line} className={`t-caption c-2 ${styles.tileLine}`} />
        )
      ) : null}
    </Link>
  );
}

/** Carte en liste : vignette, type, titre, une ligne. */
export function YouthCard({
  id,
  kind,
  title,
  line,
  image,
}: {
  id: string;
  kind: YouthKind;
  title: string;
  line?: string | Leveled;
  image?: Artwork;
}) {
  return (
    <Link
      href={youthHref(id)}
      className={styles.youthCard}
      data-tone="ocre"
      data-testid={`youth-ref-${id}`}
    >
      <YouthThumb kind={kind} image={image} size={64} />
      <span className={styles.youthCardText}>
        <span className="t-overline c-domain">Tout est possible · {YOUTH_KIND_LABELS[kind]}</span>
        <span className={`t-title3 ${styles.tileTitle}`}>{title}</span>
        {line ? (
          typeof line === 'string' ? (
            <span className="t-caption c-2">{line}</span>
          ) : (
            <Lv text={line} className="t-caption c-2" />
          )
        ) : null}
      </span>
    </Link>
  );
}
