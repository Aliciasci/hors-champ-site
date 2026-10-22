'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { cultureHref } from '@/components/content/CultureCard';
import { useMounted } from '@/lib/useMounted';

import {
  almanacFor,
  almanacLead,
  monthName,
  nextObservance,
  type AlmanacEvent,
  type AlmanacKind,
} from '../almanac';

import styles from './Almanac.module.css';
import { useFolded } from './useFolded';

/*
 * L'accueil daté : la date du visiteur, la prochaine journée internationale et « Ce jour-là ».
 * Le site est statique : tout se calcule après le chargement, à place réservée.
 */

const FOLD_DATELINE = 'hors-champ:accueil-ephemeride-reduite';
const FOLD_ALMANAC = 'hors-champ:accueil-ce-jour-la-reduit';

const dayLabel = (day: number) => (day === 1 ? '1er' : String(day));

const weekday = new Intl.DateTimeFormat('fr-FR', { weekday: 'long' });

/** Numéro de l'édition : le rang du jour dans l'année (1 le 1er janvier). */
const editionNumber = (date: Date) =>
  Math.round(
    (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
      Date.UTC(date.getFullYear(), 0, 1)) /
      86_400_000,
  ) + 1;

/**
 * Éphéméride : le jour en très grand, le mois, le jour de la semaine et le numéro d'édition ;
 * à côté, le compte à rebours jusqu'à la prochaine journée internationale.
 */
export function Dateline() {
  const mounted = useMounted();
  const [folded, toggle] = useFolded(FOLD_DATELINE);
  const today = mounted ? new Date() : null;
  const next = today ? nextObservance(today) : null;
  const countdown = next
    ? next.days === 0
      ? 'Aujourd’hui'
      : next.days === 1
        ? 'Demain'
        : `Dans ${next.days} jours`
    : null;
  return (
    <div className={styles.foldable} data-testid="dateline">
      {today ? <FoldButton folded={folded} onToggle={toggle} controls="dateline-body" /> : null}
      {today && folded ? (
        <div id="dateline-body" className={styles.datelineFolded}>
          <span className={styles.meta}>
            {weekday.format(today)} {today.getDate()} {monthName(today.getMonth() + 1)}{' '}
            {today.getFullYear()} · Édition n° {editionNumber(today)}
          </span>
          {next ? (
            <Link href={next.observance.href} className={styles.foldedLink}>
              <strong className={styles.foldedAccent}>{countdown}</strong> {next.observance.name} →
            </Link>
          ) : null}
        </div>
      ) : (
        <div id="dateline-body" className={styles.dateline}>
          {today ? (
            <p className={styles.date}>
              <span className={styles.day}>{today.getDate()}</span>
              <span className={styles.dateText}>
                <span className={styles.month}>{monthName(today.getMonth() + 1)}</span>
                <span className={styles.meta}>
                  {weekday.format(today)} · {today.getFullYear()}
                </span>
                <span className={styles.edition}>Édition n° {editionNumber(today)}</span>
              </span>
            </p>
          ) : null}
          {today && next ? (
            <Link href={next.observance.href} className={styles.observance}>
              {next.days === 0 ? (
                <span className={styles.countdown}>
                  <span className={styles.countNumber}>Aujourd’hui</span>
                </span>
              ) : (
                <span className={styles.countdown}>
                  <span className={styles.meta}>Dans</span>
                  <span className={styles.countNumber}>{next.days}</span>
                  <span className={styles.meta}>{next.days === 1 ? 'jour' : 'jours'}</span>
                </span>
              )}
              <span className={styles.observanceText}>
                <span className={styles.observanceDate}>
                  {dayLabel(next.observance.day)} {monthName(next.observance.month)}
                </span>
                <span className={styles.observanceName}>{next.observance.name}</span>
                <span className={styles.pitch}>{next.observance.pitch} →</span>
              </span>
            </Link>
          ) : null}
        </div>
      )}
    </div>
  );
}

/** Bouton « Réduire » / « Déplier » d'un bloc de l'accueil. */
function FoldButton({
  folded,
  onToggle,
  controls,
}: {
  folded: boolean;
  onToggle: () => void;
  controls: string;
}) {
  const Icon = folded ? ChevronDown : ChevronUp;
  return (
    <button
      type="button"
      className={styles.fold}
      onClick={onToggle}
      aria-expanded={!folded}
      aria-controls={controls}
    >
      {folded ? 'Déplier' : 'Réduire'}
      <Icon size={16} strokeWidth={2} aria-hidden />
    </button>
  );
}

