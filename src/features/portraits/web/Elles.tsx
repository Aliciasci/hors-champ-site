import Link from 'next/link';

import { cultureHref } from '@/components/content/CultureCard';
import { CultureThumb } from '@/components/content/CultureThumb';
import type { ResolvedTheme } from '@/features/portraits/portraitThemes';

import styles from './Elles.module.css';

export const themeHref = (id: string) => `/elles/${id}`;

/** Portraits d'une thématique, chacun avec la raison de sa présence. */
export function ThemeMembers({ theme }: { theme: ResolvedTheme }) {
  if (theme.people.length === 0) {
    return (
      <p className="t-body c-muted" data-testid="theme-empty">
        Pas encore de portrait publié dans ce thème. On ne publie une fiche qu’une fois tous ses
        faits vérifiés.
      </p>
    );
  }
  return (
    <ul className={styles.members}>
      {theme.people.map(({ person, reason }) => (
        <li key={person.id}>
          <Link
            href={cultureHref(person.id)}
            className={styles.member}
            data-testid={`theme-member-${person.id}`}
          >
            <span className={styles.memberText}>
              <span className={`t-title3 ${styles.title}`}>{person.title}</span>
              {person.period ? (
                <span className="t-caption c-muted">{person.period.label}</span>
              ) : null}
              <span className="t-body c-2">{reason}</span>
            </span>
            <CultureThumb entity={person} size={96} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
