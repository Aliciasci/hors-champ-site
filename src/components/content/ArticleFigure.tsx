import type { CSSProperties } from 'react';

import { ExternalLink } from '@/components/icons';
import type { Artwork } from '@/types';

import styles from './ArticleFigure.module.css';
import { formatArtworkCredit } from './artworkCredit';
import { CoverArt } from './CoverArt';

/**
 * Image d'un article, à ses proportions (jamais recadrée), légendée comme une photo de presse :
 * œuvre, artiste, date, licence et lien vers la page qui l'atteste.
 */
export function ArticleFigure({
  artwork,
  priority = false,
}: {
  artwork: Artwork;
  priority?: boolean;
}) {
  const ratio =
    typeof artwork.image === 'string' ? 4 / 3 : artwork.image.width / artwork.image.height;
  return (
    <figure className={styles.figure} style={{ '--ratio': ratio } as CSSProperties}>
      <div className={styles.media}>
        <CoverArt
          artwork={artwork}
          decorative={false}
          priority={priority}
          sizes="(min-width: 760px) 680px, 100vw"
          className={styles.frame}
        />
      </div>
      <figcaption className={`t-caption c-2 ${styles.caption}`}>
        {formatArtworkCredit(artwork)}.{' '}
        <a href={artwork.sourceUrl} target="_blank" rel="noopener noreferrer" className="link">
          Fiche et licence
          <ExternalLink size={12} strokeWidth={2.25} aria-hidden="true" className={styles.ext} />
          <span className="sr-only"> (nouvel onglet)</span>
        </a>
      </figcaption>
    </figure>
  );
}
