'use client';

import type { ReactNode } from 'react';

import { useMounted } from '@/lib/useMounted';

import { dayNumber, type AlmanacEvent } from '../almanac';

import styles from './WomanOfTheDay.module.css';

/**
 * « Femme du jour » : un portrait différent chaque jour, parmi des bandeaux rendus côté serveur.
 * Une femme née ce jour-là passe en premier ; sinon, le portrait tourne.
 * Le choix dépend de la date du visiteur : il se fait après le chargement, à place réservée.
 */
export function WomanOfTheDay({
  ids,
  cards,
  birthdays = [],
}: {
  ids: string[];
  cards: ReactNode[];
  birthdays?: AlmanacEvent[];
}) {
  const mounted = useMounted();
  let today: ReactNode = null;
  if (mounted) {
    const now = new Date();
    const born = birthdays
      .filter((e) => e.month === now.getMonth() + 1 && e.day === now.getDate())
      .map((e) => ids.indexOf(e.entityId))
      .filter((i) => i >= 0);
    const index = born.length ? born[dayNumber(now) % born.length]! : dayNumber(now) % cards.length;
    today = cards[index];
  }
  return (
    <div className={styles.slot} data-testid="woman-of-the-day">
      {today}
    </div>
  );
}
