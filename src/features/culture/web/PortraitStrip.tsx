import Link from 'next/link';

import { CultureThumb } from '@/components/content/CultureThumb';
import { cultureHref } from '@/components/content/CultureCard';
import type { CultureEntity } from '@/types';

import styles from './PortraitStrip.module.css';

/** Rangée défilante de portraits, chacun menant à sa fiche. */
export function PortraitStrip({
  people,
  size = 112,
  label,
  testIdPrefix = 'portrait',
}: {
  people: CultureEntity[];
  size?: number;
  label: string;
  testIdPrefix?: string;
}) {
  return (
    <ul className={styles.strip} aria-label={label}>
      {people.map((person) => (
        <li key={person.id} style={{ width: size }} className={styles.item}>
          <Link
            href={cultureHref(person.id)}
            className={styles.link}
            data-testid={`${testIdPrefix}-${person.id}`}
          >
            <CultureThumb entity={person} size={size} />
            <span className={`t-label ${styles.name}`}>{person.title}</span>
            {person.period ? <span className="t-caption c-2">{person.period.label}</span> : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}
