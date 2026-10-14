'use client';

import { useId, useRef, useState, type PointerEvent } from 'react';

import { levelAt, TODAY, type WorldCountry, type WorldRight } from '@/content/world';
import { SUCCESSORS, type WorldShapes } from '@/content/world/geoShared';

import styles from './GeoRightMap.module.css';
import { hoverText } from './WorldRights';

const PARENT = new Map(
  Object.entries(SUCCESSORS).flatMap(([parent, children]) => children.map((c) => [c, parent])),
);

/** Les étapes d'un pays pour un droit ; un pays successeur sans données prend celles de l'État d'origine. */
export function stepsOf(right: WorldRight, code: string) {
  const own = right.countries[code];
  if (own) return own;
  const parent = PARENT.get(code);
  return parent ? right.countries[parent] : undefined;
}

export const yearLabel = (year: number) => (year === TODAY ? 'Aujourd’hui' : String(year));

/**
 * Un droit sur la vraie carte du monde, une année donnée : accordé (plein), partiel, absent,
 * ou non renseigné (hachuré). Une étiquette peut désigner un pays ; le survol donne le détail.
 */
export function GeoRightMap({
  right,
  year,
  shapes,
  countries,
  label,
  callout,
  focus,
}: {
  right: WorldRight;
  year: number;
  shapes: WorldShapes;
  countries: WorldCountry[];
  /** Description de la carte pour les lecteurs d'écran. */
  label: string;
  /** Étiquette posée sur un pays : titre (une année) et sous-titre (le pays). */
  callout?: { code: string; title: string; subtitle: string } | null;
  /** Pays mis en évidence (choisi dans la liste). */
  focus?: string | null;
}) {
  const hatch = `hatch-${useId().replace(/:/g, '')}`;
  const names = new Map(countries.map((c) => [c.code, c.name]));
  const [hover, setHover] = useState<{ code: string; x: number; y: number } | null>(null);
  const box = useRef<HTMLDivElement>(null);

  const levelOf = (code?: string) =>
    code ? (levelAt(stepsOf(right, code), year) ?? 'unknown') : 'unknown';

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const code = (event.target as Element).closest<SVGElement>('[data-code]')?.dataset.code;
    const rect = box.current?.getBoundingClientRect();
    if (!code || !rect || !names.has(code)) return setHover(null);
    setHover({
      code,
      x: Math.min(Math.max(event.clientX - rect.left, 110), rect.width - 110),
      y: event.clientY - rect.top - 12,
    });
  };

  const anchor = (code: string) => {
    const shape =
      shapes.countries.find((c) => c.code === code) ?? shapes.dots.find((d) => d.code === code);
    return shape && shape.x !== undefined && shape.y !== undefined
      ? { x: shape.x, y: shape.y }
      : null;
  };
  const calloutAt = callout ? anchor(callout.code) : null;
  const focusShape = focus ? shapes.countries.find((c) => c.code === focus) : null;

  return (
    <div
      ref={box}
      className={styles.map}
      onPointerMove={onPointerMove}
      onPointerLeave={() => setHover(null)}
      role="img"
      aria-label={label}
    >
      <svg
        viewBox={`0 0 ${shapes.width} ${shapes.height}`}
        className={styles.svg}
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <pattern
            id={hatch}
            width="6"
            height="6"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <rect width="6" height="6" className={styles.hatchBg} />
            <line x1="0" y1="0" x2="0" y2="6" className={styles.hatchLine} />
          </pattern>
        </defs>
        <path d={shapes.sphere} className={styles.ocean} />
        {shapes.countries.map((country) => {
          const level = levelOf(country.code);
          return (
            <path
              key={country.id}
              d={country.d}
              className={styles[level]}
              style={level === 'unknown' ? { fill: `url(#${hatch})` } : undefined}
              data-code={country.code}
            />
          );
        })}
        {shapes.dots.map((dot) => {
          const level = levelOf(dot.code);
          return (
            <circle
              key={dot.code}
              cx={dot.x}
              cy={dot.y}
              r={3.2}
              className={`${styles.dot} ${styles[level]}`}
              data-code={dot.code}
            />
          );
        })}
        {focusShape ? <path d={focusShape.d} className={styles.focus} /> : null}
        {calloutAt ? (
          <circle cx={calloutAt.x} cy={calloutAt.y} r={4} className={styles.pin} />
        ) : null}
      </svg>
      {callout && calloutAt ? (
        <span
          className={`${styles.callout} ${calloutAt.x > shapes.width * 0.7 ? styles.calloutLeft : ''}`}
          style={{
            left: `${(calloutAt.x / shapes.width) * 100}%`,
            top: `${(calloutAt.y / shapes.height) * 100}%`,
          }}
          aria-hidden="true"
        >
          <strong>{callout.title}</strong>
          <span>{callout.subtitle}</span>
        </span>
      ) : null}
      {hover ? (
        <span className={styles.hover} style={{ left: hover.x, top: hover.y }} aria-hidden="true">
          <strong>{names.get(hover.code)}</strong>
          <span>{hoverText(right, stepsOf(right, hover.code), year)}</span>
        </span>
      ) : null}
    </div>
  );
}

/** Légende de la carte : les trois états du droit, et les pays sans données. */
export function GeoLegend({ right }: { right: WorldRight }) {
  return (
    <ul className={styles.legend} aria-hidden="true">
      <li>
        <span className={`${styles.swatch} ${styles.full}`} /> {right.fullLabel}
      </li>
      <li>
        <span className={`${styles.swatch} ${styles.partial}`} /> {right.partialLabel}
      </li>
      <li>
        <span className={`${styles.swatch} ${styles.none}`} /> {right.noneLabel}
      </li>
      <li>
        <span className={`${styles.swatch} ${styles.swatchUnknown}`} /> non renseigné
      </li>
    </ul>
  );
}

/** Nom d'un pays, d'après la liste des pays de la carte. */
export function countryName(countries: WorldCountry[], code: string) {
  return countries.find((c) => c.code === code)?.name ?? code;
}

/** Années d'un droit, du plus ancien au plus récent : bornes de la frise. */
export function yearsOf(right: WorldRight) {
  return right.story.map((s) => s.year);
}
