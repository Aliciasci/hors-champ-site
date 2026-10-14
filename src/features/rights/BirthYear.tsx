'use client';

import Link from 'next/link';
import { useId, useState } from 'react';

import styles from './BirthYear.module.css';

export interface ConquestYear {
  id: string;
  /** Libellé court, sur la ligne de vie. */
  short: string;
  title: string;
  year: number;
  href: string;
}

const MIN = 1900;
const MAX = new Date().getFullYear();
/** Ligne de vie : de 0 à 90 ans. */
const SPAN = 90;
/** Quatre étages d'étiquettes (haut, bas, près, loin) pour éviter les chevauchements. */
const LEVELS = [styles.up, styles.down, styles.upFar, styles.downFar];
const ans = (n: number) => (n <= 1 ? `${n} an` : `${n} ans`);

/** Ligne de vie d'une personne née en `born`, avec l'âge qu'elle avait à chaque conquête. */
function Lifeline({
  born,
  label,
  own = false,
  conquests,
}: {
  born: number;
  label: string;
  /** La ligne de la lectrice : « votre naissance ». */
  own?: boolean;
  conquests: ConquestYear[];
}) {
  const pct = (age: number) => `${(Math.min(Math.max(age, 0), SPAN) / SPAN) * 100}%`;
  const before = conquests.filter((c) => c.year < born);
  const during = conquests.filter((c) => c.year >= born);
  const today = MAX - born;
  return (
    <div className={styles.life}>
      <p className={styles.lifeLabel}>
        <span className={styles.lifeYear}>{born}</span> {label}
      </p>
      <div className={`${styles.track} ${during.length ? '' : styles.empty}`} aria-hidden="true">
        <span className={styles.line} style={{ width: pct(today) }} />
        {during.map((c, index) => (
          <span
            key={c.id}
            className={`${styles.mark} ${LEVELS[index % LEVELS.length]}`}
            style={{ left: pct(c.year - born) }}
          >
            <span className={styles.dot} />
            <span className={styles.markText}>
              <b>{ans(c.year - born)}</b> {c.short}
            </span>
          </span>
        ))}
      </div>
      <p className="sr-only">
        {during.map((c) => `${c.title} : ${ans(c.year - born)}.`).join(' ')}
      </p>
      {before.length > 0 ? (
        <p className={styles.before}>
          Déjà acquis à {own ? 'votre' : 'sa'} naissance : {before.map((c) => c.short).join(', ')}.
        </p>
      ) : null}
    </div>
  );
}

/**
 * « Et vous ? » : l'âge que vous aviez à chaque conquête des droits des femmes en France, à côté
 * de celui d'une femme née trente et soixante ans avant vous. Rien n'est enregistré ni envoyé.
 */
export function BirthYear({ conquests }: { conquests: ConquestYear[] }) {
  const id = useId();
  const [value, setValue] = useState('');
  const born = Number(value);
  const valid = value.length === 4 && born >= MIN && born <= MAX;
  const sorted = [...conquests].sort((a, b) => a.year - b.year);

  return (
    <section className={styles.block} aria-labelledby={`${id}-title`} data-testid="birth-year">
      <p className="t-overline c-accent">Et vous ?</p>
      <h2 id={`${id}-title`} className={styles.title}>
        Quel âge aviez-vous quand ces droits ont été conquis ?
      </h2>
      <div className={styles.field}>
        <label htmlFor={id} className="t-label">
          Votre année de naissance
        </label>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={MIN}
          max={MAX}
          placeholder="1985"
          value={value}
          onChange={(event) => setValue(event.target.value.slice(0, 4))}
          className={styles.input}
          data-testid="birth-year-input"
        />
        <p className="t-caption c-muted">Rien n’est enregistré ni envoyé.</p>
      </div>

      {valid ? (
        <div className={styles.result} aria-live="polite" data-testid="birth-year-result">
          <ul className={styles.sentences}>
            {sorted.map((c) => (
              <li key={c.id}>
                <Link href={c.href} className={styles.sentenceLink}>
                  {c.title}
                </Link>{' '}
                <span className={styles.year}>({c.year})</span> :{' '}
                {c.year >= born ? (
                  <strong>vous aviez {ans(c.year - born)}.</strong>
                ) : (
                  <span>{ans(born - c.year)} avant votre naissance.</span>
                )}
              </li>
            ))}
          </ul>
          <Lifeline born={born} label="vous" own conquests={sorted} />
          <Lifeline
            born={born - 30}
            label="une femme née trente ans avant vous"
            conquests={sorted}
          />
          <Lifeline
            born={born - 60}
            label="une femme née soixante ans avant vous"
            conquests={sorted}
          />
        </div>
      ) : null}
    </section>
  );
}
