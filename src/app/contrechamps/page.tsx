import Link from 'next/link';

import { CoverArt } from '@/components/content/CoverArt';
import { Container } from '@/components/ui/Container';
import { EmptyState } from '@/components/ui/EmptyState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { getCatalog } from '@/content/catalog';
import styles from '@/features/experiences/web/Home.module.css';
import {
  FavoriteMark,
  FeaturedExperience,
  ProgressCard,
  RecentExperiences,
  ResumeBanner,
} from '@/features/experiences/web/HomeIslands';
import { catalogueHref } from '@/features/experiences/web/routes';
import { pageMetadata } from '@/lib/seo';
import { PageMasthead } from '@/components/layout/PageMasthead';

export const metadata = pageMetadata({
  title: 'Contrechamps',
  description:
    'Une réunion, une pub, un rayon de jouets. De courtes scènes du quotidien pour apprendre à repérer le sexisme ordinaire, sans forcer le trait.',
  path: '/contrechamps',
});

export default function ContrechampsPage() {
  const { experiences, categories } = getCatalog();
  return (
    <Container>
      <PageMasthead
        kicker="Contrechamps"
        tone="sciences"
        title="Le sexisme ne se voit pas toujours."
        accent="Regardez mieux."
      />

      {experiences.length === 0 ? (
        <EmptyState
          kicker="En préparation"
          title="Les premiers contrechamps arrivent bientôt"
          description="Chaque scène et chaque source passent en relecture avant d’être publiées. On préfère prendre le temps."
          testId="experiences-empty"
        />
      ) : (
        <>
          <ResumeBanner experiences={experiences} />
          <div className={styles.columns}>
            <FeaturedExperience experiences={experiences} categories={categories} />
            <RecentExperiences experiences={experiences} categories={categories} />
          </div>

          <section
            className={styles.section}
            aria-labelledby="angles-title"
            style={{ marginTop: 'var(--space-xxl)' }}
          >
            <SectionHeader
              kicker="Par thème"
              title="Choisissez votre sujet"
              id="angles-title"
              action={{
                label: 'Tout voir',
                href: '/contrechamps/catalogue',
                ariaLabel: 'Tout le catalogue',
              }}
            />
            <ul className={styles.tiles}>
              {categories.map((category, index) => (
                <li key={category.id}>
                  <Link
                    href={catalogueHref(category.id)}
                    className={styles.tile}
                    data-testid={`experiences-theme-${category.id}`}
                  >
                    <CoverArt
                      motif={category.motif}
                      artwork={category.artwork}
                      tone={(index % 3) as 0 | 1 | 2}
                      sizes="(min-width: 1200px) 380px, (min-width: 900px) 33vw, 50vw"
                      className={styles.tileCover}
                    />
                    <span className={styles.tileText}>
                      <span className={`t-title3 ${styles.tileTitle}`}>{category.title}</span>
                      <FavoriteMark categoryId={category.id} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <div style={{ marginTop: 'var(--space-xxl)' }}>
            <ProgressCard experiences={experiences} categories={categories} />
          </div>
        </>
      )}
    </Container>
  );
}
