import Link from 'next/link';

import { CoverArt } from '@/components/content/CoverArt';
import { ExternalLink } from '@/components/icons';
import { Container } from '@/components/ui/Container';
import { getCatalog } from '@/content/catalog';
import { pageMetadata } from '@/lib/seo';
import type { Artwork } from '@/types';

import styles from './credits.module.css';

export const metadata = pageMetadata({
  title: 'Crédits des illustrations',
  description:
    'Toutes les œuvres, photographies et documents qui illustrent Hors-Champ : domaine public ou licence libre, avec la page qui atteste chaque licence.',
  path: '/credits',
});

interface Credit {
  artwork: Artwork;
  uses: { label: string; href: string }[];
}

/** Regroupe les illustrations par page source (une même image peut servir plusieurs fois). */
function collect(entries: { artwork: Artwork; label: string; href: string }[]): Credit[] {
  const byUrl = new Map<string, Credit>();
  for (const { artwork, label, href } of entries) {
    const credit = byUrl.get(artwork.sourceUrl) ?? { artwork, uses: [] };
    if (!credit.uses.some((u) => u.href === href)) credit.uses.push({ label, href });
    byUrl.set(artwork.sourceUrl, credit);
  }
  return [...byUrl.values()];
}

export default function CreditsPage() {
  const { categories, culture, youthItems } = getCatalog();
  const groups: { title: string; credits: Credit[] }[] = [
    {
      title: 'Thèmes des contrechamps',
      credits: collect(
        categories.flatMap((c) =>
          c.artwork
            ? [{ artwork: c.artwork, label: c.title, href: `/contrechamps/catalogue` }]
            : [],
        ),
      ),
    },
    {
      title: 'La collection',
      credits: collect(
        culture.flatMap((e) =>
          e.image ? [{ artwork: e.image, label: e.title, href: `/culture/${e.id}` }] : [],
        ),
      ),
    },
    {
      title: 'Tout est possible',
      credits: collect(
        youthItems.flatMap((i) =>
          i.image ? [{ artwork: i.image, label: i.title, href: `/possible/${i.id}` }] : [],
        ),
      ),
    },
  ];
  // Une illustration déjà créditée dans un groupe précédent n'est pas répétée.
  const seen = new Set<string>();
  for (const group of groups) {
    group.credits = group.credits.filter(
      (c) => !seen.has(c.artwork.sourceUrl) && seen.add(c.artwork.sourceUrl),
    );
  }
  const total = seen.size;

  return (
    <Container width="wide">
      <header className={styles.header}>
        <p className="t-overline c-accent">À propos</p>
        <h1 className="t-title1">Crédits des illustrations</h1>
        <p className="t-body c-2 measure">
          {total} illustrations, toutes du domaine public ou sous licence libre. Chaque crédit
          renvoie à la page qui atteste la licence.
        </p>
      </header>
      {groups.map((group) =>
        group.credits.length > 0 ? (
          <section
            key={group.title}
            className={styles.section}
            aria-labelledby={`credits-${group.title}`}
          >
            <h2 id={`credits-${group.title}`} className="t-title2">
              {group.title}
            </h2>
            <ul className={styles.grid}>
              {group.credits.map(({ artwork, uses }) => (
                <li key={artwork.sourceUrl} className={styles.item} data-testid="credit">
                  <div className={styles.thumb}>
                    <CoverArt artwork={artwork} sizes="96px" className={styles.thumbImg} />
                  </div>
                  <div className={styles.text}>
                    <p className="t-title3">{artwork.title}</p>
                    <dl className={styles.facts}>
                      <dt>Auteur</dt>
                      <dd>{artwork.artist}</dd>
                      <dt>Date</dt>
                      <dd>{artwork.date}</dd>
                      {artwork.holder ? (
                        <>
                          <dt>Conservation</dt>
                          <dd>{artwork.holder}</dd>
                        </>
                      ) : null}
                      <dt>Licence</dt>
                      <dd>{artwork.license}</dd>
                    </dl>
                    <p className="t-caption c-2">
                      Illustre :{' '}
                      {uses.map((use, index) => (
                        <span key={use.href}>
                          {index > 0 ? ', ' : ''}
                          <Link href={use.href} className="link">
                            {use.label}
                          </Link>
                        </span>
                      ))}
                    </p>
                    <a
                      href={artwork.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`link ${styles.source}`}
                    >
                      Fiche et licence
                      <ExternalLink size={14} strokeWidth={2.25} aria-hidden="true" />
                      <span className="sr-only"> (nouvel onglet)</span>
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : null,
      )}
    </Container>
  );
}
