'use client';

import { useRef } from 'react';

import { SectionHeader } from '@/components/ui/SectionHeader';
import type { GapRow, WorldCountry, WorldRight, WorldRightId } from '@/content/world';
import { readOne, useQueryState } from '@/lib/useQueryState';

import { GapPoster } from './GapPoster';
import { RightStory } from './RightStory';
import styles from './WorldChapters.module.css';
import { RightMap } from './WorldRights';
import pills from './WorldRights.module.css';

interface Props {
  rights: WorldRight[];
  countries: WorldCountry[];
  /** Les années d'attente de chaque droit, calculées côté serveur. */
  gaps: Record<WorldRightId, GapRow[]>;
  withUrl?: boolean;
}

/**
 * La page du monde, droit par droit : on choisit un droit, puis on en vit le chapitre (ouverture,
 * carte qui avance au défilement, affiche des années), et enfin la carte à explorer.
 */
export function WorldChapters(props: Props) {
  return props.withUrl ? <WithUrl {...props} /> : <View {...props} rightId="vote" />;
}

function WithUrl(props: Props) {
  const { params, set } = useQueryState();
  const rightId = readOne<WorldRightId>(
    params.get('droit'),
    props.rights.map((r) => r.id),
    'vote',
  );
  return (
    <View
      {...props}
      rightId={rightId}
      onRight={(id) => set({ droit: id === 'vote' ? null : id })}
    />
  );
}

function RightPills({
  rights,
  current,
  onPick,
  name,
  testIdPrefix,
  legend,
}: {
  rights: WorldRight[];
  current: WorldRightId;
  onPick: (id: WorldRightId) => void;
  name: string;
  testIdPrefix: string;
  legend: string;
}) {
  return (
    <fieldset className={pills.rights}>
      <legend className="sr-only">{legend}</legend>
      {rights.map((r) => (
        <label key={r.id} className={`${pills.pill} ${r.id === current ? pills.pillOn : ''}`}>
          <input
            type="radio"
            name={name}
            value={r.id}
            checked={r.id === current}
            onChange={() => onPick(r.id)}
            className="sr-only"
            data-testid={`${testIdPrefix}-${r.id}`}
          />
          {r.label}
        </label>
      ))}
    </fieldset>
  );
}

function View({
  rights,
  countries,
  gaps,
  rightId,
  onRight,
}: Props & { rightId: WorldRightId; onRight?: (id: WorldRightId) => void }) {
  const top = useRef<HTMLDivElement>(null);
  const index = Math.max(
    0,
    rights.findIndex((r) => r.id === rightId),
  );
  const right = rights[index]!;

  /** Change de droit ; depuis le bas de page, on remonte au début du chapitre. */
  const pick = (id: WorldRightId, scrollUp: boolean) => {
    onRight?.(id);
    if (scrollUp) top.current?.scrollIntoView({ block: 'start' });
  };

  return (
    <>
      <div ref={top} className={styles.picker}>
        <p className="t-overline c-2">Choisissez un droit</p>
        <RightPills
          rights={rights}
          current={right.id}
          onPick={(id) => pick(id, false)}
          name="droit"
          testIdPrefix="world-right"
          legend="Droit"
        />
      </div>

      {/* La clé remet le récit au début à chaque changement de droit. */}
      <section
        key={right.id}
        className={styles.chapter}
        aria-labelledby={`chapitre-${right.id}`}
        data-testid={`chapter-${right.id}`}
      >
        <header className={styles.opener}>
          <p className={styles.number}>{String(index + 1).padStart(2, '0')}</p>
          <h2 id={`chapitre-${right.id}`} className={styles.chapterTitle}>
            {right.chapter.title}{' '}
            <span className={styles.chapterAccent}>{right.chapter.accent}</span>
          </h2>
          {right.intro ? <p className={`t-deck ${styles.chapterIntro}`}>{right.intro}</p> : null}
        </header>
        <RightStory right={right} countries={countries} />
        <GapPoster copy={right.gap} rows={gaps[right.id]} />

        <div className={styles.explore}>
          <SectionHeader
            id="explorer-title"
            kicker="À vous d’explorer"
            title={`${right.label}, toutes les années`}
          />
          <RightMap right={right} countries={countries} />
        </div>
      </section>

      <div className={styles.next}>
        <p className="t-overline c-2">Un autre droit</p>
        <RightPills
          rights={rights}
          current={right.id}
          onPick={(id) => pick(id, true)}
          name="droit-bas"
          testIdPrefix="world-right-bottom"
          legend="Un autre droit"
        />
      </div>
    </>
  );
}
