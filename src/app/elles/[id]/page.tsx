import { notFound } from 'next/navigation';

import { PageTop } from '@/components/layout/PageTop';
import { Container } from '@/components/ui/Container';
import { getCatalog, getTheme } from '@/content/catalog';
import { ThemeMembers, themeHref } from '@/features/portraits/web/Elles';
import { pageMetadata } from '@/lib/seo';

import styles from '../elles.module.css';

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
      <header className={styles.detailHeader}>
        <p className="t-overline c-accent">{theme.subtitle}</p>
        <h1 className="t-title1">{theme.title}</h1>
        <p className="t-body-lg c-2">{theme.description}</p>
        {theme.caution ? (
          <p className="t-caption c-2" data-testid="theme-caution">
            {theme.caution}
          </p>
        ) : null}
      </header>
      <ThemeMembers theme={theme} />
    </Container>
  );
}
