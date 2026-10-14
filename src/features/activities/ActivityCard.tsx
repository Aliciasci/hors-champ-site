import Link from 'next/link';

import { youthHref } from '@/features/youth/web/YouthThumb';
import type { ActivityKind, Tone } from '@/types';

import styles from './Activities.module.css';

export const ACTIVITY_KIND_LABELS: Record<ActivityKind, string> = {
  riddle: 'Énigme',
  observe: 'Observation',
  design: 'Invention',
  build: 'Bricolage',
};

/** Une teinte par type d'activité. */
const ACTIVITY_KIND_TONES: Record<ActivityKind, Tone> = {
  riddle: 'arts',
  observe: 'sciences',
  design: 'droits',
  build: 'ocre',
};

/** Activité jeunesse : la durée en grand, le type, le titre, le matériel. */
export function ActivityCard({
  id,
  kind,
  title,
  minutes,
  withMaterials,
}: {
  id: string;
  kind: ActivityKind;
  title: string;
  minutes: number;
  withMaterials: boolean;
}) {
  return (
    <Link
      href={youthHref(id)}
      className={styles.activity}
      data-tone={ACTIVITY_KIND_TONES[kind]}
      data-testid={`activity-${id}`}
    >
      <span className={styles.minutes}>
        {minutes}
        <span className={styles.unit}>min</span>
      </span>
      <span className="t-overline c-domain">{ACTIVITY_KIND_LABELS[kind]}</span>
      <span className={`t-title3 ${styles.title}`}>{title}</span>
      <span className={`t-caption c-2 ${styles.needs}`}>
        {withMaterials ? 'Avec un peu de matériel' : 'Sur le site'}
      </span>
    </Link>
  );
}
