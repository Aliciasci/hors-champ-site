import { Container } from '@/components/ui/Container';
import { getCatalog } from '@/content/catalog';
import { ThemeList } from '@/features/portraits/web/Elles';
import { pageMetadata } from '@/lib/seo';

import styles from './elles.module.css';

export const metadata = pageMetadata({
  title: 'Elles',
  description:
    'Elles ont fait avancer la science, bousculé l’art, arraché des droits. Neuf thèmes, et pour chaque portrait, la raison de sa présence ici.',
  path: '/elles',
});

export default function EllesPage() {
  const { themes } = getCatalog();
  return (
    <Container>
      <header className={styles.header}>
        <p className="t-overline c-accent">Elles</p>
        <h1 className="t-hero">Ce qu’elles ont changé</h1>
      </header>
      <ThemeList themes={themes} />
    </Container>
  );
}
