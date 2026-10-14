'use client';

import { useRef, useState, type ReactNode } from 'react';

import { ArrowRight } from '@/components/icons';
import { MastheadRow } from '@/components/layout/MastheadRow';
import { Segmented } from '@/components/ui/Chip';
import type { GapRow, WorldCountry, WorldRight, WorldRightId } from '@/content/world';
import type { WorldShapes } from '@/content/world/geoShared';
import { readOne, useQueryState } from '@/lib/useQueryState';
import type { Tone } from '@/types';

import { AtlasDates, AtlasStory } from './AtlasStory';
import { GapPoster } from './GapPoster';
import { GeoLegend, GeoRightMap } from './GeoRightMap';
import { RightStory } from './RightStory';
import styles from './WorldChapters.module.css';
import { RightMap } from './WorldRights';
import pills from './WorldRights.module.css';

/** Une teinte par droit : pastille choisie, numéro et accent du chapitre. */
export const RIGHT_TONES: Record<WorldRightId, Tone> = {
  vote: 'droits',
  universite: 'sciences',
  majorite: 'ocre',
  avortement: 'arts',
};

interface Props {
  rights: WorldRight[];
  countries: WorldCountry[];
  /** Les années d'attente de chaque droit, calculées côté serveur. */
  gaps: Record<WorldRightId, GapRow[]>;
  /** En-tête de la page, rendu côté serveur : le choix du mode se place à sa droite. */
  masthead?: ReactNode;
  /** Thème Atlas : la vraie carte, une femme et la fiche liées à chaque droit. */
  shapes?: WorldShapes;
  figures?: Partial<Record<WorldRightId, ReactNode>>;
  fiches?: Partial<Record<WorldRightId, { href: string; title: string }>>;
  withUrl?: boolean;
}

type Mode = 'recit' | 'explorer';

const MODES: { id: Mode; label: string }[] = [
  { id: 'recit', label: 'Le récit' },
  { id: 'explorer', label: 'À vous d’explorer' },
];

/**
 * La page du monde, droit par droit. Deux modes, choisis en haut : le récit (ouverture, carte qui
 * avance au défilement, affiche des années) ou la carte à explorer soi-même, année par année.
 */
export function WorldChapters(props: Props) {
  return props.withUrl ? <WithUrl {...props} /> : <View {...props} rightId="vote" mode="recit" />;
}

