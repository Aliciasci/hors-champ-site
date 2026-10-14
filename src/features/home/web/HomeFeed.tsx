'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { ArrowRight, Play } from '@/components/icons';
import { Button, ButtonLink } from '@/components/ui/Button';
import { HandUnderline } from '@/components/ui/HandDrawn';
import { RecentExplorations } from '@/features/culture/web/RecentExplorations';
import {
  buildFeed,
  pickFeaturedEntity,
  pickFeaturedExperience,
  type FeedSection,
} from '@/features/home/homeSelectors';
import { findLastInProgress, hasCompleted } from '@/features/progress/progressLogic';
import { readOne, useQueryState } from '@/lib/useQueryState';
import { useAppStore } from '@/store/useAppStore';
import type { CultureEntity, Experience } from '@/types';

import styles from './HomeFeed.module.css';

const SECTIONS: { id: FeedSection; label: string; param: string | null }[] = [
  { id: 'all', label: 'À la une', param: null },
  { id: 'arts', label: 'Arts', param: 'arts' },
  { id: 'sciences', label: 'Sciences', param: 'sciences' },
  { id: 'droits', label: 'Droits', param: 'droits' },
];
const SECTION_IDS = SECTIONS.map((s) => s.id);
const PAGE_SIZE = 10;

export interface HomeData {
  /** Fiches allégées (type, domaine, période, titre, image) : composition du fil. */
  entities: CultureEntity[];
  /** Lignes du fil, pré-rendues côté serveur. */
  rows: Record<string, ReactNode>;
  /** Articles de tête possibles, pré-rendus. */
  leads: Record<string, ReactNode>;
  /** Contrechamps allégés (id, thème, niveau, titre). */
  experiences: Experience[];
  /** Cartes compactes de contrechamp, pré-rendues. */
  experienceCards: Record<string, ReactNode>;
  /** Contrechamps liés à chaque fiche pouvant passer en tête. */
  linkedExperiences: Record<string, string[]>;
  /** Tuiles « Vos dernières explorations ». */
  tiles: Record<string, ReactNode>;
  total: number;
}

export function HomeFeed({ data, withUrl = false }: { data: HomeData; withUrl?: boolean }) {
  return withUrl ? <WithUrl data={data} /> : <Feed data={data} section="all" />;
}

function WithUrl({ data }: { data: HomeData }) {
  const { params } = useQueryState();
  const section = readOne<FeedSection>(params.get('rubrique'), SECTION_IDS, 'all');
  return <Feed data={data} section={section} />;
}

