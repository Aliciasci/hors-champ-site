'use client';

import { useEffect, useId, useRef, useState } from 'react';

import { Pause, Play } from '@/components/icons';
import { suffrageCount, suffrageState, type SuffrageCountry } from '@/content/suffrage';

import styles from './WorldSuffrage.module.css';

const FIRST_YEAR = 1890;
const LAST_YEAR = 2015;
const KEY_YEARS = [1893, 1918, 1944, 1971, 2011];
/** Durée d'une année pendant la lecture, en millisecondes. */
const STEP_MS = 90;

const years = (c: SuffrageCountry) =>
  c.first === c.full ? `${c.first}` : `${c.first}, puis ${c.full}`;

/**
 * « Le monde s'allume » : une carte en tuiles (un pays par case) qui s'allume au fil des années,
 * pilotée par un curseur, des années clés et une lecture automatique. Un tableau donne les mêmes
 * informations aux lecteurs d'écran.
 */
export function WorldSuffrage({ countries }: { countries: SuffrageCountry[] }) {
  const [year, setYear] = useState(1944);
  const [playing, setPlaying] = useState(false);
  const sliderId = useId();
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) return;
    timer.current = window.setInterval(() => {
      setYear((current) => {
        if (current >= 2011) {
          setPlaying(false);
          return 2011;
        }
        return current + 1;
      });
    }, STEP_MS);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [playing]);

  const togglePlay = () => {
    if (!playing && year >= 2011) setYear(1890);
    setPlaying((value) => !value);
  };

  const pick = (value: number) => {
    setPlaying(false);
    setYear(value);
  };

  const { total, partial } = suffrageCount(countries, year);
  const france = countries.find((c) => c.code === 'FRA');
  const byYear = [...countries].sort((a, b) => a.first - b.first || a.name.localeCompare(b.name));

  return (
    <div className={styles.root}>
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
            min={FIRST_YEAR}
            max={LAST_YEAR}
            step={1}
            value={year}
            onChange={(event) => pick(Number(event.target.value))}
            data-testid="suffrage-year"
          />
        </div>
        <div role="group" aria-label="Années clés" className={styles.keys}>
          {KEY_YEARS.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={year === value}
              className={`${styles.key} ${year === value ? styles.keyOn : ''}`}
              onClick={() => pick(value)}
              data-testid={`suffrage-key-${value}`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <p
        className={styles.count}
        aria-live={playing ? 'off' : 'polite'}
        data-testid="suffrage-count"
      >
        <span className={styles.year}>{year}</span>
        <span className="t-deck">
          <strong className={styles.number}>{total}</strong> pays de cette carte accordent le vote
          aux femmes
          {partial > 0 ? <span className="c-2">, dont {partial} sous conditions</span> : null}.
          {france && year < france.full ? (
            <span className="c-2"> Pas encore la France.</span>
          ) : null}
        </span>
      </p>

      <div
        className={styles.map}
        role="img"
        aria-label={`Carte en tuiles : en ${year}, ${total} pays accordent le vote aux femmes. Le détail est dans le tableau ci-dessous.`}
        data-testid="suffrage-map"
      >
        {countries.map((country) => {
          const state = suffrageState(country, year);
          return (
            <span
              key={country.code}
              className={`${styles.tile} ${styles[state]} ${country.code === 'FRA' ? styles.france : ''}`}
              style={{ gridColumn: country.col + 1, gridRow: country.row + 1 }}
              title={`${country.name} : ${years(country)}`}
              data-state={state}
              data-testid={`suffrage-tile-${country.code}`}
            >
              <span className={styles.code}>{country.code}</span>
            </span>
          );
        })}
      </div>

      <ul className={styles.legend} aria-hidden="true">
        <li>
          <span className={`${styles.swatch} ${styles.full}`} /> droit de vote
        </li>
        <li>
          <span className={`${styles.swatch} ${styles.partial}`} /> sous conditions
        </li>
        <li>
          <span className={`${styles.swatch} ${styles.none}`} /> pas encore
        </li>
        <li>
          <span className={`${styles.swatch} ${styles.france}`} /> France
        </li>
      </ul>

      <details className={styles.table}>
        <summary className="t-label">Tous les pays, année par année</summary>
        <table className="t-body-sm">
          <thead>
            <tr>
              <th scope="col">Pays</th>
              <th scope="col">Année</th>
              <th scope="col">Précision</th>
            </tr>
          </thead>
          <tbody>
            {byYear.map((country) => (
              <tr key={country.code}>
                <th scope="row">{country.name}</th>
                <td>{years(country)}</td>
                <td className="c-2">{country.note ?? ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
