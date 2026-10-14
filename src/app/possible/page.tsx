import { Container } from '@/components/ui/Container';
import { getCatalog } from '@/content/catalog';
import { PossibleBrowser, type TileData } from '@/features/youth/web/PossibleBrowser';
import styles from '@/features/youth/web/youth.module.css';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Tout est possible',
  description:
    'Métiers, portraits de femmes réelles et activités pour les 6–14 ans : le monde est plus grand que tu ne l’imagines.',
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
      <header className={styles.header}>
        <p className="t-overline c-accent">Tout est possible · 6 – 14 ans</p>
        <h1 className="t-hero">Le monde est plus grand que tu ne l’imagines.</h1>
        <p className="t-body-lg c-2">Rien à réussir, tout à découvrir.</p>
      </header>
      <PossibleBrowser tiles={tiles} lives={lives} />
      <p className="t-caption c-muted measure">
        Les portraits et les métiers s’appuient sur des sources citées sur chaque fiche. Les
        activités sont des exemples pédagogiques : les prénoms et les situations y sont inventés.
      </p>
    </Container>
  );
}
