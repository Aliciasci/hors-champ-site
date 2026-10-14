import type { Metadata } from 'next';

import { Container } from '@/components/ui/Container';
import { getExperience } from '@/content/catalog';
import { NotFoundExperience } from '@/features/experiences/web/NotFoundExperience';
import { PlayerIsland } from '@/features/experiences/web/Player';
import { playHref } from '@/features/experiences/web/routes';
import { experienceStaticParams } from '@/features/experiences/web/staticParams';
import { pageMetadata } from '@/lib/seo';

export const dynamicParams = false;
export const generateStaticParams = experienceStaticParams;

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const experience = getExperience(id);
  if (!experience) return { title: 'Contrechamp introuvable', robots: { index: false } };
  return pageMetadata({
    title: `${experience.title} · à vous de jouer`,
    description: experience.shortDescription,
    path: playHref(experience.id),
    noindex: true,
  });
}

export default async function PlayPage({ params }: Props) {
  const { id } = await params;
  const experience = getExperience(id);
  if (!experience) return <NotFoundExperience />;
  return (
    <Container width="reading">
      <PlayerIsland experience={experience} />
    </Container>
  );
}
