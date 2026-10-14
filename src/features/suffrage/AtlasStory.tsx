'use client';

import Link from 'next/link';
import { useMemo, useState, type ReactNode } from 'react';

import { ArrowRight } from '@/components/icons';
import {
  rightCount,
  TODAY,
  type RightStep,
  type WorldCountry,
  type WorldRight,
} from '@/content/world';
import type { WorldShapes } from '@/content/world/geoShared';

import styles from './AtlasStory.module.css';
import { countryName, GeoLegend, GeoRightMap, stepsOf, yearLabel } from './GeoRightMap';

/**
 * Le récit d'un droit, version Atlas : une étape à la fois, choisie sur la frise. À gauche
 * l'année et le fait ; au centre la vraie carte à cette date, étiquetée sur le pays de l'étape ;
 * à droite une femme du catalogue liée au droit.
 */
export function AtlasStory({
  right,
  countries,
  shapes,
  figure,
  fiche,
  focus,
}: {
  right: WorldRight;
  countries: WorldCountry[];
  shapes: WorldShapes;
  /** Carte de la femme mise en avant, pré-rendue côté serveur. */
  figure?: ReactNode;
  /** La fiche du catalogue sur ce droit. */
  fiche?: { href: string; title: string };
  /** Pays choisi dans la liste : mis en évidence, et étiqueté à la place de l'étape. */
  focus: string | null;
}) {
  const [active, setActive] = useState(0);
  const step = right.story[active] ?? right.story[0]!;
  const { total } = rightCount(right, step.year);
  const focusSteps = focus ? stepsOf(right, focus) : undefined;

  const callout = focus
    ? { code: focus, title: countryName(countries, focus), subtitle: focusText(right, focusSteps) }
    : { code: step.code, title: yearLabel(step.year), subtitle: countryName(countries, step.code) };

  return (
    <section
      className={`${styles.card} ${figure ? '' : styles.noFigure}`}
      aria-labelledby={`atlas-${right.id}`}
      data-testid={`atlas-story-${right.id}`}
    >
      <div className={styles.text}>
        <p className="t-overline c-2">{right.name}</p>
        <p className={styles.year} aria-hidden="true">
          {yearLabel(step.year)}
        </p>
        <h2 id={`atlas-${right.id}`} className={styles.fact} aria-live="polite">
          <span className="sr-only">{yearLabel(step.year)} : </span>
          {step.text}
        </h2>
        <p className={`t-body c-2 ${styles.count}`}>
          {step.year === TODAY ? 'Aujourd’hui' : `En ${step.year}`},{' '}
          {total === 1
            ? `un seul pays de cette carte ${right.verbOne}`
            : `${total} pays de cette carte ${right.verb}`}
          .{right.intro ? ` ${right.intro}` : ''}
        </p>
        {fiche ? (
          <Link href={fiche.href} className={`t-label ${styles.more}`}>
            Voir la fiche : {fiche.title}
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        ) : null}
      </div>

      <div className={styles.mapCol}>
        <div className={styles.mapWrap}>
          <GeoRightMap
            right={right}
            year={step.year}
            shapes={shapes}
            countries={countries}
            label={`Carte : ${yearLabel(step.year)}, ${total} pays ${right.verb}.`}
            callout={callout}
            focus={focus}
          />
          <div className={styles.legend}>
            <GeoLegend right={right} />
          </div>
        </div>
        <ol className={styles.timeline} aria-label="Étapes">
          {right.story.map((s, index) => (
            <li key={`${s.year}-${index}`}>
              <button
                type="button"
                className={`${styles.step} ${index === active ? styles.on : ''} ${index < active ? styles.past : ''}`}
                aria-pressed={index === active}
                onClick={() => setActive(index)}
                data-testid={`atlas-step-${index}`}
              >
                <span className={styles.dot} aria-hidden="true" />
                <span className={styles.stepYear}>{yearLabel(s.year)}</span>
                <span className={styles.stepCountry}>{countryName(countries, s.code)}</span>
                <span className={styles.stepText}>{s.text}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      {figure ? <div className={styles.figure}>{figure}</div> : null}
    </section>
  );
}

/** Ce que l'étiquette dit du pays choisi : depuis quand il a le droit, ou s'il l'attend. */
function focusText(right: WorldRight, steps: readonly RightStep[] | undefined) {
  if (!steps) return 'non renseigné';
  const full = steps.find((s) => s.level === 'full' && !s.undated);
  const partial = steps.find((s) => s.level === 'partial' && !s.undated);
  if (full) return `${right.fullLabel} en ${full.year}`;
  if (partial) return `${right.partialLabel} en ${partial.year}`;
  return right.noneLabel;
}

/**
 * « Quelques dates, et beaucoup d'histoires » : quatre pays hors du récit, répartis dans le
 * temps, chacun avec sa silhouette et ce que dit la source.
 */
export function AtlasDates({
  right,
  countries,
  shapes,
}: {
  right: WorldRight;
  countries: WorldCountry[];
  shapes: WorldShapes;
}) {
  const picks = useMemo(() => pickDates(right, countries), [right, countries]);
  if (picks.length === 0) return null;
  return (
    <section className={styles.dates} aria-labelledby={`atlas-dates-${right.id}`}>
      <h2 id={`atlas-dates-${right.id}`} className="t-title2">
        Quelques dates, et beaucoup d’histoires
      </h2>
      <ul className={styles.dateList} data-testid={`atlas-dates-${right.id}`}>
        {picks.map(({ code, step }) => {
          const shape = shapes.countries.find((c) => c.code === code);
          return (
            <li key={code} className={styles.dateCard}>
              <Silhouette d={shape?.d} b={shape?.b} level={step.level} />
              <span className={styles.dateText}>
                <span className={styles.dateYear}>{step.year}</span>
                <span className={`t-title3 ${styles.dateCountry}`}>
                  {countryName(countries, code)}
                </span>
                <span className="t-body-sm">
                  {step.level === 'full' ? right.facts.full : right.facts.partial}
                </span>
                {step.note ? <span className="t-caption c-2">{step.note}</span> : null}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** Quatre pays hors du récit, de dates bien réparties : leur premier pas vers le droit. */
export function pickDates(right: WorldRight, countries: WorldCountry[]) {
  const inStory = new Set(right.story.map((s) => s.code));
  const known = new Set(countries.map((c) => c.code));
  const candidates = Object.entries(right.countries)
    .filter(([code]) => known.has(code) && !inStory.has(code))
    .map(([code, steps]) => {
      const step =
        steps.find((s) => s.level === 'full' && !s.undated) ??
        steps.find((s) => s.level === 'partial' && !s.undated);
      return step ? { code, step } : null;
    })
    .filter((c): c is { code: string; step: RightStep } => c !== null)
    .sort((a, b) => a.step.year - b.step.year || a.code.localeCompare(b.code));
  if (candidates.length <= 4) return candidates;
  return [0, 1, 2, 3].map((i) => candidates[Math.round((i * (candidates.length - 1)) / 3)]!);
}

/** Le pays seul, à sa couleur, cadré sur son territoire principal. */
function Silhouette({
  d,
  b,
  level,
}: {
  d?: string;
  b?: [number, number, number, number];
  level: RightStep['level'];
}) {
  if (!d || !b) return <span className={styles.silhouette} aria-hidden="true" />;
  const [x0, y0, x1, y1] = b;
  const size = Math.max(x1 - x0, y1 - y0, 6) * 1.25;
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  return (
    <svg
      className={styles.silhouette}
      viewBox={`${cx - size / 2} ${cy - size / 2} ${size} ${size}`}
      aria-hidden="true"
      focusable="false"
    >
      <path d={d} className={styles[`shape-${level}`]} />
    </svg>
  );
}
