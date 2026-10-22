import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { CultureEntityPage, cultureCrumbs } from '@/features/culture/web/CultureEntityPage';
import { getCatalog, getCultureEntity } from '@/content/catalog';
import { describe, pageMetadata } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return getCatalog().culture.map((entity) => ({ id: entity.id }));
}

export async function generateMetadata({ params }: PageProps<'/culture/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const entity = getCultureEntity(id);
  if (!entity) return {};
  return pageMetadata({
    title: entity.title,
    description: describe(entity.hook ? `${entity.hook}. ${entity.summary}` : entity.summary),
    path: `/culture/${entity.id}`,
    image: entity.image,
    type: entity.kind === 'person' ? 'profile' : 'article',
  });
}

export default async function Page({ params }: PageProps<'/culture/[id]'>) {
  const { id } = await params;
  const entity = getCultureEntity(id);
  if (!entity) notFound();
  return <CultureEntityPage entity={entity} crumbs={cultureCrumbs(entity)} />;
}
