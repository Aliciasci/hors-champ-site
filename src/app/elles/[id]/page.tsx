import { notFound } from 'next/navigation';

import { PageTop } from '@/components/layout/PageTop';
import { Container } from '@/components/ui/Container';
import { getCatalog, getTheme } from '@/content/catalog';
import { ThemeMembers, themeHref } from '@/features/portraits/web/Elles';
import { pageMetadata } from '@/lib/seo';
import { PageMasthead } from '@/components/layout/PageMasthead';

export const dynamicParams = false;

export function generateStaticParams() {
  return getCatalog().themes.map((theme) => ({ id: theme.id }));
}

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const theme = getTheme((await params).id);
  if (!theme) return {};
  return pageMetadata({
    title: theme.title,
    description: theme.description,
    path: themeHref(theme.id),
    image: theme.people[0]?.person.image,
  });
}

export default async function ThemePage({ params }: Props) {
  const theme = getTheme((await params).id);
  if (!theme) notFound();
  const path = themeHref(theme.id);
  return (
    <Container>
      <PageTop
        fallback="/elles"
        path={path}
        crumbs={[{ label: 'Elles', href: '/elles' }, { label: theme.title }]}
      />
      <PageMasthead kicker={theme.subtitle} title={theme.title} dek={theme.description}>
        {theme.caution ? (
          <p className="t-caption c-2 measure" data-testid="theme-caution">
            {theme.caution}
          </p>
        ) : null}
      </PageMasthead>
      <ThemeMembers theme={theme} />
    </Container>
  );
}
