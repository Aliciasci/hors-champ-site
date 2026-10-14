import { Suspense } from 'react';

import { CultureCard } from '@/components/content/CultureCard';
import { PageTop } from '@/components/layout/PageTop';
import { Container } from '@/components/ui/Container';
import { getCatalog } from '@/content/catalog';
import { contributorsOf } from '@/features/culture/cultureGraph';
import { PortraitStrip } from '@/features/culture/web/PortraitStrip';
import { RightsBrowser } from '@/features/culture/web/RightsBrowser';
import { pageMetadata } from '@/lib/seo';
import type { CultureEntity } from '@/types';

export const metadata = pageMetadata({
  title: 'Derrière chaque droit',
  description:
    'Les conquêtes de droits des femmes en France, rangées par famille, avec celles qui ont fait avancer chaque combat — leur rôle tel que le décrivent les sources.',
  path: '/droits',
});

/** Version allégée d'une fiche, suffisante pour la recherche et les filtres côté client. */
function slim(entity: CultureEntity): CultureEntity {
  return {
    id: entity.id,
    kind: entity.kind,
    title: entity.title,
    summary: entity.summary,
    period: entity.period,
    right: entity.right,
    links: entity.links.filter((l) => l.relation === 'contributed'),
    sources: [],
    editorialStatus: entity.editorialStatus,
    reviewedAt: entity.reviewedAt,
  };
}

export default function Page() {
  const { culture } = getCatalog();
  const rights = culture.filter((e) => e.kind === 'right');
  const contributions = rights.flatMap((r) => contributorsOf(culture, r.id));
  // Personnalités proposées : les femmes reliées à au moins une conquête, par ordre alphabétique.
  const peopleIds = new Set(
    contributions.filter((c) => c.contributor.kind === 'person').map((c) => c.contributor.id),
  );
  const people = culture
    .filter((e) => peopleIds.has(e.id))
    .sort((a, b) => a.title.localeCompare(b.title, 'fr'));
  const contributorIds = new Set(contributions.map((c) => c.contributor.id));
  const searchable = culture
    .filter((e) => e.kind === 'right' || contributorIds.has(e.id))
    .map(slim);

  // Cartes pré-rendues côté serveur ; le composant client choisit lesquelles afficher.
  const cards = Object.fromEntries(
    rights.map((right) => {
      const women = [
        ...new Set(
          contributorsOf(culture, right.id)
            .filter((c) => c.contributor.kind === 'person')
            .map((c) => c.contributor.title),
        ),
      ];
      return [
        right.id,
        <CultureCard
          key={right.id}
          entity={right}
          context={women.length > 0 ? `Avec ${women.join(', ')}` : right.subtitle}
          testId={`rights-${right.id}`}
        />,
      ];
    }),
  );
  const peopleOptions = people.map((p) => ({ id: p.id, title: p.title }));

  return (
    <Container>
      <PageTop
        crumbs={[{ label: 'Découvrir', href: '/' }, { label: 'Derrière chaque droit' }]}
        path="/droits"
        fallback="/"
      />
      <header style={{ display: 'grid', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
        <p className="t-overline c-accent">Derrière chaque droit</p>
        <h1 className="t-title1">Les femmes derrière les conquêtes de droits</h1>
        <PortraitStrip
          people={people}
          size={88}
          label="Les contributrices"
          testIdPrefix="rights-portrait"
        />
      </header>
      <Suspense
        fallback={<RightsBrowser entities={searchable} people={peopleOptions} cards={cards} />}
      >
        <RightsBrowser entities={searchable} people={peopleOptions} cards={cards} withUrl />
      </Suspense>
    </Container>
  );
}
