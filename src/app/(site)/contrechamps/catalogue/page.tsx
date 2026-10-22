import { PageTop } from '@/components/layout/PageTop';
import { Container } from '@/components/ui/Container';
import { getCatalog } from '@/content/catalog';
import { CatalogueIsland } from '@/features/experiences/web/Catalogue';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Catalogue des contrechamps',
  description: 'Tous les contrechamps publiés, à trier par thème, par format ou par durée.',
  path: '/contrechamps/catalogue',
});

export default function CataloguePage() {
  const { experiences, categories } = getCatalog();
  return (
    <Container>
      <PageTop
        fallback="/contrechamps"
        path="/contrechamps/catalogue"
        crumbs={[{ label: 'Contrechamps', href: '/contrechamps' }, { label: 'Catalogue' }]}
      />
      <header style={{ display: 'grid', gap: 'var(--space-sm)', marginBottom: 'var(--space-xl)' }}>
        <p className="t-overline c-accent">Contrechamps</p>
        <h1 className="t-title1">Tous les contrechamps</h1>
      </header>
      <CatalogueIsland experiences={experiences} categories={categories} />
    </Container>
  );
}
