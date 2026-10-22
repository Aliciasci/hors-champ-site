'use client';

import Link from 'next/link';
import { Fragment, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { ArrowRight, Play } from '@/components/icons';
import { Button, ButtonLink } from '@/components/ui/Button';
import { HandUnderline } from '@/components/ui/HandDrawn';
import { RecentExplorations } from '@/features/culture/web/RecentExplorations';
import {
  buildFeed,
  buildSideFeed,
  feedPages,
  FEED_PAGE_SIZE,
  pickFeaturedEntity,
  pickFeaturedExperience,
  type FeedSection,
} from '@/features/home/homeSelectors';
import { dayNumber } from '@/features/home/almanac';
import type { DailyFigure } from '@/features/home/dailyFigures';
import { findLastInProgress, hasCompleted } from '@/features/progress/progressLogic';
import { useMounted } from '@/lib/useMounted';
import { readOne, useQueryState } from '@/lib/useQueryState';
import { useAppStore } from '@/store/useAppStore';
import type { CultureEntity, Experience } from '@/types';

import styles from './HomeFeed.module.css';

const SECTIONS: { id: FeedSection; label: string; param: string | null }[] = [
  { id: 'all', label: 'À la une', param: null },
  { id: 'arts', label: 'Arts', param: 'arts' },
  { id: 'sciences', label: 'Sciences', param: 'sciences' },
  { id: 'droits', label: 'Droits', param: 'droits' },
  { id: 'sport', label: 'Sport', param: 'sport' },
];
const SECTION_IDS = SECTIONS.map((s) => s.id);
const SIDE_SIZE = 6;
/** Écart (px) à partir duquel le fil s'allonge pour rattraper la colonne de côté. */
const FILL_GAP = 120;

export interface HomeData {
  /** Fiches allégées (type, domaine, période, titre, image) : composition du fil. */
  entities: CultureEntity[];
  /** Formats du fil, pré-rendus côté serveur : article principal, carte, texte seul, brève. */
  fronts: Record<string, ReactNode>;
  cards: Record<string, ReactNode>;
  texts: Record<string, ReactNode>;
  briefs: Record<string, ReactNode>;
  /** Brèves de la colonne de côté (événements, idées), pré-rendues. */
  sideRows: Record<string, ReactNode>;
  /** Chiffres du jour possibles, un par jour à tour de rôle. */
  figures: DailyFigure[];
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

  const side = useMemo(() => buildSideFeed(data.entities, section), [data.entities, section]);

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
      <div className={styles.main} data-feed-main>
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
        <div className={styles.inFeed}>
          <FigureOfTheDay figures={data.figures} />
          <SideFeed key={section} data={data} side={side} id="side-feed-main" />
        </div>
      </div>
      <aside className={styles.aside} aria-label="À poursuivre">
        <div className={styles.asideInner}>
          <RecentExplorations tiles={data.tiles} limit={6} />
          <FigureOfTheDay figures={data.figures} />
          {practice}
          <SideFeed key={section} data={data} side={side} id="side-feed" />
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
  const [visible, setVisible] = useState(FEED_PAGE_SIZE);
  const list = useRef<HTMLDivElement>(null);
  const focusPage = useRef<number | null>(null);
  const pages = feedPages(feed.slice(0, visible));

  // Grand écran : tant que la colonne de côté dépasse nettement le fil, il s'allonge d'une page.
  useEffect(() => {
    const main = list.current?.closest<HTMLElement>('[data-feed-main]');
    const aside = main?.parentElement?.querySelector<HTMLElement>('aside');
    if (!main || !aside || typeof ResizeObserver === 'undefined') return;
    const fill = () => {
      // Colonne masquée (petit écran) : rien à rattraper.
      if (!aside.offsetParent || aside.offsetHeight - main.offsetHeight < FILL_GAP) return;
      setVisible((v) => (v < feed.length ? v + FEED_PAGE_SIZE : v));
    };
    const observer = new ResizeObserver(fill);
    observer.observe(aside);
    observer.observe(main);
    return () => observer.disconnect();
  }, [feed.length]);

  // « Afficher plus » : le focus passe sur l'article principal de la nouvelle page.
  useEffect(() => {
    if (focusPage.current === null) return;
    list.current
      ?.querySelectorAll<HTMLElement>(':scope > [data-page]')
      [focusPage.current]?.querySelector('a')
      ?.focus();
    focusPage.current = null;
  }, [visible]);

  const mobileExtras =
    section === 'all' ? (
      <>
        {practice ? <div className={styles.inFeed}>{practice}</div> : null}
        <div className={styles.inFeed}>{possible}</div>
      </>
    ) : null;

  return (
    <>
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

      <div ref={list} className={styles.feed} data-testid="discover-feed">
        {pages.map((page, index) => (
          <Fragment key={page.lead.id}>
            <section
              className={styles.page}
              data-page={index}
              aria-label={`Page ${index + 1} du fil`}
            >
              <div className={styles.front}>
                <div className={styles.frontLead}>{data.fronts[page.lead.id]}</div>
                {page.column.length ? (
                  <ol className={styles.frontColumn}>
                    {page.column.map((entity, i) => (
                      <li key={entity.id}>
                        {i === 0 ? data.cards[entity.id] : data.texts[entity.id]}
                      </li>
                    ))}
                  </ol>
                ) : null}
                {page.briefs.length ? (
                  <div className={styles.briefs}>
                    <h2 className={styles.briefsTitle}>En bref</h2>
                    <ol>
                      {page.briefs.map((entity) => (
                        <li key={entity.id}>{data.briefs[entity.id]}</li>
                      ))}
                    </ol>
                  </div>
                ) : null}
              </div>
              {page.strip.length ? (
                <ol className={styles.strip}>
                  {page.strip.map((entity) => (
                    <li key={entity.id}>{data.texts[entity.id]}</li>
                  ))}
                </ol>
              ) : null}
            </section>
            {index === 0 ? mobileExtras : null}
          </Fragment>
        ))}
      </div>

      <div className={styles.footer}>
        {feed.length > visible ? (
          <Button
            variant="secondary"
            fullWidth
            onClick={() => {
              focusPage.current = pages.length;
              setVisible((v) => v + FEED_PAGE_SIZE);
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

/** « Idées et événements » : la colonne de côté, six brèves puis « Afficher plus ». */
function SideFeed({ data, side, id }: { data: HomeData; side: CultureEntity[]; id: string }) {
  const [visible, setVisible] = useState(SIDE_SIZE);
  if (!side.length) return null;
  return (
    <section className={styles.side} aria-labelledby={id}>
      <h2 id={id} className={styles.sideTitle}>
        Idées et événements
      </h2>
      <ol className={styles.sideList} data-testid="discover-side">
        {side.slice(0, visible).map((entity) => (
          <li key={entity.id}>{data.sideRows[entity.id]}</li>
        ))}
      </ol>
      {side.length > visible ? (
        <Button variant="ghost" fullWidth onClick={() => setVisible((v) => v + SIDE_SIZE)}>
          Afficher plus
        </Button>
      ) : null}
    </section>
  );
}

/** « Le chiffre du jour » : un grand chiffre sourcé, choisi selon la date du visiteur. */
function FigureOfTheDay({ figures }: { figures: DailyFigure[] }) {
  const mounted = useMounted();
  const figure = mounted && figures.length ? figures[dayNumber(new Date()) % figures.length] : null;
  return (
    <div className={styles.figureSlot} data-testid="figure-of-the-day">
      {figure ? (
        <figure className={styles.figure}>
          <p className={styles.figureKicker}>Le chiffre du jour · {figure.topic}</p>
          <p className={styles.figureValue}>
            {figure.value} <span className={styles.figureUnit}>{figure.unit}</span>
          </p>
          <p className={styles.figureText}>{figure.text}</p>
          <figcaption className={styles.figureFoot}>
            <Link href={figure.href} className={styles.figureLink}>
              Voir la carte →
            </Link>
            <a href={figure.source.url} target="_blank" rel="noopener noreferrer">
              Source : {figure.source.publisher}
            </a>
          </figcaption>
        </figure>
      ) : null}
    </div>
  );
}
