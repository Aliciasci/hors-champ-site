import { Suspense } from 'react';

import { ContentCard } from '@/components/content/ContentCard';
import { WelcomeBanner } from '@/components/layout/WelcomeBanner';
import { Container } from '@/components/ui/Container';
import { JsonLd } from '@/components/ui/JsonLd';
import { getCatalog } from '@/content/catalog';
import { slimEntity, slimExperience } from '@/content/slim';
import { relatedExperiences } from '@/features/culture/cultureGraph';
import { CultureTile } from '@/features/culture/web/CultureTile';
import { buildFeed, type FeedSection } from '@/features/home/homeSelectors';
import { FeedLead, FeedRow } from '@/features/home/web/FeedItems';
import { HomeFeed, type HomeData } from '@/features/home/web/HomeFeed';
import { readingMinutes } from '@/lib/readingTime';
import { pageMetadata } from '@/lib/seo';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';
import { PageMasthead } from '@/components/layout/PageMasthead';

export const metadata = pageMetadata({
  title: 'Celles que l’histoire a laissées hors champ',
  description: SITE_DESCRIPTION,
  path: '/',
});

const SECTIONS: FeedSection[] = ['all', 'arts', 'sciences', 'droits'];

export default function Home() {
  const { culture, experiences, categories } = getCatalog();

  // Articles de tête possibles : les femmes illustrées (fiche à la une) et la première fiche
  // de chaque rubrique (quand la fiche à la une n'en fait pas partie).
  const leadIds = new Set([
    ...culture.filter((e) => e.kind === 'person' && e.image).map((e) => e.id),
    ...SECTIONS.map((s) => buildFeed(culture, s)[0]?.id).filter((id): id is string => !!id),
  ]);
  const firstLead = buildFeed(culture, 'all')[0]?.id;

  const data: HomeData = {
    entities: culture.map(slimEntity),
    rows: Object.fromEntries(
      culture.map((e) => [
        e.id,
        <FeedRow key={e.id} entity={e} minutes={readingMinutes(e, culture)} />,
      ]),
    ),
    leads: Object.fromEntries(
      culture
        .filter((e) => leadIds.has(e.id))
        .map((e) => [
          e.id,
          <FeedLead
            key={e.id}
            entity={e}
            minutes={readingMinutes(e, culture)}
            priority={e.id === firstLead}
          />,
        ]),
    ),
    experiences: experiences.map(slimExperience),
    experienceCards: Object.fromEntries(
      experiences.map((x, index) => [
        x.id,
        <ContentCard
          key={x.id}
          variant="compact"
          index={index}
          experience={x}
          category={categories.find((c) => c.id === x.categoryId)}
        />,
      ]),
    ),
    linkedExperiences: Object.fromEntries(
      [...leadIds].map((id) => [id, relatedExperiences(culture, id, experiences).map((x) => x.id)]),
    ),
    tiles: Object.fromEntries(
      culture.map((e) => [e.id, <CultureTile key={e.id} entity={e} size={96} />]),
    ),
    total: culture.length,
  };

  return (
    <Container>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: SITE_NAME,
          url: `${SITE_URL}/`,
          inLanguage: 'fr',
          description: SITE_DESCRIPTION,
        }}
      />
      <PageMasthead
        kicker="Hors-Champ"
        title="L’histoire les a laissées hors champ."
        accent="On les remet dans le cadre."
        centered
      />
      <Suspense fallback={<HomeFeed data={data} />}>
        <HomeFeed data={data} withUrl />
      </Suspense>
      <WelcomeBanner />
    </Container>
  );
}
