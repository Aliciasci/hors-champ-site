'use client';

import { useEffect, useId, useRef, useState, type PointerEvent } from 'react';

import { Pause, Play } from '@/components/icons';
import {
  firstYear,
  fullYear,
  levelAt,
  rightCount,
  TODAY,
  type Level,
  type RightStep,
  type WorldCountry,
  type WorldRight,
} from '@/content/world';

import styles from './WorldRights.module.css';

/** Durée d'une année pendant la lecture, en millisecondes. */
const STEP_MS = 90;

const yearLabel = (year: number) => (year === TODAY ? 'Aujourd’hui' : String(year));

/** « 1918 · sous conditions », ou « Aujourd'hui · <précision> » pour une situation non datée. */
const describe = (right: WorldRight, step: RightStep) => {
  const what =
    step.undated && step.note
      ? step.note
      : step.level === 'full'
        ? right.fullLabel
        : step.level === 'partial'
          ? right.partialLabel
          : 'retiré';
  return `${step.undated ? 'Aujourd’hui' : step.year} · ${what}`;
};

const years = (n: number) => (n <= 1 ? `${n} an` : `${n} ans`);
const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/**
 * Ce que dit l'infobulle d'un pays l'année choisie : depuis combien de temps le droit existe,
 * ou combien de temps il faudra encore attendre.
 */
export function hoverText(
  right: WorldRight,
  steps: readonly RightStep[] | undefined,
  year: number,
): string {
  if (!steps) return 'Non renseigné dans la source pour ce droit.';
  const current = [...steps].reverse().find((s) => s.year <= year);
  const since = (step: RightStep) =>
    year - step.year === 0
      ? `depuis cette année`
      : `depuis ${years(year - step.year)} (${step.year})`;
  if (current?.level === 'full') return `${right.fullTitle} ${since(current)}.`;
  if (current?.level === 'partial') return `${capitalize(right.partialLabel)} ${since(current)}.`;
  if (current?.undated) return current.note ?? capitalize(right.noneLabel);
  if (current) return `${capitalize(right.noneLabel)} depuis ${current.year}.`;
  const next = steps.find((s) => s.level !== 'none' && s.year > year);
  return next
    ? `Pas encore : il faudra attendre ${next.year}, encore ${years(next.year - year)}.`
    : capitalize(right.noneLabel);
}

/**
 * La carte en tuiles d'un droit, une année donnée, avec l'infobulle au survol.
 * `testIds` : identifiants de test sur les tuiles (une seule carte par page en porte).
 */
export function TileMap({
  right,
  countries,
  year,
  label,
  testIds = true,
}: {
  right: WorldRight;
  countries: WorldCountry[];
  year: number;
  label: string;
  testIds?: boolean;
}) {
  const [hover, setHover] = useState<{ code: string; x: number; y: number } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const onPointer = (event: PointerEvent<HTMLDivElement>) => {
    const tile = (event.target as HTMLElement).closest<HTMLElement>('[data-code]');
    const box = mapRef.current?.getBoundingClientRect();
    if (!tile || !box) return setHover(null);
    const rect = tile.getBoundingClientRect();
    setHover({
      code: tile.dataset.code!,
      x: Math.min(Math.max(rect.left + rect.width / 2 - box.left, 110), box.width - 110),
      y: rect.top - box.top,
    });
  };
  return (
    <div
      ref={mapRef}
      className={styles.map}
      onPointerMove={onPointer}
      onPointerDown={onPointer}
      onPointerLeave={() => setHover(null)}
      role="img"
      aria-label={label}
      data-testid={testIds ? 'suffrage-map' : undefined}
    >
      {countries.map((country) => {
        const level = levelAt(right.countries[country.code], year) ?? 'unknown';
        return (
          <span
            key={country.code}
            className={`${styles.tile} ${styles[level]} ${country.code === 'FRA' ? styles.france : ''}`}
            style={{ gridColumn: country.col + 1, gridRow: country.row + 1 }}
            data-code={country.code}
            data-state={level}
            data-testid={testIds ? `suffrage-tile-${country.code}` : undefined}
          >
            <span className={styles.code}>{country.code}</span>
          </span>
        );
      })}
      {hover ? (
        <span
          className={styles.hover}
          style={{ left: hover.x, top: hover.y }}
          aria-hidden="true"
          data-testid={testIds ? 'suffrage-hover' : undefined}
        >
          <strong>{countries.find((c) => c.code === hover.code)?.name}</strong>
          <span>{hoverText(right, right.countries[hover.code], year)}</span>
        </span>
      ) : null}
    </div>
  );
}

