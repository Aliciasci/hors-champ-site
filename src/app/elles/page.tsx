import { Container } from '@/components/ui/Container';
import { getCatalog } from '@/content/catalog';
import { ThemeList } from '@/features/portraits/web/Elles';
import { pageMetadata } from '@/lib/seo';

import styles from './elles.module.css';

export const metadata = pageMetadata({
  title: 'Elles — neuf thématiques',
  description:
    'Des femmes qui ont révolutionné le monde, changé la culture, conquis des droits, changé nos idées : neuf thématiques, chaque portrait avec la raison de sa présence.',
  path: '/elles',
});

export default function EllesPage() {
  const { themes } = getCatalog();
  return (
    <Container>
      <header className={styles.header}>
        <p className="t-overline c-accent">Elles · neuf thématiques</p>
        <h1 className="t-hero">Ce qu’elles ont changé</h1>
      </header>
      <ThemeList themes={themes} />
    </Container>
  );
}
