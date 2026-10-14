import Link from 'next/link';
import { Suspense } from 'react';

import { ContentCard } from '@/components/content/ContentCard';
import { PageMasthead } from '@/components/layout/PageMasthead';
import { Container } from '@/components/ui/Container';
import { EmptyState } from '@/components/ui/EmptyState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { getCatalog } from '@/content/catalog';
import styles from '@/features/activities/Activities.module.css';
import { ActivitiesBrowser } from '@/features/activities/ActivitiesBrowser';
import { ActivityCard } from '@/features/activities/ActivityCard';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Activités',
  description:
    'Des scènes du quotidien à décrypter pour les ados et les adultes, des énigmes et des bricolages pour les 6-14 ans. Quelques minutes suffisent.',
  path: '/activites',
});

const plural = (count: number, one: string, many: string) => `${count} ${count > 1 ? many : one}`;

export default function ActivitiesPage() {
  const { experiences, categories, youthItems, youthLives } = getCatalog();
  const activities = youthItems
    .filter((item) => item.kind === 'activity')
    .sort((a, b) => a.minutes - b.minutes);
  const careers = youthItems.filter((item) => item.kind === 'career').length;
  const portraits = youthItems.filter((item) => item.kind === 'portrait').length;

  const adults = (
    <section className={styles.section} aria-labelledby="contrechamps-title">
      <SectionHeader
        id="contrechamps-title"
        kicker="Contrechamps · ados et adultes"
        title="Le sexisme ne se voit pas toujours."
        action={
          experiences.length > 0
            ? { label: 'Tous les contrechamps', href: '/contrechamps/catalogue' }
            : undefined
        }
      />
      {experiences.length > 0 ? (
        <ul className={styles.contrechamps} data-testid="activities-contrechamps">
          {experiences.map((experience, index) => (
            <li key={experience.id}>
              <ContentCard
                experience={experience}
                category={categories.find((c) => c.id === experience.categoryId)}
                index={index}
                eager={index < 3}
              />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          kicker="En préparation"
          title="Les premiers contrechamps arrivent bientôt"
          description="Chaque scène et chaque source passent en relecture avant d’être publiées. On préfère prendre le temps."
          headingLevel={3}
          testId="activities-contrechamps-empty"
        />
      )}
    </section>
  );

  const kids = (
    <section className={`${styles.section} ${styles.kids}`} aria-labelledby="possible-title">
      <SectionHeader
        id="possible-title"
        kicker="Tout est possible · 6 – 14 ans"
        title="Et pourquoi pas toi ?"
        action={{ label: 'Toute la rubrique', href: '/possible', ariaLabel: 'Tout est possible' }}
      />
      <ul className={styles.activities} data-testid="activities-kids">
        {activities.map((activity) => (
          <li key={activity.id}>
            <ActivityCard
              id={activity.id}
              kind={activity.activityKind}
              title={activity.title}
              minutes={activity.minutes}
              withMaterials={activity.materials.length > 0}
            />
          </li>
        ))}
      </ul>
      <p className={`t-label ${styles.also}`}>
        <span>Aussi :</span>
        <Link href="/possible" className="link">
          {plural(careers, 'métier', 'métiers')}
        </Link>
        <Link href="/possible" className="link">
          {plural(portraits, 'portrait de femme', 'portraits de femmes')}
        </Link>
        <Link href="/possible" className="link">
          {plural(youthLives.length, 'collection', 'collections')}
        </Link>
      </p>
    </section>
  );

  return (
    <Container>
      <PageMasthead
        kicker="Activités"
        tone="ocre"
        title="À vous de jouer."
        accent="De 6 à 106 ans."
        dek="Des scènes du quotidien à décrypter, des énigmes et des bricolages pour les plus jeunes. Quelques minutes suffisent."
      />
      <Suspense fallback={<ActivitiesBrowser adults={adults} kids={kids} />}>
        <ActivitiesBrowser adults={adults} kids={kids} withUrl />
      </Suspense>
    </Container>
  );
}
