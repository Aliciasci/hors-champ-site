import type { Metadata } from 'next';

import { CoverArt } from '@/components/content/CoverArt';
import { EditorialNotice } from '@/components/content/EditorialNotice';
import { RecordVisit } from '@/components/content/RecordVisit';
import { ExperienceBookmarkButton } from '@/components/content/SaveButtons';
import { ChevronDown, Clock3 } from '@/components/icons';
import { PageTop } from '@/components/layout/PageTop';
import { Container } from '@/components/ui/Container';
import { JsonLd } from '@/components/ui/JsonLd';
import { Tag } from '@/components/ui/Tag';
import { getCategory, getExperience } from '@/content/catalog';
import { CONTENT_TYPE_LABELS, DIFFICULTY_LABELS } from '@/constants/labels';
import styles from '@/features/experiences/web/Detail.module.css';
import { CompletedTag, DetailActions } from '@/features/experiences/web/DetailActions';
import { NotFoundExperience } from '@/features/experiences/web/NotFoundExperience';
import { catalogueHref, detailHref, OUTLINE } from '@/features/experiences/web/routes';
import { experienceStaticParams } from '@/features/experiences/web/staticParams';
import { describe, pageMetadata } from '@/lib/seo';
import { absoluteUrl } from '@/lib/site';
import { formatMinutes } from '@/utils/text';

export const dynamicParams = false;
export const generateStaticParams = experienceStaticParams;

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const experience = getExperience(id);
  if (!experience) return { title: 'Contrechamp introuvable', robots: { index: false } };
  const category = getCategory(experience.categoryId);
  return pageMetadata({
    title: experience.title,
    description: describe(experience.shortDescription),
    path: detailHref(experience.id),
    image: experience.coverImage ? undefined : (category?.artwork ?? undefined),
    // Un exemple de développement n'est jamais indexé.
    noindex: experience.editorialStatus === 'dev-example',
  });
}

export default async function ExperienceDetailPage({ params }: Props) {
  const { id } = await params;
  const experience = getExperience(id);
  if (!experience) return <NotFoundExperience />;
  const category = getCategory(experience.categoryId);
  const path = detailHref(experience.id);

  return (
    <Container>
      <RecordVisit experienceId={experience.id} />
      <PageTop
        fallback="/contrechamps/catalogue"
        path={path}
        crumbs={[
          { label: 'Contrechamps', href: '/contrechamps' },
          ...(category ? [{ label: category.title, href: catalogueHref(category.id) }] : []),
          { label: experience.title },
        ]}
        actions={<ExperienceBookmarkButton experienceId={experience.id} />}
      />

      <article className={styles.layout}>
        <div className={styles.media}>
          <CoverArt
            motif={category?.motif ?? 'circles'}
            image={experience.coverImage}
            artwork={category?.artwork}
            decorative={false}
            offset
            credit
            priority
            sizes="(min-width: 900px) 520px, 100vw"
            className={styles.cover}
          />
        </div>

        <div className={styles.body}>
          <header className={styles.heading}>
            {category ? <p className="t-overline c-accent">{category.title}</p> : null}
            <h1 className="t-title1">{experience.title}</h1>
          </header>

          <ul className={styles.tags} aria-label="Caractéristiques">
            <li>
              <Tag icon={<Clock3 size={14} strokeWidth={2.25} aria-hidden="true" />}>
                <span className="sr-only">Durée estimée : </span>
                {formatMinutes(experience.estimatedMinutes)}
              </Tag>
            </li>
            <li>
              <Tag tone="primary">
                <span className="sr-only">Niveau : </span>
                {DIFFICULTY_LABELS[experience.difficulty]}
              </Tag>
            </li>
            <li>
              <Tag>
                <span className="sr-only">Format : </span>
                {CONTENT_TYPE_LABELS[experience.contentType]}
              </Tag>
            </li>
            <li>
              <CompletedTag experienceId={experience.id} />
            </li>
          </ul>

          <p className="t-body-lg measure">{experience.introduction}</p>

          <EditorialNotice status={experience.editorialStatus} reviewedAt={experience.reviewedAt} />

          <details className={styles.outline} data-testid="detail-outline">
            <summary>
              <span className={styles.summaryText}>
                <span className="t-title3">Déroulé</span>
                <span className="t-caption c-muted">
                  {OUTLINE.length} étapes · {formatMinutes(experience.estimatedMinutes)}
                </span>
              </span>
              <ChevronDown
                size={20}
                strokeWidth={2.25}
                aria-hidden="true"
                className={styles.chevron}
              />
            </summary>
            <ol className={styles.steps}>
              {OUTLINE.map((step, index) => (
                <li key={step.title} className={styles.step}>
                  <span className={styles.stepNumber} aria-hidden="true">
                    {index + 1}
                  </span>
                  <span>
                    <span className="t-label" style={{ display: 'block' }}>
                      {step.title}
                    </span>
                    <span className="t-body-sm c-2">{step.text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </details>

          <DetailActions experienceId={experience.id} />
        </div>
      </article>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': ['LearningResource', 'Quiz'],
          name: experience.title,
          description: experience.shortDescription,
          url: absoluteUrl(path),
          inLanguage: 'fr',
          isAccessibleForFree: true,
          educationalLevel: DIFFICULTY_LABELS[experience.difficulty],
          learningResourceType: CONTENT_TYPE_LABELS[experience.contentType],
          timeRequired: `PT${experience.estimatedMinutes}M`,
          ...(category ? { about: category.title } : {}),
          ...(experience.sources.length > 0
            ? { citation: experience.sources.map((source) => source.url) }
            : {}),
        }}
      />
    </Container>
  );
}
