import { CoverArt } from '@/components/content/CoverArt';
import { Briefcase, Compass, Puzzle, UserRound, type LucideIcon } from '@/components/icons';
import type { Artwork, YouthItem } from '@/types';

import styles from './youth.module.css';

export type YouthKind = YouthItem['kind'] | 'life';

export const YOUTH_KIND_LABELS: Record<YouthKind, string> = {
  career: 'Métier',
  portrait: 'Portrait',
  activity: 'Activité',
  life: 'Collection',
};

const ICONS: Record<YouthKind, LucideIcon> = {
  career: Briefcase,
  portrait: UserRound,
  activity: Puzzle,
  life: Compass,
};

export const youthHref = (id: string) => `/possible/${id}`;

/** Vignette : l'image si elle existe, sinon l'icône du type (couleur doublée d'une icône). */
export function YouthThumb({
  kind,
  image,
  size,
  fluid = false,
}: {
  kind: YouthKind;
  image?: Artwork;
  size: number;
  /** Occupe toute la largeur disponible (carré). */
  fluid?: boolean;
}) {
  const box = fluid ? { width: '100%', aspectRatio: '1 / 1' } : { width: size, height: size };
  if (image) {
    return (
      <div className={styles.thumb} style={box}>
        <CoverArt
          artwork={image}
          sizes={fluid ? `(min-width: 900px) 220px, ${size}px` : `${size}px`}
          className={styles.fill}
        />
      </div>
    );
  }
  const Icon = ICONS[kind];
  return (
    <div
      className={`${styles.thumb} ${styles.glyph} ${styles[kind]}`}
      style={box}
      aria-hidden="true"
    >
      <Icon size={Math.round(size * 0.4)} strokeWidth={2} />
    </div>
  );
}
