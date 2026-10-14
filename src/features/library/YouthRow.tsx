import Link from 'next/link';

import { CoverArt } from '@/components/content/CoverArt';
import { SavedMark } from '@/components/content/SavedMark';
import { Briefcase, Puzzle, UserRound } from '@/components/icons';
import type { SlimYouth } from '@/content/slim';

import styles from './Library.module.css';

export const YOUTH_KIND_LABELS: Record<SlimYouth['kind'], string> = {
  career: 'Métier',
  portrait: 'Portrait',
  activity: 'Activité',
};

const ICONS = { career: Briefcase, portrait: UserRound, activity: Puzzle };

/** Métier, portrait ou activité de « Tout est possible » enregistré. */
export function YouthRow({ item }: { item: SlimYouth }) {
  const Icon = ICONS[item.kind];
  return (
    <Link
      href={`/possible/${item.id}`}
      className={styles.youthRow}
      data-tone="ocre"
      data-testid={`library-youth-${item.id}`}
    >
      {item.image ? (
        <span className={styles.youthThumb}>
          <CoverArt artwork={item.image} sizes="64px" className={styles.fill} />
        </span>
      ) : (
        <span className={`${styles.youthThumb} ${styles.youthGlyph}`} aria-hidden="true">
          <Icon size={24} strokeWidth={2} />
        </span>
      )}
      <span className={styles.youthText}>
        <span className="t-overline c-domain">
          Tout est possible · {YOUTH_KIND_LABELS[item.kind]}
        </span>
        <span className={`t-title3 ${styles.rowTitle}`}>{item.title}</span>
      </span>
      <SavedMark entityId={item.id} size={18} />
    </Link>
  );
}
