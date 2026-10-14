'use client';

import { Suspense, useId, type ReactNode } from 'react';

import { BookOpen, ChevronDown, Compass } from '@/components/icons';
import { Chip } from '@/components/ui/Chip';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EXPLORE_DOORS } from '@/data/youth';
import { AGE_BANDS } from '@/features/youth/youthCatalog';
import { readOne, useQueryState } from '@/lib/useQueryState';
import { useAppStore } from '@/store/useAppStore';
import type { Artwork, ExploreDoor, Leveled } from '@/types';

import { AgeBandFromUrl, AgeBandPicker } from './AgeBand';
import styles from './youth.module.css';
import type { YouthKind } from './YouthThumb';
import { YouthTile } from './YouthTile';

export interface TileData {
  id: string;
  kind: YouthKind;
  title: string;
  line?: string | Leveled;
  image?: Artwork;
  doors: ExploreDoor[];
  /** Métier « auquel on ne pense pas » (collection C). */
  unusual?: boolean;
}

const DOOR_IDS = EXPLORE_DOORS.map((d) => d.id);
const NONE_HERE = 'Rien ici pour cette porte… pour l’instant. Essaie une autre porte !';

function Panel({
  icon,
  label,
  value,
  badge,
  children,
  testId,
}: {
  icon: ReactNode;
  label: string;
  value?: string;
  badge?: number;
  children: ReactNode;
  testId: string;
}) {
  return (
    <details className={styles.panel} data-testid={testId}>
      <summary>
        {icon}
        <span className={styles.panelLabel}>
          <span className="t-label">{label}</span>
          {value ? <span className="t-caption c-2">{value}</span> : null}
        </span>
        {badge ? (
          <span className={styles.badge}>
            {badge}
            <span className="sr-only"> filtre actif</span>
          </span>
        ) : null}
        <ChevronDown size={18} strokeWidth={2.25} aria-hidden="true" className={styles.chevron} />
      </summary>
      <div className={styles.panelBody}>{children}</div>
    </details>
  );
}

function Row({
  kicker,
  title,
  testId,
  empty,
  children,
}: {
  kicker: string;
  title: string;
  testId: string;
  empty: string;
  children: ReactNode[];
}) {
  return (
    <section className={styles.section} data-testid={testId} aria-label={title}>
      <SectionHeader kicker={kicker} title={title} />
      {children.length > 0 ? (
        <ul className={styles.row}>{children}</ul>
      ) : (
        <p className="t-body c-muted">{empty}</p>
      )}
    </section>
  );
}

function Browser({
  tiles,
  lives,
  door,
  setDoor,
}: {
  tiles: TileData[];
  lives: TileData[];
  door: ExploreDoor | null;
  setDoor: (door: ExploreDoor | null) => void;
}) {
  const name = useId();
  const ageBand = useAppStore((s) => s.preferences.ageBand);
  const shown = door ? tiles.filter((t) => t.doors.includes(door)) : tiles;
  const tile = (t: TileData) => (
    <li key={t.id}>
      <YouthTile id={t.id} kind={t.kind} title={t.title} line={t.line} image={t.image} />
    </li>
  );
  const careers = shown.filter((t) => t.kind === 'career');

  return (
    <>
      <div className={styles.panels}>
        <Panel
          testId="possible-level-toggle"
          icon={<BookOpen size={20} aria-hidden="true" />}
          label="Niveau de lecture"
          value={ageBand ? AGE_BANDS.find((b) => b.id === ageBand)?.label : 'Pas de choix'}
        >
          <AgeBandPicker />
        </Panel>
        <Panel
          testId="possible-doors-toggle"
          icon={<Compass size={20} aria-hidden="true" />}
          label="Qu’est-ce que tu aimerais explorer aujourd’hui ?"
          value={door ? EXPLORE_DOORS.find((d) => d.id === door)?.label : undefined}
          badge={door ? 1 : 0}
        >
          <fieldset className={styles.choices} data-testid="possible-doors">
            <legend className="sr-only">Portes d’entrée</legend>
            <div className={styles.tags}>
              <Chip
                type="radio"
                name={name}
                value="all"
                checked={door === null}
                onChange={() => setDoor(null)}
                testId="possible-door-all"
              >
                Tout voir
              </Chip>
              {EXPLORE_DOORS.map((d) => (
                <Chip
                  key={d.id}
                  type="radio"
                  name={name}
                  value={d.id}
                  checked={door === d.id}
                  onChange={() => setDoor(d.id)}
                  testId={`possible-door-${d.id}`}
                >
                  {d.label}
                </Chip>
              ))}
            </div>
          </fieldset>
          <p className="t-caption c-muted" aria-live="polite">
            {door
              ? `${shown.length} carte${shown.length > 1 ? 's' : ''} pour cette porte. Choisis « Tout voir » pour tout revoir.`
              : 'Choisis une porte pour filtrer les cartes, ou parcours tout. Tu peux en changer quand tu veux.'}
          </p>
        </Panel>
      </div>

      <Row
        kicker="A · Métiers"
        title="Et si tu devenais…"
        testId="possible-careers"
        empty={NONE_HERE}
      >
        {careers.filter((c) => !c.unusual).map(tile)}
      </Row>
      <Row
        kicker="B · Portraits"
        title="Elles aussi, elles ont commencé quelque part"
        testId="possible-portraits"
        empty={NONE_HERE}
      >
        {shown.filter((t) => t.kind === 'portrait').map(tile)}
      </Row>
      <Row
        kicker="C · Métiers"
        title="Des métiers auxquels on ne pense pas"
        testId="possible-unusual"
        empty={NONE_HERE}
      >
        {careers.filter((c) => c.unusual).map(tile)}
      </Row>
      <Row
        kicker="D · Activités"
        title="À toi d’essayer"
        testId="possible-activities"
        empty={NONE_HERE}
      >
        {shown.filter((t) => t.kind === 'activity').map(tile)}
      </Row>
      <Row
        kicker="E · Collections"
        title="Les vies qu’on n’imagine pas"
        testId="possible-lives"
        empty="Les collections arrivent."
      >
        {lives.map(tile)}
      </Row>
    </>
  );
}

function BrowserWithUrl(props: { tiles: TileData[]; lives: TileData[] }) {
  const { params, set } = useQueryState();
  const door = readOne<ExploreDoor | 'all'>(params.get('porte'), [...DOOR_IDS, 'all'], 'all');
  return (
    <>
      <AgeBandFromUrl />
      <Browser
        {...props}
        door={door === 'all' ? null : door}
        setDoor={(next) => set({ porte: next })}
      />
    </>
  );
}

/**
 * Niveau de lecture, portes d'entrée et collections A à E. La porte choisie (`?porte=`) et le
 * niveau (`?age=`) sont dans l'URL ; pré-rendu sans filtre.
 */
export function PossibleBrowser(props: { tiles: TileData[]; lives: TileData[] }) {
  return (
    <Suspense fallback={<Browser {...props} door={null} setDoor={() => undefined} />}>
      <BrowserWithUrl {...props} />
    </Suspense>
  );
}
