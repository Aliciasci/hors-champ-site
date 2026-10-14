import { SourceList } from '@/components/content/SourceList';
import { PageMasthead } from '@/components/layout/PageMasthead';
import { PageTop } from '@/components/layout/PageTop';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SUFFRAGE, SUFFRAGE_SOURCE } from '@/content/suffrage';
import { WorldSuffrage } from '@/features/suffrage/WorldSuffrage';
import { pageMetadata } from '@/lib/seo';

import styles from './monde.module.css';

export const metadata = pageMetadata({
  title: 'Le droit de vote des femmes dans le monde',
  description:
    'De la Nouvelle-Zélande en 1893 à l’Arabie saoudite en 2011 : la carte du droit de vote des femmes, pays après pays. La France arrive en 1944.',
  path: '/droits/monde',
});

const byFirst = [...SUFFRAGE].sort((a, b) => a.first - b.first);
const byFull = [...SUFFRAGE].sort((a, b) => b.full - a.full);

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
      <PageMasthead
        kicker="Les droits des femmes à travers l’histoire"
        title="De 1893 à 2011, le monde s’allume."
        accent="La France, elle, arrive en 1944."
        dek="Pays après pays, les femmes obtiennent le droit de vote. Faites défiler les années, ou lancez la lecture, pour voir la carte changer."
      />

      <div className={styles.layout}>
        <WorldSuffrage countries={SUFFRAGE} />

        <aside className={styles.aside} aria-label="Repères">
          <section className={styles.list} aria-labelledby="premieres">
            <h2 id="premieres" className="t-overline c-accent">
              Les premières
            </h2>
            <ol>
              {byFirst.slice(0, 4).map((c) => (
                <li key={c.code}>
                  <span className="t-title3">{c.name}</span>
                  <span className="t-mono">{c.first}</span>
                </li>
              ))}
            </ol>
          </section>
          <section className={styles.list} aria-labelledby="dernieres">
            <h2 id="dernieres" className="t-overline c-accent">
              Les dernières
            </h2>
            <ol>
              {byFull.slice(0, 4).map((c) => (
                <li key={c.code}>
                  <span className="t-title3">{c.name}</span>
                  <span className="t-mono">{c.full}</span>
                </li>
              ))}
            </ol>
          </section>
          <p className="t-caption c-muted">
            Une case par pays, à une position approximative. « Sous conditions » : âge, niveau
            d’instruction, origine ou type d’élection, selon les pays. Les pays absents de la
            chronologie de la source ne sont pas affichés.
          </p>
        </aside>
      </div>

      <section className={styles.sources} aria-labelledby="sources-title">
        <SectionHeader id="sources-title" kicker="Vérifier" title="Source" />
        <SourceList sources={[SUFFRAGE_SOURCE]} />
      </section>
    </Container>
  );
}