/** La carte à explorer d'un droit : curseur, années clés, lecture, repères et tableau. */
export function RightMap({ right, countries }: { right: WorldRight; countries: WorldCountry[] }) {
  const [year, setYear] = useState(right.defaultYear);
  const [playing, setPlaying] = useState(false);
  const sliderId = useId();
  const [first, last] = right.range;

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setYear((current) => {
        if (current >= last) {
          setPlaying(false);
          return last;
        }
        return current + 1;
      });
    }, STEP_MS);
    return () => window.clearInterval(timer);
  }, [playing, last]);

  const togglePlay = () => {
    if (!playing && year >= last) setYear(first);
    setPlaying((value) => !value);
  };

  const pick = (value: number) => {
    setPlaying(false);
    setYear(value);
  };

  const { total, partial, known } = rightCount(right, year);
  const franceLevel = levelAt(right.countries.FRA, year);
  const rows = countries
    .filter((c) => right.countries[c.code])
    .map((c) => ({ country: c, steps: right.countries[c.code]! }))
    .sort((a, b) => (firstYear(a.steps) ?? 9999) - (firstYear(b.steps) ?? 9999));
  const firsts = rows.filter((r) => firstYear(r.steps) !== null).slice(0, 4);
  // Pays où, selon la source, le droit n'existe pas aujourd'hui (perdu ou jamais accordé).
  const withoutToday = rows.filter((r) => {
    const last = r.steps.at(-1);
    return last?.undated && last.level === 'none';
  });
  const lasts = rows
    .filter((r) => fullYear(r.steps) !== null)
    .sort((a, b) => fullYear(b.steps)! - fullYear(a.steps)!)
    .slice(0, 4);
  const legend: [Level | 'unknown', string][] = [
    ['full', right.fullLabel],
    ['partial', right.partialLabel],
    ['none', right.noneLabel],
    ['unknown', 'non renseigné'],
  ];

  return (
    <>
      {right.intro ? <p className="t-deck">{right.intro}</p> : null}

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.play}
          onClick={togglePlay}
          aria-pressed={playing}
          data-testid="suffrage-play"
        >
          {playing ? (
            <Pause size={18} fill="currentColor" aria-hidden="true" />
          ) : (
            <Play size={18} fill="currentColor" aria-hidden="true" />
          )}
          {playing ? 'Pause' : 'Lecture'}
        </button>
        <div className={styles.slider}>
          <label htmlFor={sliderId} className="t-overline c-2">
            Année
          </label>
          <input
            id={sliderId}
            type="range"
            min={first}
            max={last}
            step={1}
            value={year}
            aria-valuetext={yearLabel(year)}
            onChange={(event) => pick(Number(event.target.value))}
            data-testid="suffrage-year"
          />
        </div>
        <div role="group" aria-label="Années clés" className={styles.keys}>
          {right.keyYears.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={year === value}
              className={`${styles.key} ${year === value ? styles.keyOn : ''}`}
              onClick={() => pick(value)}
              data-testid={`suffrage-key-${value}`}
            >
              {yearLabel(value)}
            </button>
          ))}
        </div>
      </div>

      <p
        className={styles.count}
        aria-live={playing ? 'off' : 'polite'}
        data-testid="suffrage-count"
      >
        <span className={styles.year}>{yearLabel(year)}</span>
        <span className="t-deck">
          <strong className={styles.number}>{total}</strong> des {known} pays renseignés{' '}
          {right.verb}
          {partial > 0 ? (
            <span className="c-2">
              , dont {partial} {right.partialPhrase}
            </span>
          ) : null}
          .{franceLevel === 'none' ? <span className="c-2"> Pas encore la France.</span> : null}
          {franceLevel === 'partial' ? (
            <span className="c-2"> La France : {right.partialLabel}.</span>
          ) : null}
        </span>
      </p>

      {year === TODAY && (withoutToday.length > 0 || right.todayNote) ? (
        <div className={`measure ${styles.today}`} data-testid="world-today-note">
          {withoutToday.length > 0 ? (
            <p className="t-body">
              <strong>Toujours pas, ou plus :</strong>{' '}
              {withoutToday.map((r) => r.country.name).join(', ')}.
            </p>
          ) : null}
          {right.todayNote ? <p className="t-body c-2">{right.todayNote}</p> : null}
        </div>
      ) : null}

      <div className={styles.layout}>
        <div className={styles.mapColumn}>
          <TileMap
            right={right}
            countries={countries}
            year={year}
            label={`Carte en tuiles : en ${year}, ${total} pays ${right.verb}. Le détail est dans le tableau ci-dessous.`}
          />

          <ul className={styles.legend} aria-hidden="true">
            {legend.map(([level, label]) => (
              <li key={level}>
                <span className={`${styles.swatch} ${styles[level]}`} /> {label}
              </li>
            ))}
            <li>
              <span className={`${styles.swatch} ${styles.france}`} /> France
            </li>
          </ul>
        </div>

        <aside className={styles.aside} aria-label="Repères">
          <Ranking
            title="Les premières"
            rows={firsts.map((r) => [r.country.name, firstYear(r.steps)!])}
          />
          <Ranking
            title={`Les dernières (${right.fullLabel})`}
            rows={lasts.map((r) => [r.country.name, fullYear(r.steps)!])}
          />
        </aside>
      </div>

      <details className={styles.table}>
        <summary className="t-label">Tous les pays renseignés, étape par étape</summary>
        <table className="t-body-sm">
          <thead>
            <tr>
              <th scope="col">Pays</th>
              <th scope="col">Étapes</th>
              <th scope="col">Ce que dit la source</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ country, steps }) => (
              <tr key={country.code}>
                <th scope="row">{country.name}</th>
                <td>
                  {steps.map((s) => (
                    <span key={`${s.year}-${s.level}`} className={styles.step}>
                      {describe(right, s)}
                    </span>
                  ))}
                </td>
                <td className="c-2">
                  {steps.map((s) => (
                    <span key={`${s.year}-${s.level}`} className={styles.step}>
                      {s.excerpt ? `« ${s.excerpt} »` : (s.note ?? '')}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </>
  );
}

function Ranking({ title, rows }: { title: string; rows: [string, number][] }) {
  if (rows.length === 0) return null;
  return (
    <section className={styles.ranking}>
      <h2 className="t-overline c-accent">{title}</h2>
      <ol>
        {rows.map(([name, year]) => (
          <li key={name}>
            <span className="t-title3">{name}</span>
            <span className="t-mono">{year}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