/** Rubriques en onglets de texte soulignés : de vrais liens (`?rubrique=`), partageables. */
function SectionTabs({ value }: { value: FeedSection }) {
  return (
    <nav aria-label="Rubriques du fil" className={styles.tabs}>
      <ul>
        {SECTIONS.map((section) => {
          const selected = section.id === value;
          return (
            <li key={section.id}>
              <Link
                href={section.param ? `/?rubrique=${section.param}` : '/'}
                scroll={false}
                aria-current={selected ? 'page' : undefined}
                className={`${styles.tab} ${selected ? styles.tabOn : ''} dot-domain`}
                data-domain={section.param ?? undefined}
                data-testid={`discover-tab-${section.id}`}
              >
                {section.label}
                {selected ? <HandUnderline /> : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function Feed({ data, section }: { data: HomeData; section: FeedSection }) {
  const hydrated = useAppStore((s) => s.hasHydrated);
  const progress = useAppStore((s) => s.progress);
  const preferences = useAppStore((s) => s.preferences);

  // La fiche à la une est choisie une fois les données locales chargées, puis ne bouge plus
  // pendant la lecture. Avant : la même que celle du rendu serveur (ordre déterministe).
  const featuredId = useMemo(
    () =>
      pickFeaturedEntity(data.entities, hydrated ? useAppStore.getState().exploredEntityIds : [])
        ?.id,
    [data.entities, hydrated],
  );
  const feed = useMemo(
    () => buildFeed(data.entities, section, featuredId),
    [data.entities, section, featuredId],
  );

  const experienceIds = new Set(data.experiences.map((e) => e.id));
  const lastInProgress = findLastInProgress(progress, experienceIds);
  const resume = lastInProgress
    ? data.experiences.find((e) => e.id === lastInProgress.experienceId)
    : undefined;
  const linked = (featuredId ? data.linkedExperiences[featuredId] : undefined) ?? [];
  const suggestion =
    data.experiences.find((e) => linked.includes(e.id) && !hasCompleted(progress[e.id])) ??
    pickFeaturedExperience(data.experiences, progress, preferences);

  const practice =
    resume || suggestion ? (
      <div className={styles.practice} data-testid="discover-practice">
        <div className={styles.practiceHead}>
          <div>
            <p className="t-overline c-accent">Contrechamps</p>
            <h2 className="t-title2">Et vous, vous l’auriez vu ?</h2>
          </div>
          <Link href="/contrechamps" className={styles.more}>
            Tout voir
          </Link>
        </div>
        {resume ? (
          <Link
            href={`/contrechamps/${resume.id}/jouer`}
            className={styles.resume}
            data-testid="discover-resume"
          >
            <Play size={18} fill="currentColor" aria-hidden="true" />
            <span>
              <span className="t-overline">Reprendre</span>
              <span className={`t-title3 ${styles.resumeTitle}`}>{resume.title}</span>
            </span>
          </Link>
        ) : suggestion ? (
          <div data-testid="discover-experience">{data.experienceCards[suggestion.id]}</div>
        ) : null}
      </div>
    ) : null;

  const possible = (
    <Link href="/possible" className={styles.possible} data-testid="discover-possible">
      <span className="t-overline c-accent">Tout est possible · 6 – 14 ans</span>
      <span className="t-title2">
        Astronaute, ingénieure, cheffe d’orchestre. Et pourquoi pas toi ?
      </span>
      <span className={styles.moreRow}>
        Explorer
        <ArrowRight size={18} aria-hidden="true" />
      </span>
    </Link>
  );

  return (
    <div className={styles.layout}>
      <div className={styles.main}>
        <SectionTabs value={section} />
        {/* La clé remet la pagination à zéro à chaque changement de rubrique. */}
        <FeedList
          key={section}
          data={data}
          section={section}
          feed={feed}
          practice={practice}
          possible={possible}
        />
      </div>
      <aside className={styles.aside} aria-label="À poursuivre">
        <div className={styles.asideInner}>
          {practice}
          <RecentExplorations tiles={data.tiles} limit={6} />
          {possible}
        </div>
      </aside>
    </div>
  );
}

function FeedList({
  data,
  section,
  feed,
  practice,
  possible,
}: {
  data: HomeData;
  section: FeedSection;
  feed: CultureEntity[];
  practice: ReactNode;
  possible: ReactNode;
}) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const list = useRef<HTMLOListElement>(null);
  const focusIndex = useRef<number | null>(null);
  const [lead, ...rest] = feed;
  const shown = rest.slice(0, visible);

  // « Afficher plus » : le focus passe sur le premier nouvel article.
  useEffect(() => {
    if (focusIndex.current === null) return;
    const items = list.current?.querySelectorAll<HTMLAnchorElement>(':scope > li > a');
    items?.[focusIndex.current]?.focus();
    focusIndex.current = null;
  }, [visible]);

  const inFeedPractice = practice ? <li className={styles.inFeed}>{practice}</li> : null;

  return (
    <>
      {lead ? (data.leads[lead.id] ?? data.rows[lead.id]) : null}

      {section === 'all' ? <div className={styles.inFeed}>{possible}</div> : null}

      {section === 'droits' ? (
        <Link href="/droits" className={styles.inset} data-testid="discover-rights">
          <span className="t-overline c-accent">Derrière chaque droit</span>
          <span className={styles.moreRow}>
            <span className="t-title3">
              Voter, travailler, disposer de son corps. Qui s’est battue pour quoi
            </span>
            <ArrowRight size={20} aria-hidden="true" className="c-primary" />
          </span>
        </Link>
      ) : null}

      <ol ref={list} className={styles.feed} data-testid="discover-feed">
        {shown.map((entity, index) => (
          <FeedEntry
            key={entity.id}
            before={section === 'all' && index === 3 ? inFeedPractice : null}
          >
            {data.rows[entity.id]}
          </FeedEntry>
        ))}
        {section === 'all' && shown.length <= 3 ? inFeedPractice : null}
      </ol>

      <div className={styles.footer}>
        {rest.length > visible ? (
          <Button
            variant="secondary"
            fullWidth
            onClick={() => {
              focusIndex.current = visible;
              setVisible((v) => v + PAGE_SIZE);
            }}
            data-testid="discover-more"
          >
            Afficher plus
          </Button>
        ) : null}
        <ButtonLink
          href="/collection"
          variant="ghost"
          icon={ArrowRight}
          fullWidth
          data-testid="discover-collection"
        >
          {`Toute la collection · ${data.total} fiches`}
        </ButtonLink>
      </div>
    </>
  );
}

function FeedEntry({ before, children }: { before: ReactNode; children: ReactNode }) {
  return (
    <>
      {before}
      <li>{children}</li>
    </>
  );
}
