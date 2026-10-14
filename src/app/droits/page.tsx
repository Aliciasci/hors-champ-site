import Link from 'next/link';
import { Suspense } from 'react';

import { CultureCard, cultureHref } from '@/components/content/CultureCard';
import { ArrowRight } from '@/components/icons';
import { PageMasthead } from '@/components/layout/PageMasthead';
import { PageTop } from '@/components/layout/PageTop';
import { Container } from '@/components/ui/Container';
import { getCatalog } from '@/content/catalog';
import { contributorsOf } from '@/features/culture/cultureGraph';
import { PortraitStrip } from '@/features/culture/web/PortraitStrip';
import { RightsBrowser } from '@/features/culture/web/RightsBrowser';
import { BirthYear, type ConquestYear } from '@/features/rights/BirthYear';
import { pageMetadata } from '@/lib/seo';
import type { CultureEntity } from '@/types';

import styles from './droits.module.css';

export const metadata = pageMetadata({
  title: 'Derrière chaque droit',
  description:
    'Le droit de vote, de travailler, d’ouvrir un compte, d’avorter. Comment les femmes les ont obtenus en France, et qui s’est battue pour ça.',
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
  // Libellés courts des conquêtes, pour les lignes de vie de « Et vous ? ».
  const SHORT: Record<string, string> = {
    'right-droit-de-vote': 'vote',
    'right-regimes-matrimoniaux': 'autonomie',
    'right-contraception': 'contraception',
    'right-ivg': 'IVG',
    'right-viol-crime': 'viol = crime',
    'right-egalite-professionnelle': 'égalité au travail',
  };
  const conquests: ConquestYear[] = rights
    .filter((r) => r.period)
    .map((r) => ({
      id: r.id,
      title: r.title,
      short: SHORT[r.id] ?? r.title,
      year: r.period!.sortYear,
      href: cultureHref(r.id),
    }));
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
      <PageMasthead
        kicker="Derrière chaque droit"
        tone="droits"
        title="Rien ne leur a été donné."
        accent="Elles l’ont arraché."
        dek="Voter, ouvrir un compte en banque, choisir d’avoir un enfant. Chacun de ces droits a demandé des années de combat. Voici qui les a portés, et ce que les sources disent de leur rôle."
      />
      <BirthYear conquests={conquests} />
      <Link href="/droits/monde" className={styles.world} data-testid="rights-world">
        <span className="t-overline c-accent">Et ailleurs ?</span>
        <span className={styles.worldRow}>
          <span className="t-title3">
            Le droit de vote des femmes dans le monde, de 1893 à 2011
          </span>
          <ArrowRight size={20} aria-hidden="true" className="c-primary" />
        </span>
      </Link>
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <PortraitStrip
          people={people}
          size={88}
          label="Les contributrices"
          testIdPrefix="rights-portrait"
        />
      </div>
      <Suspense
        fallback={<RightsBrowser entities={searchable} people={peopleOptions} cards={cards} />}
      >
        <RightsBrowser entities={searchable} people={peopleOptions} cards={cards} withUrl />
      </Suspense>
    </Container>
  );
}
