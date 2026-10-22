import { SectionHeader } from '@/components/ui/SectionHeader';
import type { CultureEntity } from '@/types';

import styles from './Gallery.module.css';
import { GalleryViewer } from './GalleryViewer';

/**
 * « Ses œuvres » : la galerie d'une artiste, en colonnes, chaque œuvre à ses proportions, avec son
 * titre, sa date, son musée et le lien vers la page qui atteste la licence ; un clic l'ouvre en
 * plein écran.
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
      <GalleryViewer works={works} />
    </section>
  );
}
