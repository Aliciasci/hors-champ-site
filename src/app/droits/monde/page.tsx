import { Suspense } from 'react';

import { SourceList } from '@/components/content/SourceList';
import { PageMasthead } from '@/components/layout/PageMasthead';
import { PageTop } from '@/components/layout/PageTop';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import {
  rightGaps,
  WORLD_COUNTRIES,
  WORLD_RIGHTS,
  type GapRow,
  type WorldRight,
  type WorldRightId,
} from '@/content/world';
import { sortedVoteGaps, VOTE_GAP_SOURCE } from '@/content/world/vote-gap';
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
      <PageMasthead kicker="Dans le monde" title="Les droits de la femme à travers l’histoire" />

      <Suspense
        fallback={<WorldChapters rights={WORLD_RIGHTS} countries={WORLD_COUNTRIES} gaps={GAPS} />}
      >
        <WorldChapters rights={WORLD_RIGHTS} countries={WORLD_COUNTRIES} gaps={GAPS} withUrl />
      </Suspense>

      <p className={`t-caption c-muted ${styles.method}`}>
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
