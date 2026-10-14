import { Suspense } from 'react';

import { StoryRow } from '@/components/content/StoryRow';
import { PageTop } from '@/components/layout/PageTop';
import { Container } from '@/components/ui/Container';
import { getCatalog } from '@/content/catalog';
import { sortForBrowsing } from '@/features/culture/cultureGraph';
import { CollectionBrowser, ExploredCount } from '@/features/culture/web/CollectionBrowser';
import { CultureTile } from '@/features/culture/web/CultureTile';
import { RecentExplorations } from '@/features/culture/web/RecentExplorations';
import { TimelineEntry } from '@/features/culture/web/TimelineEntry';
import { readingMinutes } from '@/lib/readingTime';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Toute la collection',
  description:
    'Les femmes, les œuvres, les inventions, les droits et les idées de Hors-Champ. Chaque fiche est sourcée et renvoie aux autres.',
  path: '/collection',
});

export default function Page() {
  const { culture } = getCatalog();
  const sorted = sortForBrowsing(culture);
  const items = sorted.map((e) => ({ id: e.id, kind: e.kind, domain: e.domain }));
  const cards = Object.fromEntries(
    sorted
      .filter((e) => e.kind !== 'event')
      .map((e) => [
        e.id,
        <StoryRow
          key={e.id}
          entity={e}
          minutes={readingMinutes(e, culture)}
          testId={`culture-${e.id}`}
        />,
      ]),
  );
  const timeline = Object.fromEntries(
    sorted
      .filter((e) => e.kind === 'event')
      .map((e) => [e.id, <TimelineEntry key={e.id} entity={e} />]),
  );
  const tiles = Object.fromEntries(
    culture.map((e) => [e.id, <CultureTile key={e.id} entity={e} />]),
  );

  return (
    <Container>
      <PageTop
        crumbs={[{ label: 'Découvrir', href: '/' }, { label: 'Toute la collection' }]}
        path="/collection"
        fallback="/"
      />
      <header style={{ display: 'grid', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
        <p className="t-overline c-accent">La collection</p>
        <h1 className="t-title1">Toutes les fiches</h1>
        <p className="t-body-lg c-2 measure">
          Portraits, œuvres, inventions, lois, mouvements. Commencez où vous voulez, chaque fiche
          mène aux autres.
        </p>
        <ExploredCount ids={culture.map((e) => e.id)} total={culture.length} />
      </header>
      <div style={{ display: 'grid', gap: 'var(--space-xl)' }}>
        <RecentExplorations tiles={tiles} />
        <Suspense fallback={<CollectionBrowser items={items} cards={cards} timeline={timeline} />}>
          <CollectionBrowser items={items} cards={cards} timeline={timeline} withUrl />
        </Suspense>
      </div>
    </Container>
  );
}
