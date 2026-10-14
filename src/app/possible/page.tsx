import { Container } from '@/components/ui/Container';
import { getCatalog } from '@/content/catalog';
import { PossibleBrowser, type TileData } from '@/features/youth/web/PossibleBrowser';
import { pageMetadata } from '@/lib/seo';
import { PageMasthead } from '@/components/layout/PageMasthead';

export const metadata = pageMetadata({
  title: 'Tout est possible',
  description:
    'Pour les 6-14 ans. Des métiers, des femmes qui les exercent pour de vrai, et des activités pour essayer.',
  path: '/possible',
});

export default function PossiblePage() {
  const { youthItems, youthLives } = getCatalog();
  const tiles: TileData[] = youthItems.map((item) => {
    switch (item.kind) {
      case 'career':
        return {
          id: item.id,
          kind: 'career',
          title: item.title,
          line: item.hook,
          image: item.image,
          doors: item.doors,
          unusual: item.unusual,
        };
      case 'portrait':
        return {
          id: item.id,
          kind: 'portrait',
          title: item.title,
          line: item.field,
          image: item.image,
          doors: item.doors,
        };
      case 'activity':
        return {
          id: item.id,
          kind: 'activity',
          title: item.title,
          line: `${item.minutes} min${item.materials.length ? ' · avec un peu de matériel' : ' · sur le site'}`,
          image: item.image,
          doors: item.doors,
        };
    }
  });
  const lives: TileData[] = youthLives.map((life) => ({
    id: life.id,
    kind: 'life',
    title: life.title,
    line: life.intro,
    doors: [],
  }));

  return (
    <Container>
      <PageMasthead
        kicker="Tout est possible · 6 – 14 ans"
        title="Astronaute, ingénieure, cheffe d’orchestre."
        accent="Et pourquoi pas toi ?"
        dek="Des métiers, des femmes qui les font pour de vrai, et des activités pour essayer. Ici, il n’y a rien à réussir."
      />
      <PossibleBrowser tiles={tiles} lives={lives} />
      <p className="t-caption c-muted measure">
        Les portraits et les métiers s’appuient sur des sources, citées sur chaque fiche. Dans les
        activités, les prénoms et les situations sont inventés.
      </p>
    </Container>
  );
}
