import { CoverArt } from '@/components/content/CoverArt';
import type { CultureEntity } from '@/types';

import styles from './EllesCollage.module.css';

/** Les visages du collage, dans l'ordre des emplacements. */
export const COLLAGE_IDS = [
  'person-nina-simone',
  'person-marie-curie',
  'person-ada-lovelace',
  'person-katherine-johnson',
] as const;

/**
 * L'en-tête d'Atlas sur la page Elles : quatre portraits du catalogue en papiers collés, un
 * disque cobalt, des aplats orange et une note manuscrite. Les visages sont décoratifs : leurs
 * fiches sont sur le mur, juste dessous.
 */
export function EllesCollage({ people }: { people: CultureEntity[] }) {
  return (
    <div className={styles.collage} aria-hidden="true" data-testid="elles-collage">
      <span className={styles.disc} />
      <span className={styles.paperTall} />
      <span className={styles.paperLow} />
      {people.slice(0, 4).map((person, index) =>
        person.image ? (
          <span key={person.id} className={`${styles.photo} ${styles[`p${index}`]}`}>
            <CoverArt
              artwork={person.image}
              sizes="(min-width: 900px) 220px, 30vw"
              priority={index === 1}
              className={styles.img}
            />
          </span>
        ) : null,
      )}
      <p className={styles.note}>
        Des femmes, des idées, des œuvres, des combats et des mondes à redécouvrir.
      </p>
    </div>
  );
}
