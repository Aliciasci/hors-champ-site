'use client';

import { useEffect, useId, useState } from 'react';

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
  type WorldRightId,
} from '@/content/world';
import { readOne, useQueryState } from '@/lib/useQueryState';

import styles from './WorldRights.module.css';

/** Durée d'une année pendant la lecture, en millisecondes. */
const STEP_MS = 90;

interface Props {
  rights: WorldRight[];
  countries: WorldCountry[];
  withUrl?: boolean;
}

/**
 * « Le monde s'allume » : une carte en tuiles (un pays par case) qui s'allume au fil des années,
 * pour le droit choisi (voter, étudier, être majeure, avorter). Curseur, années clés, lecture
 * automatique ; un tableau donne les mêmes informations aux lecteurs d'écran.
 */
export function WorldRights(props: Props) {
  return props.withUrl ? <WithUrl {...props} /> : <WorldMap {...props} rightId="vote" />;
}

function WithUrl(props: Props) {
  const { params, set } = useQueryState();
  const rightId = readOne<WorldRightId>(
    params.get('droit'),
    props.rights.map((r) => r.id),
    'vote',
  );
  return (
    <WorldMap
      {...props}
      rightId={rightId}
      onRight={(id) => set({ droit: id === 'vote' ? null : id })}
    />
  );
}

function WorldMap({
  rights,
  countries,
  rightId,
  onRight,
}: Props & { rightId: WorldRightId; onRight?: (id: WorldRightId) => void }) {
  const right = rights.find((r) => r.id === rightId) ?? rights[0]!;
  // L'année et la lecture repartent de zéro à chaque changement de droit (voir la clé).
  return (
    <div className={styles.root}>
      <fieldset className={styles.rights}>
        <legend className="sr-only">Droit</legend>
        {rights.map((r) => (
          <label key={r.id} className={`${styles.pill} ${r.id === right.id ? styles.pillOn : ''}`}>
            <input
              type="radio"
              name="droit"
              value={r.id}
              checked={r.id === right.id}
              onChange={() => onRight?.(r.id)}
              className="sr-only"
              data-testid={`world-right-${r.id}`}
            />
            {r.label}
          </label>
        ))}
      </fieldset>
      <RightMap key={right.id} right={right} countries={countries} />
    </div>
  );
}

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

function RightMap({ right, countries }: { right: WorldRight; countries: WorldCountry[] }) {
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
          <div
            className={styles.map}
            role="img"
            aria-label={`Carte en tuiles : en ${year}, ${total} pays ${right.verb}. Le détail est dans le tableau ci-dessous.`}
            data-testid="suffrage-map"
          >
            {countries.map((country) => {
              const level = levelAt(right.countries[country.code], year) ?? 'unknown';
              const steps = right.countries[country.code];
              const title = steps
                ? `${country.name} : ${steps.map((s) => describe(right, s)).join(' ; ')}`
                : `${country.name} : non renseigné`;
              return (
                <span
                  key={country.code}
                  className={`${styles.tile} ${styles[level]} ${country.code === 'FRA' ? styles.france : ''}`}
                  style={{ gridColumn: country.col + 1, gridRow: country.row + 1 }}
                  title={title}
                  data-state={level}
                  data-testid={`suffrage-tile-${country.code}`}
                >
                  <span className={styles.code}>{country.code}</span>
                </span>
              );
            })}
          </div>

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
