'use client';

import type { ReactNode } from 'react';

import { useMounted } from '@/lib/useMounted';

import styles from './WomanOfTheDay.module.css';

/** Numéro du jour (heure locale), pour changer de portrait chaque jour. */
const dayNumber = (date: Date) =>
  Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);

/**
 * « Elle du jour » : un portrait différent chaque jour, parmi des bandeaux rendus côté serveur.
 * Le choix dépend de la date du visiteur : il se fait après le chargement, à place réservée.
 */
export function WomanOfTheDay({ cards }: { cards: ReactNode[] }) {
  const mounted = useMounted();
  const today = mounted ? cards[dayNumber(new Date()) % cards.length] : null;
  return (
    <div className={styles.slot} data-testid="woman-of-the-day">
      {today}
    </div>
  );
}
