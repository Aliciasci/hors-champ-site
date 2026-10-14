import type { CultureEntity } from '@/types';

import { CoverArt } from './CoverArt';
import styles from './CultureThumb.module.css';
import { KIND_ICONS, kindClass } from './kinds';

/** Vignette carrée d'une fiche : l'œuvre qui l'illustre, sinon l'icône de son type. */
export function CultureThumb({ entity, size }: { entity: CultureEntity; size: number }) {
  if (entity.image) {
    return (
      <div className={styles.thumb} style={{ width: size, height: size }}>
        <CoverArt artwork={entity.image} sizes={`${size}px`} className={styles.fill} />
      </div>
    );
  }
  const Icon = KIND_ICONS[entity.kind];
  return (
    <div
      className={`${styles.thumb} ${styles.glyph} ${kindClass(entity.kind)}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <Icon size={Math.round(size * 0.38)} strokeWidth={2} />
    </div>
  );
}

/** Grand emblème coloré (fiche sans image), avec la date pour les événements. */
export function Emblem({
  entity,
  className,
  showPeriod = true,
}: {
  entity: CultureEntity;
  className?: string;
  showPeriod?: boolean;
}) {
  const Icon = KIND_ICONS[entity.kind];
  return (
    <div
      className={`${styles.emblem} ${kindClass(entity.kind)} ${className ?? ''}`}
      aria-hidden="true"
    >
      <Icon size={48} strokeWidth={1.75} />
      {showPeriod && entity.period ? (
        <p className={`t-hero ${styles.period}`}>{entity.period.label}</p>
      ) : null}
    </div>
  );
}
