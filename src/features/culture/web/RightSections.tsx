import Link from 'next/link';

import { cultureHref, CultureCard } from '@/components/content/CultureCard';
import { CultureThumb } from '@/components/content/CultureThumb';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Tag } from '@/components/ui/Tag';
import type { CultureEntity, CultureLink } from '@/types';

import {
  combatsOf,
  CONTRIBUTION_LABELS,
  contributorsOf,
  KIND_LABELS,
  lawsFor,
  RIGHT_CATEGORY_LABELS,
  type CombatTiming,
  type Contribution,
} from '../cultureGraph';
import { PortraitStrip } from './PortraitStrip';
import styles from './RightSections.module.css';

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className={styles.bullets}>
      {items.map((item) => (
        <li key={item} className="t-body">
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Regroupe les contributions par contributrice, dans l'ordre de sa première contribution. */
function byContributor(items: Contribution[]) {
  const groups = new Map<string, { entity: CultureEntity; links: CultureLink[] }>();
  for (const { contributor, link } of items) {
    const group = groups.get(contributor.id) ?? { entity: contributor, links: [] };
    group.links.push(link);
    groups.set(contributor.id, group);
  }
  return [...groups.values()];
}

/** Une contributrice : portrait, nom, puis chaque contribution (nature, année, action précise). */
function ContributionItem({ entity, links }: { entity: CultureEntity; links: CultureLink[] }) {
  return (
    <li className={styles.contribution} data-testid={`right-contribution-${entity.id}`}>
      <CultureThumb entity={entity} size={56} />
      <div className={styles.contributionText}>
        <h3 className="t-title3">
          <Link href={cultureHref(entity.id)} className={styles.name}>
            {entity.title}
          </Link>
        </h3>
        {links.map((link, index) => (
          <div key={`${link.contribution}-${index}`} className={styles.part}>
            <p className={styles.meta}>
              {link.contribution ? (
                <Tag tone="accent">{CONTRIBUTION_LABELS[link.contribution]}</Tag>
              ) : null}
              {link.year ? <span className="t-caption c-2">{link.year}</span> : null}
            </p>
            {link.detail ? <p className="t-body">{link.detail}</p> : null}
          </div>
        ))}
      </div>
    </li>
  );
}

/**
 * Corps d'une fiche « conquête » : situation avant, étapes, loi obtenue, femmes et
 * organisations impliquées (avec leur contribution précise), limites, suites.
 */
export function RightDetails({ entity, all }: { entity: CultureEntity; all: CultureEntity[] }) {
  const details = entity.right;
  if (!details) return null;
  const contributions = contributorsOf(all, entity.id);
  const women = byContributor(contributions.filter((c) => c.contributor.kind === 'person'));
  const groups = byContributor(contributions.filter((c) => c.contributor.kind === 'organization'));
  const laws = lawsFor(all, entity.id);

  return (
    <>
      <p className={styles.facts} data-testid="right-facts">
        <Tag tone="primary">{RIGHT_CATEGORY_LABELS[details.category]}</Tag>
        <Tag>{details.country}</Tag>
        {entity.period ? <Tag>{entity.period.label}</Tag> : null}
      </p>

      <section className={styles.section} aria-labelledby="avant">
        <SectionHeader id="avant" kicker="Le point de départ" title="Avant" />
        <p className="t-body measure">{details.before}</p>
      </section>

      <section className={styles.section} aria-labelledby="etapes" data-testid="right-steps">
        <SectionHeader id="etapes" kicker="Un combat collectif" title="Les étapes" />
        <ol className={styles.steps}>
          {details.steps.map((step, index) => (
            <li key={`${step.date}-${index}`} className={styles.step}>
              <span className={styles.dot} aria-hidden="true" />
              <p className="t-label c-primary">{step.date}</p>
              <p className="t-body">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.section} aria-labelledby="loi">
        <SectionHeader id="loi" kicker="Ce qui a changé" title="La loi obtenue" />
        <p className="t-body measure">{details.outcome}</p>
        {laws.length > 0 ? (
          <div>
            {laws.map((law) => (
              <CultureCard
                key={law.id}
                entity={law}
                context={law.law ? `Adopté par : ${law.law.institution}` : undefined}
                testId={`right-law-${law.id}`}
              />
            ))}
          </div>
        ) : null}
      </section>

      <section className={styles.section} aria-labelledby="celles" data-testid="right-women">
        <SectionHeader
          id="celles"
          kicker="Derrière ce droit"
          title="Celles qui ont fait avancer ce combat"
        />
        {women.length > 0 ? (
          <>
            <PortraitStrip
              people={women.map((g) => g.entity)}
              label="Portraits des contributrices"
              testIdPrefix="right-portrait"
            />
            <p className="t-caption c-2 measure">
              Chacune a agi à un moment précis, aux côtés d’autres actrices et acteurs nommés dans
              les étapes. Leur rôle est décrit tel que le rapportent les sources.
            </p>
            <ul>
              {women.map(({ entity: contributor, links }) => (
                <ContributionItem key={contributor.id} entity={contributor} links={links} />
              ))}
            </ul>
          </>
        ) : (
          <p className="t-body c-2 measure" data-testid="right-no-women">
            Aucune contribution individuelle de femme n’est encore documentée pour ce droit dans nos
            sources. Les personnes et institutions qu’elles nomment figurent dans les étapes
            ci-dessus.
          </p>
        )}
      </section>

      {groups.length > 0 ? (
        <section
          className={styles.section}
          aria-labelledby="organisations"
          data-testid="right-organizations"
        >
          <SectionHeader
            id="organisations"
            kicker="S’organiser"
            title="Organisations et mouvements"
          />
          <ul>
            {groups.map(({ entity: contributor, links }) => (
              <ContributionItem key={contributor.id} entity={contributor} links={links} />
            ))}
          </ul>
        </section>
      ) : null}

      {details.limits.length > 0 ? (
        <section className={styles.section} aria-labelledby="limites">
          <SectionHeader id="limites" kicker="Nuancer" title="Résistances et limites" />
          <Bullets items={details.limits} />
        </section>
      ) : null}

      {details.later.length > 0 ? (
        <section className={styles.section} aria-labelledby="ensuite">
          <SectionHeader id="ensuite" kicker="Et ensuite" title="Évolutions ultérieures" />
          <Bullets items={details.later.map((item) => item.text)} />
        </section>
      ) : null}
    </>
  );
}

const TIMING_TITLES: Record<CombatTiming, { person: string; other: string }> = {
  lifetime: { person: 'Obtenus de son vivant', other: 'Droits obtenus' },
  posthumous: { person: 'Obtenus après sa mort', other: 'Obtenus après sa dissolution' },
  'after-adoption': { person: 'Poursuivis après l’adoption', other: 'Poursuivis après l’adoption' },
  unknown: { person: 'Combats auxquels elle a contribué', other: 'Combats soutenus' },
};
const TIMING_ORDER: CombatTiming[] = ['lifetime', 'posthumous', 'after-adoption', 'unknown'];

/**
 * « Ses combats et leurs héritages » (femme ou organisation) : droits obtenus de son vivant,
 * après sa mort, combats poursuivis après l'adoption, évolutions sans participation documentée.
 */
export function CombatsSection({ entity, all }: { entity: CultureEntity; all: CultureEntity[] }) {
  const combats = combatsOf(all, entity.id);
  if (combats.length === 0) return null;
  const role = entity.kind === 'person' ? 'person' : 'other';
  const grouped = TIMING_ORDER.map((timing) => ({
    timing,
    items: combats.filter((c) => c.timing === timing),
  })).filter((g) => g.items.length > 0);
  const seen = new Set<string>();
  const legacy = combats
    .filter((c) => !seen.has(c.right.id) && seen.add(c.right.id))
    .map((c) => ({
      right: c.right,
      later: (c.right.right?.later ?? []).filter((l) => !l.involves?.includes(entity.id)),
    }))
    .filter((g) => g.later.length > 0);

  return (
    <section className={styles.section} aria-labelledby="combats" data-testid="combats">
      <SectionHeader
        id="combats"
        kicker="Derrière chaque droit"
        title="Ses combats et leurs héritages"
      />
      {grouped.map((group) => (
        <div key={group.timing} className={styles.group} data-testid={`combats-${group.timing}`}>
          <h3 className="t-overline c-2">{TIMING_TITLES[group.timing][role]}</h3>
          <ul>
            {group.items.map((combat, index) => (
              <li key={`${combat.right.id}-${index}`} className={styles.combat}>
                <CultureCard
                  entity={combat.right}
                  context={
                    combat.link.contribution
                      ? `${CONTRIBUTION_LABELS[combat.link.contribution]}${combat.link.year ? ` · ${combat.link.year}` : ''}`
                      : KIND_LABELS.right.singular
                  }
                  testId={`combat-${combat.right.id}`}
                />
                {combat.link.detail ? (
                  <p className={`t-body c-2 ${styles.combatDetail}`}>{combat.link.detail}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ))}
      {legacy.length > 0 ? (
        <div className={styles.group} data-testid="combats-legacy">
          <h3 className="t-overline c-2">
            Évolutions postérieures, sans participation documentée de sa part
          </h3>
          {legacy.map(({ right, later }) => (
            <div key={right.id} className={styles.legacy}>
              <p className="t-label">{right.title}</p>
              <Bullets items={later.map((l) => l.text)} />
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
