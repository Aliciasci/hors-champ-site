'use client';

import { useEffect, useRef, useState } from 'react';

import { rightCount, TODAY, type WorldCountry, type WorldRight } from '@/content/world';

import styles from './VoteStory.module.css';
import { TileMap } from './WorldRights';

/**
 * Le récit défilant : la carte du vote reste fixée pendant qu'on fait défiler les étapes ;
 * l'étape au centre de l'écran donne l'année de la carte.
 */
export function VoteStory({
  right,
  countries,
  steps,
}: {
  right: WorldRight;
  countries: WorldCountry[];
  steps: { year: number; text: string }[];
}) {
  const [active, setActive] = useState(0);
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const items = list.current?.querySelectorAll<HTMLElement>('[data-step]');
    if (!items?.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.step));
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const year = steps[active]?.year ?? steps[0]!.year;
  const yearLabel = year === TODAY ? 'Aujourd’hui' : String(year);
  const { total } = rightCount(right, year);

  return (
    <section
      className={styles.story}
      aria-label="Le droit de vote, de 1893 à aujourd’hui"
      data-testid="vote-story"
    >
      <div className={styles.sticky}>
        <p className={styles.year} aria-hidden="true">
          {yearLabel}
        </p>
        <TileMap
          right={right}
          countries={countries}
          year={year}
          label={`Carte du droit de vote des femmes en ${yearLabel} : ${total} pays.`}
          testIds={false}
        />
      </div>
      <ol ref={list} className={styles.steps}>
        {steps.map((step, index) => {
          const label = step.year === TODAY ? 'Aujourd’hui' : String(step.year);
          return (
            <li
              key={step.year}
              data-step={index}
              className={`${styles.step} ${index === active ? styles.on : ''}`}
            >
              <p className={styles.stepYear}>{label}</p>
              <p className={styles.stepText}>{step.text}</p>
              <p className={styles.stepCount}>
                {rightCount(right, step.year).total} pays de cette carte accordent le vote aux
                femmes.
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