function WithUrl(props: Props) {
  const { params, set } = useQueryState();
  const rightId = readOne<WorldRightId>(
    params.get('droit'),
    props.rights.map((r) => r.id),
    'vote',
  );
  const mode = readOne<Mode>(params.get('mode'), ['recit', 'explorer'], 'recit');
  return (
    <View
      {...props}
      rightId={rightId}
      mode={mode}
      onRight={(id) => set({ droit: id === 'vote' ? null : id })}
      onMode={(m) => set({ mode: m === 'recit' ? null : m })}
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
        <label
          key={r.id}
          className={`${pills.pill} ${r.id === current ? pills.pillOn : ''} dot-domain`}
          data-tone={RIGHT_TONES[r.id]}
        >
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
  masthead,
  shapes,
  figures,
  fiches,
  rightId,
  mode,
  onRight,
  onMode,
}: Props & {
  rightId: WorldRightId;
  mode: Mode;
  onRight?: (id: WorldRightId) => void;
  onMode?: (mode: Mode) => void;
}) {
  const top = useRef<HTMLDivElement>(null);
  const index = Math.max(
    0,
    rights.findIndex((r) => r.id === rightId),
  );
  const right = rights[index]!;
  // Thème Atlas : un pays choisi dans la liste, mis en évidence sur la carte.
  const [focus, setFocus] = useState<string | null>(null);
  const byName = [...countries].sort((a, b) => a.name.localeCompare(b.name, 'fr'));

  /** Change de droit ; depuis le bas de page, on remonte au début du chapitre. */
  const pick = (id: WorldRightId, scrollUp: boolean) => {
    onRight?.(id);
    if (scrollUp) top.current?.scrollIntoView({ block: 'start' });
  };

  return (
    <>
      <MastheadRow
        masthead={masthead}
        modes={
          <Segmented
            legend="Mode"
            name="mode"
            options={MODES}
            value={mode}
            onChange={(m) => onMode?.(m)}
            testIdPrefix="world-mode"
          />
        }
      />
      <div ref={top} className={styles.picker}>
        <p className="t-overline c-2" aria-hidden="true">
          Choisissez un droit
        </p>
        <RightPills
          rights={rights}
          current={right.id}
          onPick={(id) => pick(id, false)}
          name="droit"
          testIdPrefix="world-right"
          legend="Droit"
        />
        {shapes ? (
          <div className={`${styles.countryWrap} only-atlas`}>
            <label className={styles.country}>
              <span className="sr-only">Pays</span>
              <select
                value={focus ?? ''}
                onChange={(event) => setFocus(event.target.value || null)}
                data-testid="atlas-country"
              >
                <option value="">Tous les pays</option>
                {byName.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : null}
      </div>

      {mode === 'explorer' ? (
        <section
          key={right.id}
          className={styles.explore}
          data-tone={RIGHT_TONES[right.id]}
          aria-labelledby="explorer-title"
          data-testid={`explore-${right.id}`}
        >
          {/* Le mode, choisi en haut, sert de titre visible ; celui-ci guide les lecteurs d'écran. */}
          <h2 id="explorer-title" className="sr-only">
            À vous d’explorer : {right.label.toLowerCase()}, toutes les années
          </h2>
          <RightMap
            right={right}
            countries={countries}
            geo={
              shapes
                ? (year, label) => (
                    <div className={styles.geoExplore}>
                      <GeoRightMap
                        right={right}
                        year={year}
                        shapes={shapes}
                        countries={countries}
                        label={label}
                        focus={focus}
                        callout={
                          focus
                            ? {
                                code: focus,
                                title: String(year),
                                subtitle: byName.find((c) => c.code === focus)?.name ?? focus,
                              }
                            : null
                        }
                      />
                      <GeoLegend right={right} />
                    </div>
                  )
                : undefined
            }
          />
        </section>
      ) : (
        <>
          <div className={shapes ? 'not-atlas' : undefined}>
            <Story
              rights={rights}
              right={right}
              index={index}
              countries={countries}
              gaps={gaps}
              onPick={pick}
            />
          </div>
          {shapes ? (
            <div className="only-atlas" data-tone={RIGHT_TONES[right.id]}>
              <AtlasStory
                key={right.id}
                right={right}
                countries={countries}
                shapes={shapes}
                figure={figures?.[right.id]}
                fiche={fiches?.[right.id]}
                focus={focus}
              />
              <AtlasDates right={right} countries={countries} shapes={shapes} />
            </div>
          ) : null}
        </>
      )}
    </>
  );
}

/** Le récit d'un droit : ouverture, carte au défilement, affiche, puis le choix d'un autre droit. */
function Story({
  rights,
  right,
  index,
  countries,
  gaps,
  onPick,
}: {
  rights: WorldRight[];
  right: WorldRight;
  index: number;
  countries: WorldCountry[];
  gaps: Record<WorldRightId, GapRow[]>;
  onPick: (id: WorldRightId, scrollUp: boolean) => void;
}) {
  return (
    <>
      {/* La clé remet le récit au début à chaque changement de droit. */}
      <section
        key={right.id}
        className={styles.chapter}
        data-tone={RIGHT_TONES[right.id]}
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
      </section>

      <NextChapter rights={rights} index={index} onPick={(id) => onPick(id, true)} />
    </>
  );
}

/**
 * Fin de chapitre : le suivant s'annonce en grand, à sa couleur (après le dernier, le premier).
 * Un clic remonte au début du nouveau chapitre, dont l'ouverture se révèle.
 */
function NextChapter({
  rights,
  index,
  onPick,
}: {
  rights: WorldRight[];
  index: number;
  onPick: (id: WorldRightId) => void;
}) {
  const nextIndex = (index + 1) % rights.length;
  const next = rights[nextIndex]!;
  const current = rights[index]!;
  return (
    <nav className={styles.next} aria-label="Chapitres">
      <button
        type="button"
        className={styles.nextChapter}
        data-tone={RIGHT_TONES[next.id]}
        onClick={() => onPick(next.id)}
        data-testid="world-next-chapter"
      >
        <span className={styles.nextKicker}>
          Chapitre suivant · {String(nextIndex + 1).padStart(2, '0')}
        </span>
        <span className={styles.nextTitle}>
          {next.chapter.title} <span className={styles.nextAccent}>{next.chapter.accent}</span>
        </span>
        <ArrowRight className={styles.nextArrow} size={40} strokeWidth={1.5} aria-hidden="true" />
      </button>
      <div className={styles.others}>
        <p className="t-overline c-2" aria-hidden="true">
          Ou bien
        </p>
        <RightPills
          rights={rights.filter((r) => r.id !== next.id && r.id !== current.id)}
          current={current.id}
          onPick={onPick}
          name="droit-bas"
          testIdPrefix="world-right-bottom"
          legend="Un autre droit"
        />
      </div>
    </nav>
  );
}
