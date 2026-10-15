import type { ReactNode } from 'react';

import { HandUnderline } from '@/components/ui/HandDrawn';
import type { Tone } from '@/types';

import styles from './PageMasthead.module.css';

/**
 * En-tête des pages de rubrique, sur le modèle de la une : surtitre, grand titre, ligne
 * d'accent soulignée (filet en Cartel, trait à la main en Revue), chapeau éventuel.
 */
export function PageMasthead({
  kicker,
  title,
  accent,
  dek,
  centered = false,
  tone,
  children,
}: {
  kicker: ReactNode;
  title: ReactNode;
  /** Seconde ligne du titre, en couleur et soulignée. */
  accent?: string;
  dek?: ReactNode;
  /** Centré dans la page (la une, dont le fil est centré). */
  centered?: boolean;
  /** Teinte de l'espace : surtitre (avec un point) et filet sous l'accent. */
  tone?: Tone;
  children?: ReactNode;
}) {
  return (
    <header className={`${styles.masthead} ${centered ? styles.centered : ''}`} data-tone={tone}>
      <p className="t-overline c-domain">{kicker}</p>
      <h1 className="t-hero">
        {title}
        {accent ? (
          <>
            {' '}
            <span className={styles.accentLine}>
              <span className={styles.accent}>
                {accent}
                <HandUnderline />
              </span>
            </span>
          </>
        ) : null}
      </h1>
      {dek ? <p className={`t-deck ${styles.dek}`}>{dek}</p> : null}
      {children}
    </header>
  );
}
