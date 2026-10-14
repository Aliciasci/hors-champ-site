'use client';

import { useRef, type ReactNode } from 'react';

import { ChevronLeft, ChevronRight } from '@/components/icons';
import { useAppStore } from '@/store/useAppStore';

import styles from './RecentExplorations.module.css';

/**
 * « Vos dernières explorations » : rangée défilante (flèches du clavier entre les fiches,
 * boutons précédent/suivant sur grand écran). Rien avant l'hydratation ni sans exploration.
 */
export function RecentExplorations({
  tiles,
  limit = 8,
  headingLevel = 2,
}: {
  /** Tuiles pré-rendues côté serveur, par identifiant de fiche. */
  tiles: Record<string, ReactNode>;
  limit?: number;
  headingLevel?: 2 | 3;
}) {
  const explored = useAppStore((s) => s.exploredEntityIds);
  const list = useRef<HTMLUListElement>(null);
  const recent = explored.filter((id) => tiles[id] !== undefined).slice(0, limit);
  if (recent.length === 0) return null;
  const Heading = `h${headingLevel}` as 'h2' | 'h3';

  const scroll = (direction: 1 | -1) =>
    list.current?.scrollBy({
      left: direction * list.current.clientWidth * 0.8,
      behavior: 'smooth',
    });

  const onKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    const links = [...(list.current?.querySelectorAll<HTMLAnchorElement>('a') ?? [])];
    const index = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (index === -1) return;
    event.preventDefault();
    const next = links[index + (event.key === 'ArrowRight' ? 1 : -1)];
    next?.focus();
    next?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  };

  return (
    <section
      className={styles.section}
      aria-labelledby="dernieres-explorations"
      data-testid="recent-explorations"
    >
      <div className={styles.head}>
        <Heading id="dernieres-explorations" className="t-overline c-2">
          Vos dernières explorations
        </Heading>
        <div className={styles.arrows}>
          <button
            type="button"
            className={styles.arrow}
            onClick={() => scroll(-1)}
            aria-label="Précédentes"
          >
            <ChevronLeft size={18} strokeWidth={2.25} aria-hidden="true" />
          </button>
          <button
            type="button"
            className={styles.arrow}
            onClick={() => scroll(1)}
            aria-label="Suivantes"
          >
            <ChevronRight size={18} strokeWidth={2.25} aria-hidden="true" />
          </button>
        </div>
      </div>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- flèches entre les liens de la liste */}
      <ul ref={list} className={styles.row} onKeyDown={onKeyDown}>
        {recent.map((id) => (
          <li key={id} className={styles.item}>
            {tiles[id]}
          </li>
        ))}
      </ul>
    </section>
  );
}
