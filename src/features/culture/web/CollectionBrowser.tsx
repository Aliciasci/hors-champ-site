'use client';

import type { ReactNode } from 'react';

import { Chip, ChipGroup, Segmented } from '@/components/ui/Chip';
import { readOne, useQueryState } from '@/lib/useQueryState';
import { useAppStore } from '@/store/useAppStore';
import type { CultureDomain, CultureKind } from '@/types';

import { KIND_LABELS, KIND_ORDER } from '../cultureGraph';
import styles from './CollectionBrowser.module.css';

type DomainFilter = 'all' | CultureDomain;

const DOMAIN_OPTIONS: { id: DomainFilter; label: string }[] = [
  { id: 'all', label: 'Tout' },
  { id: 'arts', label: 'Arts' },
  { id: 'sciences', label: 'Sciences' },
  { id: 'droits', label: 'Droits' },
  { id: 'sport', label: 'Sport' },
];

export interface CollectionItem {
  id: string;
  kind: CultureKind;
  domain?: CultureDomain;
}

interface Props {
  /** Fiches déjà triées (type, chronologie, titre). */
  items: CollectionItem[];
  /** Cartes pré-rendues côté serveur. */
  cards: Record<string, ReactNode>;
  /** Éléments de frise pré-rendus (événements). */
  timeline: Record<string, ReactNode>;
  withUrl?: boolean;
}

/** Compteur d'exploration (client, après hydratation). */
export function ExploredCount({ ids, total }: { ids: string[]; total: number }) {
  const explored = useAppStore((s) => s.exploredEntityIds);
  const known = new Set(ids);
  const count = explored.filter((id) => known.has(id)).length;
  return (
    <p className="t-caption c-muted" data-testid="culture-explored-count">
      {count} fiche{count > 1 ? 's' : ''} explorée{count > 1 ? 's' : ''} sur {total}
    </p>
  );
}

export function CollectionBrowser(props: Props) {
  return props.withUrl ? (
    <WithUrl {...props} />
  ) : (
    <CollectionView {...props} domain="all" kind={null} />
  );
}

function WithUrl(props: Props) {
  const { params, set } = useQueryState();
  const domain = readOne<DomainFilter>(
    params.get('domaine'),
    ['all', 'arts', 'sciences', 'droits', 'sport'],
    'all',
  );
  const kindParam = params.get('type');
  const kind = KIND_ORDER.find((k) => k === kindParam) ?? null;
  return (
    <CollectionView
      {...props}
      domain={domain}
      kind={kind}
      onDomain={(d) => set({ domaine: d === 'all' ? null : d })}
      onKind={(k) => set({ type: k })}
    />
  );
}

function CollectionView({
  items,
  cards,
  timeline,
  domain,
  kind,
  onDomain,
  onKind,
}: Props & {
  domain: DomainFilter;
  kind: CultureKind | null;
  onDomain?: (domain: DomainFilter) => void;
  onKind?: (kind: CultureKind | null) => void;
}) {
  // Les idées n'ont pas de domaine : elles restent visibles quel que soit le filtre.
  const inDomain = items.filter((e) => domain === 'all' || !e.domain || e.domain === domain);
  const counts = Object.fromEntries(
    KIND_ORDER.map((k) => [k, inDomain.filter((e) => e.kind === k).length]),
  ) as Record<CultureKind, number>;
  const kinds = KIND_ORDER.filter((k) => counts[k] > 0);
  const activeKind = kind && kinds.includes(kind) ? kind : null;
  const visibleKinds = activeKind ? [activeKind] : kinds;

  return (
    <div className={styles.root}>
      <div className={styles.filters}>
        <div className={styles.segmented}>
          <Segmented
            legend="Domaine"
            name="domaine"
            options={DOMAIN_OPTIONS}
            value={domain}
            onChange={(d) => onDomain?.(d)}
            testIdPrefix="culture-domain"
          />
        </div>
        <ChipGroup legend="Type">
          <Chip
            type="radio"
            name="type"
            value=""
            checked={activeKind === null}
            onChange={() => onKind?.(null)}
          >
            Tous les types
          </Chip>
          {kinds.map((k) => (
            <Chip
              key={k}
              type="radio"
              name="type"
              value={k}
              checked={activeKind === k}
              onChange={() => onKind?.(k)}
              count={counts[k]}
              testId={`culture-kind-${k}`}
              ariaLabel={`${KIND_LABELS[k].plural}, ${counts[k]} fiches`}
            >
              {KIND_LABELS[k].plural}
            </Chip>
          ))}
        </ChipGroup>
      </div>

      {visibleKinds.map((k) => {
        const ofKind = inDomain.filter((e) => e.kind === k);
        return (
          <section key={k} className={styles.section} aria-labelledby={`type-${k}`}>
            <h2 id={`type-${k}`} className="t-title2">
              {KIND_LABELS[k].plural}
            </h2>
            {k === 'event' ? (
              <ol className={styles.timeline} data-testid="timeline">
                {ofKind.map((e) => (
                  <li key={e.id} className={styles.timelineItem}>
                    {timeline[e.id]}
                  </li>
                ))}
              </ol>
            ) : (
              <ul className={styles.grid}>
                {ofKind.map((e) => (
                  <li key={e.id}>{cards[e.id]}</li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
