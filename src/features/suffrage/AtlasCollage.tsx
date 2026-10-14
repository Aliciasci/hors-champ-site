import Link from 'next/link';

import { cultureHref } from '@/components/content/CultureCard';
import { CoverArt } from '@/components/content/CoverArt';
import { ArrowRight } from '@/components/icons';
import { ATLAS_WORLD_PHOTO } from '@/content/atlas';
import { globe } from '@/content/world/geo';
import type { CultureEntity } from '@/types';

import styles from './AtlasCollage.module.css';

/**
 * L'en-tête d'Atlas sur la page du monde : un collage de papiers. Le globe, des aplats orange,
 * une photographie d'archives de suffragettes, une note manuscrite et un tampon.
 */
export function AtlasCollage() {
  const g = globe(320);
  return (
    <div className={styles.collage}>
      <span className={styles.paperTall} aria-hidden="true" />
      <span className={styles.paperLow} aria-hidden="true" />
      <svg className={styles.globe} viewBox="0 0 320 320" aria-hidden="true" focusable="false">
        <path d={g.sphere} className={styles.sea} />
        <path d={g.graticule} className={styles.graticule} />
        <path d={g.land} className={styles.land} />
      </svg>
      <figure className={styles.photo}>
        <CoverArt
          artwork={ATLAS_WORLD_PHOTO}
          decorative={false}
          credit
          priority
          sizes="(min-width: 900px) 420px, 80vw"
          className={styles.photoImg}
        />
      </figure>
      <p className={styles.note} aria-hidden="true">
        Des droits différents selon les pays, les époques et les contextes.
      </p>
      <p className={styles.stamp} aria-hidden="true">
        Égalité
        <br />
        Droits
        <br />
        Libertés
      </p>
    </div>
  );
}

/** Une femme du catalogue liée au droit : portrait, nom, accroche, lien vers sa fiche. */
export function AtlasFigure({ person }: { person: CultureEntity }) {
  return (
    <Link
      href={cultureHref(person.id)}
      className={styles.figure}
      data-testid={`atlas-figure-${person.id}`}
    >
      {person.image ? (
        <CoverArt artwork={person.image} sizes="220px" className={styles.figureImg} />
      ) : null}
      <span className={styles.figureText}>
        <span className={`t-title3 ${styles.figureName}`}>{person.title}</span>
        {person.hook ? <span className="t-caption c-2">{person.hook}</span> : null}
        <ArrowRight size={18} aria-hidden="true" className={styles.figureArrow} />
      </span>
    </Link>
  );
}
