import { Suspense } from 'react';

import { ContentCard } from '@/components/content/ContentCard';
import { cultureHref } from '@/components/content/CultureCard';
import { WelcomeBanner } from '@/components/layout/WelcomeBanner';
import { Container } from '@/components/ui/Container';
import { JsonLd } from '@/components/ui/JsonLd';
import { getCatalog } from '@/content/catalog';
import { slimEntity, slimExperience } from '@/content/slim';
import { relatedExperiences } from '@/features/culture/cultureGraph';
import { CultureTile } from '@/features/culture/web/CultureTile';
import { CultureThumb } from '@/components/content/CultureThumb';
import { almanacEvents } from '@/features/home/almanac';
import { dailyFigures } from '@/features/home/dailyFigures';
import { buildFeed, type FeedSection } from '@/features/home/homeSelectors';
import { Dateline, OnThisDay } from '@/features/home/web/Almanac';
import {
  FeedBrief,
  FeedCard,
  FeedFront,
  FeedSideRow,
  FeedText,
} from '@/features/home/web/FeedItems';
import { HomeFeed, type HomeData } from '@/features/home/web/HomeFeed';
import { readingMinutes } from '@/lib/readingTime';
import {
  OPENING_FOCUS,
  OPENING_PERSON_ID,
  OPENING_PHOTO,
  OPENING_SOURCES,
} from '@/content/opening';
import { HorsChampIntro } from '@/features/home/web/HorsChampIntro';
import { WomanOfTheDay } from '@/features/home/web/WomanOfTheDay';
import { WomanOfTheDayCard } from '@/features/home/web/WomanOfTheDayCard';
import { pageMetadata } from '@/lib/seo';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';
import { PageMasthead } from '@/components/layout/PageMasthead';

export const metadata = pageMetadata({
  title: 'Celles que l’histoire a laissées hors champ',
  description: SITE_DESCRIPTION,
  path: '/',
});

const SECTIONS: FeedSection[] = ['all', 'arts', 'sciences', 'droits', 'sport'];

export default function Home() {
  const { culture, experiences, categories } = getCatalog();

  // Articles de tête possibles : les femmes illustrées (fiche à la une) et la première fiche
  // de chaque rubrique (quand la fiche à la une n'en fait pas partie).
  const leadIds = new Set([
    ...culture.filter((e) => e.kind === 'person' && e.image).map((e) => e.id),
    ...SECTIONS.map((s) => buildFeed(culture, s)[0]?.id).filter((id): id is string => !!id),
  ]);
  const firstLead = buildFeed(culture, 'all')[0]?.id;
  // Fiches du fil principal (les idées et les événements vont dans la colonne de côté).
  const main = culture.filter((e) => e.kind !== 'event' && e.kind !== 'idea');

  const data: HomeData = {
    entities: culture.map(slimEntity),
    fronts: Object.fromEntries(
      main.map((e) => [
        e.id,
        <FeedFront
          key={e.id}
          entity={e}
          minutes={readingMinutes(e, culture)}
          priority={e.id === firstLead}
        />,
      ]),
    ),
    cards: Object.fromEntries(main.map((e) => [e.id, <FeedCard key={e.id} entity={e} />])),
    texts: Object.fromEntries(main.map((e) => [e.id, <FeedText key={e.id} entity={e} />])),
    briefs: Object.fromEntries(main.map((e) => [e.id, <FeedBrief key={e.id} entity={e} />])),
    figures: dailyFigures(),
    sideRows: Object.fromEntries(
      culture
        .filter((e) => e.kind === 'event' || e.kind === 'idea')
        .map((e) => [e.id, <FeedSideRow key={e.id} entity={e} />]),
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

  const woman = culture.find((e) => e.id === OPENING_PERSON_ID);
  const almanac = almanacEvents(culture);
  const almanacIds = new Set(almanac.map((e) => e.entityId));
  const almanacEntities = culture.filter((e) => almanacIds.has(e.id));
  const ofTheDay = culture.filter((e) => e.kind === 'person' && e.image && e.hook);

  return (
    <>
      <HorsChampIntro
        photo={OPENING_PHOTO}
        men={OPENING_FOCUS.men}
        woman={OPENING_FOCUS.curie}
        womanName={woman?.title ?? 'Marie Curie'}
        womanHref={cultureHref(OPENING_PERSON_ID)}
        caption={
          <>
            Photo : {OPENING_PHOTO.artist}, « {OPENING_PHOTO.title} », Bruxelles,{' '}
            {OPENING_PHOTO.date}, {OPENING_PHOTO.license.toLowerCase()} (
            <a href={OPENING_PHOTO.sourceUrl} target="_blank" rel="noopener noreferrer">
              Wikimedia Commons
            </a>
            ). Faits :{' '}
            <a href={OPENING_SOURCES[0]!.url} target="_blank" rel="noopener noreferrer">
              Wikipédia, « Congrès Solvay »
            </a>
            .
          </>
        }
      />
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
        <Dateline />
        <WomanOfTheDay
          ids={ofTheDay.map((person) => person.id)}
          cards={ofTheDay.map((person) => (
            <WomanOfTheDayCard key={person.id} person={person} />
          ))}
          birthdays={almanac.filter((e) => e.kind === 'born')}
        />
        <OnThisDay
          events={almanac}
          thumbs={Object.fromEntries(
            almanacEntities.map((e) => [e.id, <CultureThumb key={e.id} entity={e} size={64} />]),
          )}
        />
        <Suspense fallback={<HomeFeed data={data} />}>
          <HomeFeed data={data} withUrl />
        </Suspense>
        <WelcomeBanner />
      </Container>
    </>
  );
}
