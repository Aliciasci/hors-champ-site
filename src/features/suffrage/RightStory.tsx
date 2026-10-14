'use client';

import { useEffect, useRef, useState } from 'react';

import { rightCount, TODAY, type WorldCountry, type WorldRight } from '@/content/world';

import styles from './RightStory.module.css';
import { TileMap } from './WorldRights';

const yearLabel = (year: number) => (year === TODAY ? 'Aujourd’hui' : String(year));

/**
 * Le récit défilant d'un droit : la carte reste fixée pendant qu'on fait défiler les étapes ;
 * l'étape au centre de l'écran donne l'année de la carte.
 */
export function RightStory({ right, countries }: { right: WorldRight; countries: WorldCountry[] }) {
  const [active, setActive] = useState(0);
  const list = useRef<HTMLOListElement>(null);
  const steps = right.story;

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
  const { total } = rightCount(right, year);
  const legend = [
    ['full', right.fullLabel],
    ['partial', right.partialLabel],
    ['none', right.noneLabel],
  ] as const;

  return (
    <div className={styles.story} data-testid={`story-${right.id}`}>
      <div className={styles.sticky}>
        <p className={styles.year} aria-hidden="true">
          {yearLabel(year)}
        </p>
        <TileMap
          right={right}
          countries={countries}
          year={year}
          label={`Carte : en ${yearLabel(year)}, ${total} pays ${right.verb}.`}
          testIds={false}
        />
        <ul className={styles.legend} aria-hidden="true">
          {legend.map(([level, label]) => (
            <li key={level}>
              <span className={`${styles.swatch} ${styles[level]}`} /> {label}
            </li>
          ))}
        </ul>
      </div>
      <ol ref={list} className={styles.steps}>
        {steps.map((step, index) => (
          <li
            key={`${step.year}-${index}`}
            data-step={index}
            className={`${styles.step} ${index === active ? styles.on : ''}`}
          >
            <p className={styles.stepYear}>{yearLabel(step.year)}</p>
            <p className={styles.stepText}>{step.text}</p>
            <p className={styles.stepCount}>
              {rightCount(right, step.year).total} pays de cette carte {right.verb}.
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
