import type { ReactNode } from 'react';

import { CultureCard } from '@/components/content/CultureCard';
import { EditorialNotice } from '@/components/content/EditorialNotice';
import { SourceList } from '@/components/content/SourceList';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Tag } from '@/components/ui/Tag';
import { getCultureEntity, getYouthItem } from '@/content/catalog';
import type {
  Career,
  Leveled,
  Source,
  YouthCultureLink,
  YouthItem,
  YouthLife,
  YouthPortrait,
} from '@/types';

import { Lv } from './Leveled';
import styles from './youth.module.css';
import { YouthCard } from './YouthTile';

export function Block({
  kicker,
  title,
  children,
  testId,
}: {
  kicker?: string;
  title: string;
  children: ReactNode;
  testId?: string;
}) {
  return (
    <section className={styles.block} data-testid={testId}>
      <SectionHeader kicker={kicker} title={title} />
      {children}
    </section>
  );
}

/** Liens expliqués vers les fiches culturelles : l'explication d'abord, la fiche ensuite. */
function CultureLinks({ links }: { links: YouthCultureLink[] }) {
  const resolved = links.flatMap((link) => {
    const entity = getCultureEntity(link.targetId);
    return entity ? [{ link, entity }] : [];
  });
  if (resolved.length === 0) return null;
  return (
    <Block kicker="Relier à l’histoire" title="Dans la collection" testId="youth-culture-links">
      {resolved.map(({ link, entity }) => (
        <div key={entity.id} className={styles.link}>
          <Lv as="p" text={link.explanation} className="t-body c-2" />
          <CultureCard entity={entity} testId={`youth-link-${entity.id}`} />
        </div>
      ))}
    </Block>
  );
}

function youthLine(item: YouthItem): string | Leveled {
  if (item.kind === 'career') return item.hook;
  if (item.kind === 'portrait') return item.field;
  return `${item.minutes} min`;
}

/** Éléments liés : jeunesse (métier, portrait, activité) ou fiches de la collection. */
export function ItemRefs({
  ids,
  title,
  kicker,
}: {
  ids: string[];
  title: string;
  kicker?: string;
}) {
  const rows = ids.flatMap((id) => {
    const item = getYouthItem(id);
    if (item)
      return [
        <YouthCard
          key={id}
          id={id}
          kind={item.kind}
          title={item.title}
          line={youthLine(item)}
          image={item.image}
        />,
      ];
    const entity = getCultureEntity(id);
    return entity ? [<CultureCard key={id} entity={entity} testId={`youth-ref-${id}`} />] : [];
  });
  if (rows.length === 0) return null;
  return (
    <Block kicker={kicker} title={title}>
      <div className={styles.list}>{rows}</div>
    </Block>
  );
}

export function Sources({
  sources,
  status,
  reviewedAt,
}: {
  sources: Source[];
  status: YouthItem['editorialStatus'];
  reviewedAt: string | null;
}) {
  return (
    <Block kicker="Vérifier" title="Sources">
      <EditorialNotice status={status} reviewedAt={reviewedAt} />
      <SourceList sources={sources} />
    </Block>
  );
}

export function CareerView({ career }: { career: Career }) {
  return (
    <>
      <Lv as="p" text={career.hook} className="t-body-lg" />
      <Block kicker="Au quotidien" title="Ce que l’on fait vraiment">
        <Lv as="p" text={career.daily} className="t-body" />
      </Block>
      <Block kicker="À quoi ça sert" title="Les problèmes que l’on peut résoudre">
        <Lv as="p" text={career.problems} className="t-body" />
      </Block>
      <Block kicker="Utile" title="Les compétences">
        <ul className={styles.tags}>
          {career.skills.map((skill) => (
            <li key={skill}>
              <Tag tone="primary">{skill}</Tag>
            </li>
          ))}
        </ul>
        <p className="t-caption c-muted">
          Elles s’apprennent : personne ne les a toutes en commençant.
        </p>
      </Block>
      <Block kicker="Plusieurs chemins" title="Les voies possibles" testId="career-paths">
        <ul className={styles.bullets}>
          {career.paths.map((path, index) => (
            <li key={index}>
              <Lv text={path.text} />
            </li>
          ))}
        </ul>
        {career.regulated ? (
          <Lv as="p" text={career.regulated} className="t-body" testId="career-regulated" />
        ) : null}
      </Block>
      <ItemRefs
        ids={[career.portraitId]}
        kicker="Une femme réelle"
        title="Elle exerce ou a exercé ce métier"
      />
      {career.activityId ? (
        <ItemRefs ids={[career.activityId]} kicker="À toi" title="Pour en essayer un aspect" />
      ) : null}
      <CultureLinks links={career.cultureLinks} />
    </>
  );
}

export function PortraitView({ portrait }: { portrait: YouthPortrait }) {
  const parts: [string, Leveled | undefined][] = [
    ['Sa curiosité de départ', portrait.curiosity],
    ['Ce qu’elle a appris, et comment', portrait.learning],
    // Difficultés et aides : affichées seulement si elles sont documentées.
    ['Ce qui a été difficile', portrait.difficulties],
    ['Celles et ceux qui l’ont aidée', portrait.helpers],
    ['Ce qu’elle a réalisé', portrait.achievements],
    ['Ce que l’on peut en retenir', portrait.takeaway],
  ];
  return (
    <>
      {parts
        .filter((p): p is [string, Leveled] => p[1] !== undefined)
        .map(([title, text]) => (
          <Block key={title} title={title}>
            <Lv as="p" text={text} className="t-body" />
          </Block>
        ))}
      <ItemRefs ids={portrait.careerIds} kicker="Son domaine" title="Le métier" />
      <CultureLinks links={portrait.cultureLinks} />
    </>
  );
}

export function LifeView({ life }: { life: YouthLife }) {
  return (
    <>
      <Lv as="p" text={life.intro} className="t-body-lg" />
      <ItemRefs ids={life.itemIds} kicker="Dans cette collection" title="À découvrir" />
      <p className="t-caption c-muted">
        Ces parcours montrent ce qui est possible, pas un modèle à suivre. Pas besoin d’un métier
        extraordinaire pour compter.
      </p>
    </>
  );
}
