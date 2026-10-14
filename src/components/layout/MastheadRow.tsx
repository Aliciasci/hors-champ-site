import type { ReactNode } from 'react';

import styles from './MastheadRow.module.css';

/**
 * En-tête de page et choix d'un mode côte à côte sur grand écran (l'un sous l'autre sinon) :
 * le haut de page tient en peu de hauteur.
 */
export function MastheadRow({ masthead, modes }: { masthead: ReactNode; modes: ReactNode }) {
  return (
    <div className={styles.head}>
      {masthead}
      <div className={styles.modes}>{modes}</div>
    </div>
  );
}
