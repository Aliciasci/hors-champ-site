import type { CSSProperties } from 'react';

import { CoverArt } from '@/components/content/CoverArt';
import { ExternalLink } from '@/components/icons';
import { SectionHeader } from '@/components/ui/SectionHeader';
import type { Artwork, CultureEntity } from '@/types';

import styles from './Gallery.module.css';

/**
 * « Ses œuvres » : la galerie d'une artiste, en colonnes, chaque œuvre à ses proportions, avec son
 * titre, sa date, son musée et le lien vers la page qui atteste la licence.
 */
export function Gallery({ entity }: { entity: CultureEntity }) {
  const works = entity.gallery ?? [];
  if (works.length === 0) return null;
  return (
    <section className={styles.gallery} aria-labelledby="galerie" data-testid="culture-gallery">
      <SectionHeader
        id="galerie"
        kicker={`Galerie · ${works.length} œuvres du domaine public`}
        title="Ses œuvres"
      />
      <ul className={styles.grid}>
        {works.map((work) => (
          <li key={work.sourceUrl}>
            <GalleryItem work={work} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function GalleryItem({ work }: { work: Artwork }) {
  const ratio = typeof work.image === 'string' ? 4 / 3 : work.image.width / work.image.height;
  return (
    <figure className={styles.item} style={{ '--ratio': ratio } as CSSProperties}>
      <CoverArt
        artwork={work}
        decorative={false}
        sizes="(min-width: 1100px) 360px, (min-width: 640px) 45vw, 100vw"
        className={styles.frame}
      />
      <figcaption className={styles.caption}>
        <span className={styles.title}>{work.title}</span>
        <span className="t-caption c-2">
          {[work.date, work.holder].filter(Boolean).join(' · ')}
        </span>
        <a
          href={work.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`t-caption ${styles.link}`}
        >
          {work.license} · fiche et licence
          <ExternalLink size={12} strokeWidth={2.25} aria-hidden="true" />
        </a>
      </figcaption>
    </figure>
  );
}
