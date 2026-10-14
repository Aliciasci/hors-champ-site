import { Suspense } from 'react';

import { PageMasthead } from '@/components/layout/PageMasthead';
import { Container } from '@/components/ui/Container';
import { getCatalog } from '@/content/catalog';
import { THEME_SHORT_LABELS, WallFeature, WallTile } from '@/features/portraits/web/Wall';
import { WallBrowser, type WallTheme } from '@/features/portraits/web/WallBrowser';
import { pageMetadata } from '@/lib/seo';
import type { CultureEntity, PortraitThemeId } from '@/types';

export const metadata = pageMetadata({
  title: 'Elles',
  description:
    'Elles ont fait avancer la science, bousculé l’art, arraché des droits. Tous les portraits de Hors-Champ, à parcourir par thème.',
  path: '/elles',
});

/** Premier portrait illustré d'une liste, sinon le premier tout court. */
const pickFeatured = (people: CultureEntity[]) => people.find((p) => p.image) ?? people[0];

export default function EllesPage() {
  const { themes } = getCatalog();
  const withPeople = themes.filter((t) => t.people.length > 0);
  const upcoming = themes.filter((t) => t.people.length === 0);

  // Chaque femme une seule fois, dans l'ordre chronologique ; sa première thématique l'étiquette.
  const firstTheme = new Map<string, PortraitThemeId>();
  const people = new Map<string, CultureEntity>();
  for (const theme of withPeople) {
    for (const { person } of theme.people) {
      if (!firstTheme.has(person.id)) firstTheme.set(person.id, theme.id);
      people.set(person.id, person);
    }
  }
  const ordered = [...people.values()].sort(
    (a, b) => (a.period?.sortYear ?? 9999) - (b.period?.sortYear ?? 9999),
  );

  // Sans filtre, la une va à une « oubliée » : c'est le propos de Hors-Champ.
  const oubliees = withPeople.find((t) => t.id === 'oubliees');
  const featuredAll = pickFeatured(oubliees?.people.map((m) => m.person) ?? ordered) ?? ordered[0];

  const wallThemes: WallTheme[] = withPeople.map((theme) => {
    const members = theme.people.map((m) => m.person);
    const memberIds = new Set(members.map((m) => m.id));
    return {
      id: theme.id,
      label: THEME_SHORT_LABELS[theme.id],
      subtitle: theme.subtitle,
      description: theme.description,
      personIds: ordered.filter((p) => memberIds.has(p.id)).map((p) => p.id),
      featuredId: pickFeatured(members)!.id,
    };
  });

  const tiles = Object.fromEntries(
    ordered.map((p) => [p.id, <WallTile key={p.id} person={p} theme={firstTheme.get(p.id)} />]),
  );
  const features: Record<string, React.ReactNode> = {};
  if (featuredAll) {
    features[`all:${featuredAll.id}`] = (
      <WallFeature
        person={featuredAll}
        theme={oubliees ? 'oubliees' : firstTheme.get(featuredAll.id)!}
      />
    );
  }
  for (const theme of wallThemes) {
    const person = people.get(theme.featuredId)!;
    features[`${theme.id}:${person.id}`] = <WallFeature person={person} theme={theme.id} />;
  }

  const props = {
    personIds: ordered.map((p) => p.id),
    themes: wallThemes,
    featuredId: featuredAll?.id ?? '',
    tiles,
    features,
  };

  return (
    <Container>
      <PageMasthead
        kicker="Elles"
        title="Ce qu’elles ont changé."
        accent="Et ce qu’on a oublié."
        dek={`${ordered.length} visages, du XVIᵉ siècle à aujourd’hui. Retenez-en un, la suite vient toute seule.`}
      />
      <Suspense fallback={<WallBrowser {...props} />}>
        <WallBrowser {...props} withUrl />
      </Suspense>
      {upcoming.length > 0 ? (
        <p className="t-caption c-muted measure" style={{ marginTop: 'var(--space-xxl)' }}>
          Bientôt : {upcoming.map((t) => t.title).join(', ')}. Les portraits sont en cours
          d’écriture.
        </p>
      ) : null}
    </Container>
  );
}
