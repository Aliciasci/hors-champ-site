import Link from 'next/link';

import { cultureHref } from '@/components/content/CultureCard';
import { CoverArt } from '@/components/content/CoverArt';
import { ArrowRight } from '@/components/icons';
import { DOMAIN_LABELS } from '@/features/home/web/FeedItems';
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

/**
 * Une femme sur le mur : visage, nom, dates, thématique. En Atlas, une carte : domaine et
 * dates, nom, accroche, début du résumé, flèche ; « À la une » sur la première.
 */
export function WallTile({
  person,
  theme,
  featured = false,
}: {
  person: CultureEntity;
  theme?: PortraitThemeId;
  /** Portrait à la une (thème Atlas). */
  featured?: boolean;
}) {
  const meta = [person.domain ? DOMAIN_LABELS[person.domain] : null, person.period?.label]
    .filter(Boolean)
    .join(' · ');
  return (
    <Link
      href={cultureHref(person.id)}
      className={`${styles.tile} ${featured ? styles.featuredCard : ''}`}
      data-domain={person.domain}
      data-testid={featured ? `wall-atlas-feature-${person.id}` : `wall-${person.id}`}
    >
      <span className={styles.faceWrap}>
        <Face
          person={person}
          sizes="(min-width: 1200px) 340px, (min-width: 600px) 33vw, 50vw"
          priority={featured}
        />
        {person.hook ? <span className={styles.hook}>{person.hook}</span> : null}
        {featured ? <span className={`t-overline ${styles.flag}`}>À la une</span> : null}
      </span>
      <span className={styles.body}>
        {meta ? <span className={`t-overline ${styles.meta}`}>{meta}</span> : null}
        <span className={`t-title3 ${styles.name}`}>{person.title}</span>
        {person.period ? (
          <span className={`t-caption c-muted ${styles.period}`}>{person.period.label}</span>
        ) : null}
        {theme ? (
          <span className={`t-overline c-domain ${styles.theme}`}>{THEME_SHORT_LABELS[theme]}</span>
        ) : null}
        {person.hook ? <span className={styles.lead}>{person.hook}</span> : null}
        <span className={`t-body-sm c-2 ${styles.summary}`}>{person.summary}</span>
        <span className={styles.go} aria-hidden="true">
          <ArrowRight size={20} />
        </span>
      </span>
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

/** Une femme dans la liste d'un pays : visage, nom, accroche, et ses fiches liées. */
export function MapPersonRow({
  person,
  related,
}: {
  person: CultureEntity;
  /** Œuvres, découvertes et combats liés, dans le catalogue. */
  related: { id: string; title: string }[];
}) {
  return (
    <div className={styles.mapRow} data-domain={person.domain}>
      <Link href={cultureHref(person.id)} className={styles.mapMain}>
        <span className={styles.mapFace}>
          <Face person={person} sizes="64px" />
        </span>
        <span className={styles.mapText}>
          <span className={`t-title3 ${styles.name}`}>{person.title}</span>
          {person.period ? <span className="t-caption c-muted">{person.period.label}</span> : null}
          {person.hook ? <span className="t-body-sm c-2">{person.hook}</span> : null}
        </span>
      </Link>
      {related.length > 0 ? (
        <p className={`t-caption ${styles.mapRelated}`}>
          <span className="c-muted">Voir aussi : </span>
          {related.map((item, index) => (
            <span key={item.id}>
              {index > 0 ? ', ' : null}
              <Link href={cultureHref(item.id)} className="link">
                {item.title}
              </Link>
            </span>
          ))}
        </p>
      ) : null}
    </div>
  );
}
