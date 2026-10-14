import Link from 'next/link';

import { cultureHref } from '@/components/content/CultureCard';
import { CoverArt } from '@/components/content/CoverArt';
import type { CultureEntity, PortraitThemeId } from '@/types';

import styles from './Wall.module.css';

/** Libellés courts des thématiques, pour les filtres et les tuiles du mur. */
export const THEME_SHORT_LABELS: Record<PortraitThemeId, string> = {
  epoque: 'Notre époque',
  revolutionne: 'Révolutionné le monde',
  culture: 'Changé la culture',
  droits: 'Conquis des droits',
  idees: 'Changé nos idées',
  oubliees: 'Oubliées',
  pionnieres: 'Pionnières',
  quotidien: 'Fait tourner le monde',
  histoire: 'Le cours de l’histoire',
  limites: 'Repoussé les limites',
};

/** Initiales du prénom et du nom (« Simone de Beauvoir » → « SB »), pour un portrait absent. */
export function initials(name: string): string {
  const all = name.split(/\s+/).filter(Boolean);
  // Sans majuscule (« bell hooks »), on prend tous les mots.
  const capitalized = all.filter((word) => /^\p{Lu}/u.test(word));
  const words = capitalized.length > 0 ? capitalized : all;
  const first = words[0]?.[0] ?? '';
  const last = words.length > 1 ? (words[words.length - 1]?.[0] ?? '') : '';
  return `${first}${last}`.toUpperCase();
}

function Face({
  person,
  sizes,
  priority,
}: {
  person: CultureEntity;
  sizes: string;
  priority?: boolean;
}) {
  return person.image ? (
    <CoverArt artwork={person.image} sizes={sizes} priority={priority} className={styles.face} />
  ) : (
    <span className={`${styles.face} ${styles.monogram}`} aria-hidden="true">
      {initials(person.title)}
    </span>
  );
}

/** Une femme sur le mur : visage, nom, dates, thématique. */
export function WallTile({ person, theme }: { person: CultureEntity; theme?: PortraitThemeId }) {
  return (
    <Link
      href={cultureHref(person.id)}
      className={styles.tile}
      data-domain={person.domain}
      data-testid={`wall-${person.id}`}
    >
      <span className={styles.faceWrap}>
        <Face person={person} sizes="(min-width: 1200px) 180px, (min-width: 600px) 25vw, 50vw" />
        {person.hook ? <span className={styles.hook}>{person.hook}</span> : null}
      </span>
      <span className={`t-title3 ${styles.name}`}>{person.title}</span>
      {person.period ? <span className="t-caption c-muted">{person.period.label}</span> : null}
      {theme ? (
        <span className={`t-overline c-domain ${styles.theme}`}>{THEME_SHORT_LABELS[theme]}</span>
      ) : null}
    </Link>
  );
}

/** Portrait à la une du mur : grand visage, accroche, signature. */
export function WallFeature({ person, theme }: { person: CultureEntity; theme: PortraitThemeId }) {
  return (
    <Link
      href={cultureHref(person.id)}
      className={`${styles.tile} ${styles.feature}`}
      data-domain={person.domain}
      data-testid={`wall-feature-${person.id}`}
    >
      <span className={styles.faceWrap}>
        <Face person={person} sizes="(min-width: 600px) 400px, 100vw" priority />
      </span>
      <span className="t-overline c-domain">À la une · {THEME_SHORT_LABELS[theme]}</span>
      <span className={`t-title2 ${styles.name}`}>{person.hook ?? person.title}</span>
      <span className="t-caption c-2">
        {person.hook ? <strong className={styles.strong}>{person.title}</strong> : null}
        {person.hook && person.period ? ' · ' : null}
        {person.period?.label}
      </span>
    </Link>
  );
}
