import { ContentCard } from '@/components/content/ContentCard';
import { CoverArt } from '@/components/content/CoverArt';
import { CultureCard } from '@/components/content/CultureCard';
import { Emblem } from '@/components/content/CultureThumb';
import { EditorialNotice } from '@/components/content/EditorialNotice';
import { RecordVisit } from '@/components/content/RecordVisit';
import { DiscoveryButton } from '@/components/content/SaveButtons';
import { ShareActions } from '@/components/content/ShareActions';
import { SourceList } from '@/components/content/SourceList';
import { PageTop } from '@/components/layout/PageTop';
import type { Crumb } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { JsonLd } from '@/components/ui/JsonLd';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Tag } from '@/components/ui/Tag';
import { getCatalog } from '@/content/catalog';
import { themesOf } from '@/features/portraits/portraitThemes';
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

export function CultureEntityPage({ entity, crumbs }: { entity: CultureEntity; crumbs: Crumb[] }) {
  const { culture: all, experiences, categories } = getCatalog();
  const path = `/culture/${entity.id}`;
  const parent = crumbs[crumbs.length - 2]?.href ?? '/';
  const themes = entity.kind === 'person' ? themesOf(all, entity.id) : [];
  // Les contributions (et, sur une conquête, ses textes de loi) ont leurs propres sections.
  const groups = groupByKind(
    relatedEntities(all, entity.id).filter(
      (item) =>
        item.relation !== 'contributed' &&
        !(entity.kind === 'right' && item.relation === 'enacted'),
    ),
  );
  const practice = relatedExperiences(all, entity.id, experiences);
  const kind = KIND_LABELS[entity.kind].singular;

  return (
    <Container>
      <RecordVisit entityId={entity.id} />
      <JsonLd data={cultureJsonLd(entity, all)} />
      <PageTop
        crumbs={crumbs}
        path={path}
        fallback={parent}
        actions={<DiscoveryButton entityId={entity.id} />}
      />

      <article className={styles.article}>
        <div className={styles.media}>
          {entity.image ? (
            <CoverArt
              artwork={entity.image}
              decorative={false}
              offset
              credit
              priority
              sizes="(min-width: 900px) 440px, 100vw"
              className={styles.cover}
            />
          ) : (
            <Emblem
              entity={entity}
              className={entity.period ? styles.emblem : styles.emblemCompact}
            />
          )}
        </div>

        <div className={styles.body}>
          <header className={styles.header}>
            <p className="t-overline c-accent">
              {kind}
              {/* Sur une conquête, catégorie et pays sont repris juste en dessous. */}
              {entity.subtitle && entity.kind !== 'right' ? ` · ${entity.subtitle}` : ''}
            </p>
            <h1 className="t-title1">{entity.title}</h1>
            {entity.hook ? (
              <p className="t-title3 c-primary" data-testid="culture-hook">
                {entity.hook}
              </p>
            ) : null}
            {entity.period && entity.image ? (
              <p className="t-label c-2">{entity.period.label}</p>
            ) : null}
          </header>

          <p className="t-body-lg measure">{entity.summary}</p>

          <EditorialNotice status={entity.editorialStatus} reviewedAt={entity.reviewedAt} />

          {themes.length > 0 ? (
            <div className={styles.themes} data-testid="culture-themes">
              <h2 className="sr-only">Ses thématiques</h2>
              {themes.map((theme) => (
                <Tag
                  key={theme.id}
                  href={`/elles/${theme.id}`}
                  testId={`culture-theme-${theme.id}`}
                >
                  {theme.title}
                </Tag>
              ))}
            </div>
          ) : null}

          <div className={styles.actions}>
            <DiscoveryButton entityId={entity.id} full />
            <ShareActions title={entity.title} />
          </div>

          {entity.kind === 'right' ? <RightDetails entity={entity} all={all} /> : null}
          {entity.kind === 'person' || entity.kind === 'organization' ? (
            <CombatsSection entity={entity} all={all} />
          ) : null}
        </div>
      </article>

      {groups.length > 0 ? (
        <section className={styles.section} aria-labelledby="reliee">
          <SectionHeader id="reliee" kicker="Suivre les liens" title="Reliée à" />
          <div className={styles.groups}>
            {groups.map((group) => (
              <div key={group.kind} className={styles.group}>
                <h3 className="t-overline c-2">{KIND_LABELS[group.kind].plural}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item.entity.id}>
                      <CultureCard
                        entity={item.entity}
                        context={relationLabel(
                          item.relation,
                          item.direction,
                          item.entity.kind,
                          entity.kind,
                        )}
                        testId={`culture-link-${item.entity.id}`}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {practice.length > 0 ? (
        <section className={`${styles.section} no-print`} aria-labelledby="pratique">
          <SectionHeader id="pratique" kicker="Passer à la pratique" title="Contrechamps liés" />
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
        <section className={styles.section} aria-labelledby="sources">
          <SectionHeader id="sources" kicker="Vérifier" title="Sources" />
          <SourceList sources={entity.sources} />
        </section>
      ) : null}
    </Container>
  );
}