const LABEL: Record<AlmanacKind, string> = { born: 'Naissance de', died: 'Mort de', step: '' };

/**
 * « Ce jour-là » : l'événement le plus ancien du jour en ouverture (portrait, « Il y a 58 ans »),
 * les autres à côté. Un jour sans événement annonce le prochain (« Dans 5 jours »).
 */
export function OnThisDay({
  events,
  thumbs,
}: {
  events: AlmanacEvent[];
  thumbs: Record<string, ReactNode>;
}) {
  const mounted = useMounted();
  const [folded, toggle] = useFolded(FOLD_ALMANAC);
  const today = mounted ? new Date() : null;
  const found = today ? almanacFor(events, today) : null;
  if (!today || !found) return <div className={styles.slot} />;
  const target = new Date(today.getFullYear(), today.getMonth(), today.getDate() + found.offset);
  const [first, ...others] = found.events;
  const { lead, accent, line } = almanacLead(first!, found.offset, target.getFullYear());
  const date = `${dayLabel(found.day)} ${monthName(found.month)}`;
  const age = target.getFullYear() - first!.year;
  return (
    <section
      className={`${styles.slot} ${folded ? styles.slotFolded : ''}`}
      aria-labelledby="almanac-title"
      data-testid="on-this-day"
    >
      <div className={styles.almanacHead}>
        <h2 id="almanac-title" className={styles.kicker}>
          {found.offset === 0 ? 'Ce jour-là' : 'Bientôt dans l’histoire'} · {weekday.format(target)}{' '}
          {date}
        </h2>
        <FoldButton folded={folded} onToggle={toggle} controls="almanac-body" />
      </div>
      {folded ? (
        <Link id="almanac-body" href={cultureHref(first!.entityId)} className={styles.foldedLink}>
          <strong className={styles.foldedAccent}>
            {lead ? `${lead} ` : null}
            {accent}
          </strong>{' '}
          {line} →
        </Link>
      ) : (
        <div id="almanac-body" className={others.length ? styles.withOthers : undefined}>
          <Link href={cultureHref(first!.entityId)} className={styles.opening}>
            <span className={styles.calendar} aria-hidden="true">
              <span className={styles.calendarPage}>
                <span className={styles.calendarHead}>
                  <span>{monthName(found.month)}</span>
                  <span>{weekday.format(target)}</span>
                </span>
                <span className={styles.calendarDay}>{found.day}</span>
                <span className={styles.calendarYear}>{first!.year}</span>
              </span>
            </span>
            <span className={styles.openingText}>
              <span className={styles.pill}>
                <span className={styles.pillDot} />
                {found.offset === 0 ? 'Aujourd’hui' : [lead, accent].filter(Boolean).join(' ')}
              </span>
              <span className={styles.meta}>
                {found.offset === 0 ? 'Il y a' : 'Il y aura'} {age === 1 ? 'un an' : `${age} ans`} ·{' '}
                {date} {first!.year}
              </span>
              <span className={styles.name}>
                {first!.kind === 'step' ? null : thumbs[first!.entityId]}
                <span className={styles.nameText}>
                  {first!.kind === 'step' ? first!.title : `${LABEL[first!.kind]} ${first!.title}`}
                </span>
              </span>
              {first!.text ? <span className={styles.detail}>{first!.text}</span> : null}
              <span className={styles.more}>
                {first!.kind === 'step' ? 'Lire la fiche' : 'Lire son portrait'} →
              </span>
            </span>
          </Link>
          {others.length ? (
            <div className={styles.others}>
              <h3 className={styles.othersTitle}>Aussi ce jour-là</h3>
              <ol className={styles.list}>
                {others.map((e) => (
                  <li key={`${e.kind}-${e.entityId}-${e.year}`}>
                    <Link href={cultureHref(e.entityId)} className={styles.item}>
                      {thumbs[e.entityId]}
                      <span className={styles.body}>
                        <span className={styles.year}>{e.year}</span>
                        <strong className={styles.what}>
                          {e.kind === 'step' ? e.title : `${LABEL[e.kind]} ${e.title}`}
                        </strong>
                        {e.text ? <span className="t-caption c-2">{e.text}</span> : null}
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
