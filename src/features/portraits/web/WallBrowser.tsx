'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

import { ArrowRight } from '@/components/icons';
import { Chip, ChipGroup } from '@/components/ui/Chip';
import { readOne, useQueryState } from '@/lib/useQueryState';
import type { PortraitThemeId } from '@/types';

import styles from './Wall.module.css';

export interface WallTheme {
  id: PortraitThemeId;
  label: string;
  subtitle: string;
  description: string;
  personIds: string[];
  /** Portrait mis en avant quand ce thème est choisi. */
  featuredId: string;
}

interface Props {
  /** Toutes les femmes, dans l'ordre du mur. */
  personIds: string[];
  themes: WallTheme[];
  /** Portrait à la une sans filtre. */
  featuredId: string;
  /** Tuiles et portraits à la une, pré-rendus côté serveur. */
  tiles: Record<string, ReactNode>;
  features: Record<string, ReactNode>;
  withUrl?: boolean;
}

export function WallBrowser(props: Props) {
  return props.withUrl ? <WithUrl {...props} /> : <WallView {...props} theme={null} />;
}

function WithUrl(props: Props) {
  const { params, set } = useQueryState();
  const ids = props.themes.map((t) => t.id);
  const value = readOne<PortraitThemeId | 'all'>(params.get('theme'), [...ids, 'all'], 'all');
  return (
    <WallView
      {...props}
      theme={value === 'all' ? null : value}
      onTheme={(id) => set({ theme: id })}
    />
  );
}

function WallView({
  personIds,
  themes,
  featuredId,
  tiles,
  features,
  theme,
  onTheme,
}: Props & { theme: PortraitThemeId | null; onTheme?: (id: PortraitThemeId | null) => void }) {
  const active = themes.find((t) => t.id === theme) ?? null;
  const shownIds = active ? active.personIds : personIds;
  const featured = active ? active.featuredId : featuredId;
  const featureKey = active ? `${active.id}:${featured}` : `all:${featured}`;

  return (
    <>
      <div className={styles.filters}>
        <ChipGroup legend="Thématique" hideLegend>
          <Chip
            type="radio"
            name="theme"
            value=""
            checked={active === null}
            onChange={() => onTheme?.(null)}
            count={personIds.length}
            testId="elles-theme-all"
          >
            Toutes
          </Chip>
          {themes.map((t) => (
            <Chip
              key={t.id}
              type="radio"
              name="theme"
              value={t.id}
              checked={active?.id === t.id}
              onChange={() => onTheme?.(t.id)}
              count={t.personIds.length}
              testId={`elles-theme-${t.id}`}
            >
              {t.label}
            </Chip>
          ))}
        </ChipGroup>
        {active ? (
          <div className={styles.about} data-testid="elles-theme-about">
            <p className="t-overline c-accent">{active.subtitle}</p>
            <p className="t-body c-2">{active.description}</p>
            <Link
              href={`/elles/${active.id}`}
              className={`t-label ${styles.aboutLink}`}
              data-testid={`theme-open-${active.id}`}
            >
              Toute la rubrique, et pourquoi chacune y figure
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        ) : null}
        <p className="t-caption c-muted" role="status">
          {shownIds.length} portrait{shownIds.length > 1 ? 's' : ''}
        </p>
      </div>

      <ul className={styles.grid} data-testid="wall">
        <li className={styles.featureCell}>{features[featureKey]}</li>
        {shownIds
          .filter((id) => id !== featured)
          .map((id) => (
            <li key={id}>{tiles[id]}</li>
          ))}
      </ul>
    </>
  );
}
