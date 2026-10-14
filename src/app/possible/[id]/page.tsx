import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { CoverArt } from '@/components/content/CoverArt';
import { RecordVisit } from '@/components/content/RecordVisit';
import { DiscoveryButton } from '@/components/content/SaveButtons';
import { PageTop } from '@/components/layout/PageTop';
import { Container } from '@/components/ui/Container';
import { JsonLd } from '@/components/ui/JsonLd';
import { getCatalog, getYouthItem, getYouthLife } from '@/content/catalog';
import { AgeBandFromUrl } from '@/features/youth/web/AgeBand';
import { ActivityPlay } from '@/features/youth/web/ActivityPlay';
import styles from '@/features/youth/web/youth.module.css';
import {
  CareerView,
  ItemRefs,
  LifeView,
  PortraitView,
  Sources,
} from '@/features/youth/web/YouthItemViews';
import { YOUTH_KIND_LABELS, YouthThumb, youthHref } from '@/features/youth/web/YouthThumb';
import { describe, pageMetadata } from '@/lib/seo';
import { absoluteUrl } from '@/lib/site';
import type { YouthItem, YouthLife } from '@/types';

export const dynamicParams = false;

export function generateStaticParams() {
  const { youthItems, youthLives } = getCatalog();
  return [...youthItems, ...youthLives].map((entry) => ({ id: entry.id }));
}

type Props = { params: Promise<{ id: string }> };

function resolve(id: string): { item?: YouthItem; life?: YouthLife } | null {
  const item = getYouthItem(id);
  if (item) return { item };
  const life = getYouthLife(id);
  return life ? { life } : null;
}

function description(item?: YouthItem, life?: YouthLife): string {
  if (life) return life.intro['11-14'];
  if (!item) return '';
  if (item.kind === 'career') return item.hook['11-14'];
  if (item.kind === 'portrait') return `${item.field}. ${item.achievements['11-14']}`;
  return item.intro['11-14'];
}

export async function generateMetadata({ params }: Props) {
  const found = resolve((await params).id);
  if (!found) return {};
  const { item, life } = found;
  return pageMetadata({
    title: item?.title ?? life!.title,
    description: describe(description(item, life)),
    path: youthHref(item?.id ?? life!.id),
    image: item?.image,
  });
}

export default async function YouthItemPage({ params }: Props) {
  const found = resolve((await params).id);
  if (!found) notFound();
  const { item, life } = found;
  const id = item?.id ?? life!.id;
  const title = item?.title ?? life!.title;
  const kind = item ? item.kind : 'life';
  const path = youthHref(id);

  return (
    <Container>
      <Suspense fallback={null}>
        <AgeBandFromUrl />
      </Suspense>
      {item ? <RecordVisit entityId={item.id} /> : null}
      {item?.kind === 'portrait' ? (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: item.title,
            description: item.field,
            url: absoluteUrl(path),
          }}
        />
      ) : null}
      {item?.kind === 'career' ? (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Occupation',
            name: item.title,
            description: item.hook['11-14'],
            skills: item.skills.join(', '),
          }}
        />
      ) : null}
      <PageTop
        fallback="/possible"
        path={path}
        crumbs={[{ label: 'Tout est possible', href: '/possible' }, { label: title }]}
        actions={item ? <DiscoveryButton entityId={item.id} /> : undefined}
      />
      <div className={styles.top}>
        <div className={styles.media}>
          {item?.image && item.kind !== 'activity' ? (
            <CoverArt
              artwork={item.image}
              decorative={false}
              credit
              offset
              priority
              sizes="(min-width: 900px) 460px, 100vw"
              className={styles.cover}
            />
          ) : (
            <YouthThumb kind={kind} size={96} />
          )}
        </div>
        <article className={styles.body}>
          <p className="t-overline c-accent">
            Tout est possible · {YOUTH_KIND_LABELS[kind]}
            {item?.kind === 'portrait' ? ` · ${item.period}` : ''}
          </p>
          <h1 className="t-title1">{title}</h1>
          {item?.kind === 'portrait' ? <p className="t-title3 c-primary">{item.field}</p> : null}
          {item?.kind === 'career' ? <CareerView career={item} /> : null}
          {item?.kind === 'portrait' ? <PortraitView portrait={item} /> : null}
          {item?.kind === 'activity' ? (
            <>
              <ActivityPlay activity={item} />
              <ItemRefs ids={item.careerIds} kicker="Découvrir" title="Le métier lié" />
            </>
          ) : null}
          {life ? <LifeView life={life} /> : null}
          {item ? (
            <>
              <Sources
                sources={item.sources}
                status={item.editorialStatus}
                reviewedAt={item.reviewedAt}
              />
              <div className={`${styles.saveBar} no-print`}>
                <DiscoveryButton entityId={item.id} full />
              </div>
            </>
          ) : null}
        </article>
      </div>
    </Container>
  );
}
