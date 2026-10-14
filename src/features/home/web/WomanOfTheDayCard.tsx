import Link from 'next/link';

import { cultureHref } from '@/components/content/CultureCard';
import { CultureThumb } from '@/components/content/CultureThumb';
import type { CultureEntity } from '@/types';

import styles from './WomanOfTheDay.module.css';

/** Bandeau « Elle du jour » : portrait, accroche, nom et dates. */
export function WomanOfTheDayCard({ person }: { person: CultureEntity }) {
  return (
    <Link href={cultureHref(person.id)} className={styles.card}>
      <CultureThumb entity={person} size={88} />
      <span className={styles.text}>
        <span className={`t-overline ${styles.kicker}`}>Elle du jour</span>
        <span className={`t-title3 ${styles.hook}`}>{person.hook ?? person.title}</span>
        <span className="t-caption c-2">
          <strong className={styles.name}>{person.title}</strong>
          {person.period ? ` · ${person.period.label}` : ''}
        </span>
      </span>
    </Link>
  );
}
