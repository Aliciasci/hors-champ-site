import type { Metadata } from 'next';

import { PageTop } from '@/components/layout/PageTop';
import { Container } from '@/components/ui/Container';
import { getCatalog, getCategory, getExperience } from '@/content/catalog';
import { ideaIdForCategory, relatedEntities } from '@/features/culture/cultureGraph';
import { Analysis } from '@/features/experiences/web/Analysis';
import { NotFoundExperience } from '@/features/experiences/web/NotFoundExperience';
import { analysisHref, detailHref } from '@/features/experiences/web/routes';
import { experienceStaticParams } from '@/features/experiences/web/staticParams';
import { pageMetadata } from '@/lib/seo';
import type { Category, Experience } from '@/types';

export const dynamicParams = false;
export const generateStaticParams = experienceStaticParams;

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const experience = getExperience(id);
  if (!experience) return { title: 'Contrechamp introuvable', robots: { index: false } };
  return pageMetadata({
    title: `Analyse · ${experience.title}`,
    description: experience.shortDescription,
    path: analysisHref(experience.id),
    noindex: true,
  });
}

export default async function AnalysisPage({ params }: Props) {
  const { id } = await params;
  const experience = getExperience(id);
  if (!experience) return <NotFoundExperience />;
  const { culture, categories } = getCatalog();
  const category = getCategory(experience.categoryId);
  const related = experience.relatedExperienceIds
    .map((relatedId) => getExperience(relatedId))
    .filter((item): item is Experience => item !== undefined);
  // L'idée correspondant au thème, puis les fiches qui y sont reliées (œuvre, événements…).
  const ideaId = ideaIdForCategory(experience.categoryId);
  const idea = culture.find((e) => e.id === ideaId);
  const cultureLinks = idea
    ? [idea, ...relatedEntities(culture, ideaId).map((r) => r.entity)].slice(0, 3)
    : [];
  const relatedCategories = categories.filter((c: Category) =>
    related.some((r) => r.categoryId === c.id),
  );

  return (
    <Container width="reading">
      <PageTop
        fallback={detailHref(experience.id)}
        path={analysisHref(experience.id)}
        crumbs={[
          { label: 'Contrechamps', href: '/contrechamps' },
          { label: experience.title, href: detailHref(experience.id) },
          { label: 'Analyse' },
        ]}
      />
      <Analysis
        experience={experience}
        category={category}
        related={related}
        relatedCategories={relatedCategories}
        culture={cultureLinks}
      />
    </Container>
  );
}
