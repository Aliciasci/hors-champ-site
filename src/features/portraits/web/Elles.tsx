import Link from 'next/link';

import { cultureHref } from '@/components/content/CultureCard';
import { CultureThumb } from '@/components/content/CultureThumb';
import { ArrowRight } from '@/components/icons';
import type { ResolvedTheme } from '@/features/portraits/portraitThemes';

import styles from './Elles.module.css';

export const themeHref = (id: string) => `/elles/${id}`;

const EMPTY_LIST = 'Pas encore de portrait publié dans ce thème.';

/** Liste des neuf thématiques : numéro, domaines, titre, rangée de portraits. */
export function ThemeList({ themes }: { themes: ResolvedTheme[] }) {
  return (
    <ol className={styles.themes}>
      {themes.map((theme, index) => (
        <li key={theme.id} className={styles.theme} data-testid={`theme-${theme.id}`}>
          <Link
            href={themeHref(theme.id)}
            className={styles.themeHead}
            data-testid={`theme-open-${theme.id}`}
          >
            <span className="t-overline c-accent">
              {String(index + 1).padStart(2, '0')} · {theme.subtitle}
            </span>
            <span className={styles.titleRow}>
              <span className={`t-title2 ${styles.title}`}>{theme.title}</span>
              <ArrowRight size={20} aria-hidden="true" className={styles.arrow} />
            </span>
            <span className="sr-only">
              {theme.people.length > 0 ? `, ${theme.people.length} portraits` : ', à documenter'}
            </span>
          </Link>
          {theme.people.length > 0 ? (
            <ul className={styles.portraits} aria-label={`Portraits : ${theme.title}`}>
              {theme.people.map(({ person }) => (
                <li key={person.id}>
                  <Link
                    href={cultureHref(person.id)}
                    className={styles.portrait}
                    data-testid={`theme-${theme.id}-${person.id}`}
                  >
                    <CultureThumb entity={person} size={88} />
                    <span className={`t-caption ${styles.name}`}>{person.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="t-body c-muted" data-testid={`theme-empty-${theme.id}`}>
              {EMPTY_LIST}
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}

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
