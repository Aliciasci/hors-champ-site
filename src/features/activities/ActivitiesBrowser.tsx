'use client';

import type { ReactNode } from 'react';

import { Segmented } from '@/components/ui/Chip';
import { readOne, useQueryState } from '@/lib/useQueryState';

import styles from './Activities.module.css';

type Audience = 'tous' | 'adultes' | 'jeunes';

const OPTIONS: { id: Audience; label: string }[] = [
  { id: 'tous', label: 'Tout le monde' },
  { id: 'adultes', label: 'Ados et adultes' },
  { id: 'jeunes', label: '6 – 14 ans' },
];

interface Props {
  /** Bloc contrechamps (ados et adultes), rendu côté serveur. */
  adults: ReactNode;
  /** Bloc « Tout est possible » (6-14 ans), rendu côté serveur. */
  kids: ReactNode;
  withUrl?: boolean;
}

/** « Pour qui ? » : affiche les activités des ados et adultes, des 6-14 ans, ou les deux. */
export function ActivitiesBrowser(props: Props) {
  return props.withUrl ? <WithUrl {...props} /> : <View {...props} audience="tous" />;
}

function WithUrl(props: Props) {
  const { params, set } = useQueryState();
  const audience = readOne<Audience>(params.get('pour'), ['tous', 'adultes', 'jeunes'], 'tous');
  return (
    <View
      {...props}
      audience={audience}
      onAudience={(a) => set({ pour: a === 'tous' ? null : a })}
    />
  );
}

function View({
  adults,
  kids,
  audience,
  onAudience,
}: Props & { audience: Audience; onAudience?: (a: Audience) => void }) {
  return (
    <>
      <div className={styles.filter}>
        <span className="t-overline c-2" aria-hidden="true">
          Pour qui ?
        </span>
        <Segmented
          legend="Pour qui ?"
          name="pour"
          options={OPTIONS}
          value={audience}
          onChange={(a) => onAudience?.(a)}
          testIdPrefix="activities-for"
        />
      </div>
      <div className={styles.sections}>
        {audience !== 'jeunes' ? adults : null}
        {audience !== 'adultes' ? kids : null}
      </div>
    </>
  );
}
