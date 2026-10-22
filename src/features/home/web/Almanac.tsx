'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

import { cultureHref } from '@/components/content/CultureCard';
import { useMounted } from '@/lib/useMounted';

import {
  almanacFor,
  monthName,
  nextObservance,
  type AlmanacEvent,
  type AlmanacKind,
} from '../almanac';

import styles from './Almanac.module.css';

/*
 * L'accueil daté : la date du visiteur, la prochaine journée internationale et « Ce jour-là ».
 * Le site est statique : tout se calcule après le chargement, à place réservée.
 */

const dateline = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

/** « Mercredi 22 octobre 2026 », et l'annonce de la prochaine journée. */
export function Dateline() {
  const mounted = useMounted();
  const today = mounted ? new Date() : null;
  const next = today ? nextObservance(today) : null;
  const label = today ? dateline.format(today) : '';
  return (
    <div className={styles.dateline} data-testid="dateline">
      <span className={`t-overline ${styles.date}`}>
        {label ? label[0]!.toUpperCase() + label.slice(1) : ' '}
      </span>
      {next ? (
        <Link href={next.observance.href} className={styles.observance}>
          <span className={styles.countdown}>
            {next.days === 0
              ? 'Aujourd’hui'
              : next.days === 1
                ? 'Demain'
                : `Dans ${next.days} jours`}
          </span>
          <span className={styles.observanceName}>{next.observance.name}</span>
          <span className={styles.pitch}>{next.observance.pitch} →</span>
        </Link>
      ) : null}
    </div>
  );
}

const VERB: Record<AlmanacKind, string> = { born: 'Naissance', died: 'Mort', step: '' };

const yearsAgo = (year: number, now: number) => {
  const n = now - year;
  return n === 0 ? 'cette année' : n === 1 ? 'il y a un an' : `il y a ${n} ans`;
};

/** « Ce jour-là » : naissances, décès et étapes des conquêtes à la date du jour. */
export function OnThisDay({
  events,
  thumbs,
}: {
  events: AlmanacEvent[];
  thumbs: Record<string, ReactNode>;
}) {
  const mounted = useMounted();
  const today = mounted ? new Date() : null;
  const found = today ? almanacFor(events, today) : null;
  if (!today || !found) return <div className={styles.slot} />;
  const date = `${found.day === 1 ? '1er' : found.day} ${monthName(found.month)}`;
  const heading =
    found.offset === 0
      ? `Ce jour-là, un ${date}`
      : found.offset === 1
        ? `Demain, ${date}`
        : `Dans ${found.offset} jours, le ${date}`;
  return (
    <section className={styles.slot} aria-labelledby="almanac-title" data-testid="on-this-day">
      <h2 id="almanac-title" className={`t-overline ${styles.heading}`}>
        {heading}
      </h2>
      <ol className={styles.list}>
        {found.events.map((e) => (
          <li key={`${e.kind}-${e.entityId}-${e.year}`}>
            <Link href={cultureHref(e.entityId)} className={styles.item}>
              <span className={styles.year}>{e.year}</span>
              {thumbs[e.entityId] ?? <span className={styles.noThumb} aria-hidden />}
              <span className={styles.body}>
                <span className={`t-body ${styles.what}`}>
                  {e.kind === 'step' ? (
                    <>
                      {e.text} <span className="c-2">· {e.title}</span>
                    </>
                  ) : (
                    <>
                      {VERB[e.kind]} de <strong>{e.title}</strong>
                      {e.text ? <span className="c-2"> — {e.text}</span> : null}
                    </>
                  )}
                </span>
                <span className="t-caption c-2">{yearsAgo(e.year, today.getFullYear())}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
