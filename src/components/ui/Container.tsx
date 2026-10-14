import type { ReactNode } from 'react';

import styles from './Container.module.css';

/**
 * Conteneur de page. `reading` : colonne de lecture (~680 px) ; `wide` : grande grille (~1200 px).
 */
export function Container({
  width = 'wide',
  children,
  className,
}: {
  width?: 'reading' | 'wide';
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`${styles.container} ${styles[width]} ${className ?? ''}`}>{children}</div>
  );
}
