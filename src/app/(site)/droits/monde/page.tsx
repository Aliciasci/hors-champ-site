import { Suspense } from 'react';

import { cultureHref } from '@/components/content/CultureCard';
import { SourceList } from '@/components/content/SourceList';
import { PageMasthead } from '@/components/layout/PageMasthead';
import { PageTop } from '@/components/layout/PageTop';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { getCatalog } from '@/content/catalog';
import {
  rightGaps,
  WORLD_COUNTRIES,
  WORLD_RIGHTS,
  type GapRow,
  type WorldRight,
  type WorldRightId,
} from '@/content/world';
import { worldShapes } from '@/content/world/geo';
import { sortedVoteGaps, VOTE_GAP_SOURCE } from '@/content/world/vote-gap';
import { AtlasCollage, AtlasFigure } from '@/features/suffrage/AtlasCollage';
import { WorldChapters } from '@/features/suffrage/WorldChapters';
import { pageMetadata } from '@/lib/seo';

import styles from './monde.module.css';

export const metadata = pageMetadata({
  title: 'Les droits des femmes dans le monde',
  description:
    'Voter, étudier, être majeure, avorter : la carte des droits des femmes, pays après pays, de 1833 à aujourd’hui. Et la France dans tout ça.',
  path: '/droits/monde',
});

// Une même source peut servir à plusieurs droits : chacune n'est listée qu'une fois.
const SOURCES = [
  ...new Map(WORLD_RIGHTS.map((r) => [r.source.id, r.source])).values(),
  VOTE_GAP_SOURCE,
];

/** Pour le vote, l'attente est comparée aux hommes ; ailleurs, du premier pas au droit plein. */
const gapsOf = (right: WorldRight) =>
  right.id === 'vote'
    ? sortedVoteGaps().map((g) => ({ name: g.name, from: g.men, to: g.women }))
    : rightGaps(right);

/** Les années d'attente de chaque droit. */
const GAPS = Object.fromEntries(WORLD_RIGHTS.map((r) => [r.id, gapsOf(r)])) as Record<
  WorldRightId,
  GapRow[]
>;

export default function WorldPage() {
  const { culture } = getCatalog();
  const byId = new Map(culture.map((e) => [e.id, e]));
  // Thème Atlas : en-tête en collage, une femme et la fiche liées à chaque droit.
  const masthead = (
    <div className={styles.hero}>
      <div className={styles.heroText}>
        <PageMasthead
          kicker="Dans le monde"
          title="Les droits des femmes à travers l’histoire"
          tone="droits"
        />
        <p className={`t-deck only-atlas ${styles.heroDeck}`}>
          Des droits conquis à des rythmes différents. Une histoire qui continue de s’écrire.
        </p>
      </div>
      <div className="only-atlas">
        <AtlasCollage />
      </div>
    </div>
  );
  const figures = Object.fromEntries(
    WORLD_RIGHTS.flatMap((r) => {
      const person = r.figureId ? byId.get(r.figureId) : undefined;
      return person ? [[r.id, <AtlasFigure key={r.id} person={person} />]] : [];
    }),
  );
  const fiches = Object.fromEntries(
    WORLD_RIGHTS.flatMap((r) => {
      const fiche = r.ficheId ? byId.get(r.ficheId) : undefined;
      return fiche ? [[r.id, { href: cultureHref(fiche.id), title: fiche.title }]] : [];
    }),
  );
  const atlas = { shapes: worldShapes(), figures, fiches };

  return (
    <Container>
      <PageTop
        crumbs={[
          { label: 'Découvrir', href: '/' },
          { label: 'Derrière chaque droit', href: '/droits' },
          { label: 'Dans le monde' },
        ]}
        path="/droits/monde"
        fallback="/droits"
      />
      <Suspense
        fallback={
          <WorldChapters
            rights={WORLD_RIGHTS}
            countries={WORLD_COUNTRIES}
            gaps={GAPS}
            masthead={masthead}
            {...atlas}
          />
        }
      >
        <WorldChapters
          rights={WORLD_RIGHTS}
          countries={WORLD_COUNTRIES}
          gaps={GAPS}
          masthead={masthead}
          {...atlas}
          withUrl
        />
      </Suspense>

      <p className={`t-caption c-muted only-atlas ${styles.method}`}>
        Fond de carte : Natural Earth (domaine public). Un pays hachuré : la source ne dit rien pour
        ce droit ; les pays issus de la Tchécoslovaquie et de la Yougoslavie reprennent, faute de
        données propres, celles de l’État d’origine. Pour étudier, être majeure et avorter, les
        années ont été relevées dans les chronologies avec l’aide d’une IA, puis vérifiées une à une
        contre un extrait exact de la source.
      </p>
      <p className={`t-caption c-muted not-atlas ${styles.method}`}>
        Une case par pays, à une position approximative ; une case pointillée signale un pays dont
        la source ne dit rien pour ce droit. Pour étudier, être majeure et avorter, les années ont
        été relevées dans les chronologies avec l’aide d’une IA, puis vérifiées une à une contre un
        extrait exact de la source, que reprend le tableau.
      </p>

      <section className={styles.sources} aria-labelledby="sources-title">
        <SectionHeader id="sources-title" kicker="Vérifier" title="Sources" />
        <SourceList sources={SOURCES} />
      </section>
    </Container>
  );
}
