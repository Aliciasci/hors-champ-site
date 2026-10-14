'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, type CSSProperties } from 'react';

import type { Artwork } from '@/types';

import styles from './HorsChampIntro.module.css';

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
/** Avancement de `p` entre `from` et `to`, de 0 à 1. */
const span = (p: number, from: number, to: number) => clamp01((p - from) / (to - from));

/**
 * L'ouverture « hors champ » : une photo d'époque d'abord cadrée serré sur des hommes, qui
 * s'élargit au défilement jusqu'à révéler la seule femme présente. Le défilement pilote des
 * variables CSS ; sans animation (préférence de l'appareil), l'état final s'affiche d'emblée.
 */
export function HorsChampIntro({
  photo,
  men,
  woman,
  womanName,
  womanHref,
  caption,
}: {
  photo: Artwork;
  /** Point de départ du cadre, et position de la femme sur la photo (en %). */
  men: { x: number; y: number };
  woman: { x: number; y: number };
  womanName: string;
  womanHref: string;
  caption: React.ReactNode;
}) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const update = () => {
      frame = 0;
      if (still.matches) {
        element.dataset.still = 'true';
        return;
      }
      delete element.dataset.still;
      const rect = element.getBoundingClientRect();
      const p = clamp01(-rect.top / Math.max(1, rect.height - window.innerHeight));
      const values: Record<string, number> = {
        '--zoom': span(p, 0.12, 0.5),
        '--light': span(p, 0.55, 0.72),
        '--t0': 1 - span(p, 0.1, 0.2),
        '--t1': span(p, 0.18, 0.26) - span(p, 0.46, 0.54),
        '--t2': span(p, 0.6, 0.7),
      };
      for (const [name, value] of Object.entries(values)) {
        element.style.setProperty(name, value.toFixed(3));
      }
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    still.addEventListener('change', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      still.removeEventListener('change', schedule);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  const ratio =
    typeof photo.image === 'string' ? 3000 / 2171 : photo.image.width / photo.image.height;
  const vars = {
    '--ratio': ratio,
    '--men-x': `${men.x}%`,
    '--men-y': `${men.y}%`,
    '--woman-x': `${woman.x}%`,
    '--woman-y': `${woman.y}%`,
  } as CSSProperties;

  return (
    <section
      ref={root}
      className={styles.intro}
      style={vars}
      aria-label="Ouverture"
      data-testid="intro"
    >
      <div className={styles.stage}>
        <div className={styles.frame}>
          <div className={styles.zoom}>
            <Image
              src={photo.image}
              alt={photo.alt}
              fill
              priority
              sizes="(min-width: 1400px) 1400px, 100vw"
              className={styles.photo}
            />
            <span className={styles.shade} aria-hidden="true" />
            <span className={styles.ring} aria-hidden="true" />
          </div>
        </div>

        <div className={styles.texts}>
          <p className={`${styles.text} ${styles.t0}`}>Bruxelles, octobre 1927.</p>
          <p className={`${styles.text} ${styles.t1}`}>
            Vingt-neuf personnalités au cinquième conseil Solvay, dont dix-sept prix Nobel, présents
            ou à venir.
          </p>
          <p className={`${styles.text} ${styles.t2}`}>
            <span className={styles.big}>Une seule femme.</span>{' '}
            <Link href={womanHref} className={styles.name}>
              {womanName}
            </Link>
          </p>
        </div>
        <p className={styles.hint} aria-hidden="true">
          Faites défiler
        </p>
      </div>
      <p className={`t-caption ${styles.caption}`}>{caption}</p>
    </section>
  );
}
