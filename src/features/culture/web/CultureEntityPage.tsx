import { ArticleActions } from '@/components/content/ArticleActions';
import { ArticleFigure } from '@/components/content/ArticleFigure';
import { ContentCard } from '@/components/content/ContentCard';
import { StatusBadge } from '@/components/content/EditorialNotice';
import { RecordVisit } from '@/components/content/RecordVisit';
import { SourceList } from '@/components/content/SourceList';
import { StoryRow } from '@/components/content/StoryRow';
import { PageTop } from '@/components/layout/PageTop';
import { ReadingProgress } from '@/components/layout/ReadingProgress';
import type { Crumb } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { JsonLd } from '@/components/ui/JsonLd';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Tag } from '@/components/ui/Tag';
import { getCatalog } from '@/content/catalog';
import { themesOf } from '@/features/portraits/portraitThemes';
import { readingLabel, readingMinutes } from '@/lib/readingTime';
import { cultureJsonLd } from '@/lib/structuredData';
import type { CultureEntity } from '@/types';

import { groupByKind, KIND_LABELS, relatedEntities, relatedExperiences } from '../cultureGraph';
import styles from './CultureEntityPage.module.css';
import { relationLabel } from './relationLabel';
import { CombatsSection, RightDetails } from './RightSections';

/**
 * Fil d'Ariane d'une fiche : une femme passe par sa première thématique « Elles »,
 * une conquête par « Derrière chaque droit », le reste par la collection.
 */
export function cultureCrumbs(entity: CultureEntity): Crumb[] {
  const { culture } = getCatalog();
  if (entity.kind === 'person') {
    const theme = themesOf(culture, entity.id)[0];
    if (theme) {
      return [
        { label: 'Elles', href: '/elles' },
        { label: theme.title, href: `/elles/${theme.id}` },
        { label: entity.title },
      ];
    }
  }
  if (entity.kind === 'right') {
    return [
      { label: 'Découvrir', href: '/' },
      { label: 'Derrière chaque droit', href: '/droits' },
      { label: entity.title },
    ];
  }
  return [
    { label: 'Découvrir', href: '/' },
    { label: 'Toute la collection', href: '/collection' },
    { label: entity.title },
  ];
}

/**
 * Une fiche présentée comme un article : une seule colonne de lecture, titre, chapeau,
 * signature (dates, temps de lecture, statut), barre d'actions, image légendée, texte,
 * puis « À lire aussi » et les sources.
 */
export function CultureEntityPage({ entity, crumbs }: { entity: CultureEntity; crumbs: Crumb[] }) {
  const { culture: all, experiences, categories } = getCatalog();
  const path = `/culture/${entity.id}`;
  const parent = crumbs[crumbs.length - 2]?.href ?? '/';
  const themes = entity.kind === 'person' ? themesOf(all, entity.id) : [];
  // Les contributions (et, sur une conquête, ses textes de loi) ont leurs propres sections.
  const related = groupByKind(
    relatedEntities(all, entity.id).filter(
      (item) =>
        item.relation !== 'contributed' &&
        !(entity.kind === 'right' && item.relation === 'enacted'),
    ),
  ).flatMap((group) => group.items);
  const practice = relatedExperiences(all, entity.id, experiences);
  const kind = KIND_LABELS[entity.kind].singular;
  const minutes = readingMinutes(entity, all);

  return (
    <Container width="reading">
      <RecordVisit entityId={entity.id} />
      <ReadingProgress targetId="article" />
      <JsonLd data={cultureJsonLd(entity, all)} />
      <PageTop crumbs={crumbs} path={path} fallback={parent} />

      <article id="article" className={styles.article}>
        <header className={styles.header}>
          <p className="t-overline c-accent">
            {kind}
            {/* Sur une conquête, catégorie et pays sont repris dans le corps. */}
            {entity.subtitle && entity.kind !== 'right' ? ` · ${entity.subtitle}` : ''}
          </p>
          <h1 className={`t-title1 ${styles.title}`}>{entity.title}</h1>
          {entity.hook ? (
            <p className="t-deck" data-testid="culture-hook">
              {entity.hook}
            </p>
          ) : null}
          <div className={`t-caption c-2 ${styles.byline}`} data-testid="culture-byline">
            <p className={styles.bylineItems}>
              {entity.period ? <span>{entity.period.label}</span> : null}
              <span>{readingLabel(minutes)}</span>
              {entity.sources.length > 0 ? (
                <a href="#sources" className={styles.notesLink}>
                  {entity.sources.length} source{entity.sources.length > 1 ? 's' : ''}
                </a>
              ) : null}
            </p>
            <StatusBadge status={entity.editorialStatus} reviewedAt={entity.reviewedAt} />
          </div>
        </header>

        <ArticleActions entityId={entity.id} title={entity.title} />

        {entity.image ? <ArticleFigure artwork={entity.image} priority /> : null}

        <div className={styles.prose}>
          <p className="t-reading">{entity.summary}</p>
        </div>

        {entity.kind === 'right' ? <RightDetails entity={entity} all={all} /> : null}
        {entity.kind === 'person' || entity.kind === 'organization' ? (
          <CombatsSection entity={entity} all={all} />
        ) : null}

        {themes.length > 0 ? (
          <div className={styles.themes} data-testid="culture-themes">
            <h2 className="t-overline c-2">Classée dans</h2>
            <ul>
              {themes.map((theme) => (
                <li key={theme.id}>
                  <Tag href={`/elles/${theme.id}`} testId={`culture-theme-${theme.id}`}>
                    {theme.title}
                  </Tag>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <ArticleActions entityId={entity.id} title={entity.title} position="end" />
      </article>

      {related.length > 0 ? (
        <section className={styles.section} aria-labelledby="a-lire">
          <SectionHeader id="a-lire" kicker="Tirer le fil" title="À lire aussi" />
          <ul>
            {related.map((item) => (
              <li key={item.entity.id}>
                <StoryRow
                  entity={item.entity}
                  kicker={relationLabel(
                    item.relation,
                    item.direction,
                    item.entity.kind,
                    entity.kind,
                  )}
                  minutes={readingMinutes(item.entity, all)}
                  testId={`culture-link-${item.entity.id}`}
                />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {practice.length > 0 ? (
        <section className={`${styles.section} no-print`} aria-labelledby="pratique">
          <SectionHeader
            id="pratique"
            kicker="Contrechamps"
            title="Et dans la vie de tous les jours ?"
          />
          <ul className={styles.practice}>
            {practice.map((experience, index) => (
              <li key={experience.id}>
                <ContentCard
                  variant="compact"
                  index={index}
                  experience={experience}
                  category={categories.find((c) => c.id === experience.categoryId)}
                />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {entity.sources.length > 0 ? (
        <section id="sources" className={styles.section} aria-labelledby="sources-title">
          <SectionHeader id="sources-title" kicker="Vérifier" title="Sources" />
          <SourceList sources={entity.sources} />
        </section>
      ) : null}
    </Container>
  );
}
