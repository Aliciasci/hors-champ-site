'use client';

import { useMemo, useRef, useState, type PointerEvent, type ReactNode } from 'react';

import { Chip, ChipGroup } from '@/components/ui/Chip';
import type { WorldCountry } from '@/content/world';
import { womenByCountry } from '@/content/world/womenCountries';

import styles from './WomenMap.module.css';

const women = (n: number) => `${n} femme${n > 1 ? 's' : ''}`;

/**
 * Elles, pays par pays : la carte en tuiles du site, où chaque pays s'allume selon le nombre de
 * femmes du catalogue. On choisit un pays sur la carte (souris, doigt) ou dans la liste des pays
 * (clavier, lecteur d'écran) ; ses femmes s'affichent à côté, avec leurs œuvres et découvertes.
 */
export function WomenMap({
  personIds,
  countries,
  rows,
  selected,
  onSelect,
}: {
  /** Les femmes affichées (selon la thématique choisie), dans l'ordre du mur. */
  personIds: string[];
  countries: WorldCountry[];
  /** Ligne de chaque femme, pré-rendue côté serveur. */
  rows: Record<string, ReactNode>;
  selected: string | null;
  onSelect: (code: string | null) => void;
}) {
  const byCountry = useMemo(() => womenByCountry(personIds), [personIds]);
  const names = useMemo(() => new Map(countries.map((c) => [c.code, c.name])), [countries]);
  const ranked = useMemo(
    () =>
      Object.entries(byCountry)
        .filter(([code]) => names.has(code))
        .sort(
          (a, b) => b[1].length - a[1].length || names.get(a[0])!.localeCompare(names.get(b[0])!),
        ),
    [byCountry, names],
  );
  const current = selected && byCountry[selected] ? selected : null;
  const list = current ? byCountry[current]! : [];

  const [hover, setHover] = useState<{ code: string; x: number; y: number } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const tileAt = (event: PointerEvent<HTMLDivElement>) =>
    (event.target as HTMLElement).closest<HTMLElement>('[data-code]');
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const tile = tileAt(event);
    const box = mapRef.current?.getBoundingClientRect();
    if (!tile || !box || !byCountry[tile.dataset.code!]) return setHover(null);
    const rect = tile.getBoundingClientRect();
    setHover({
      code: tile.dataset.code!,
      x: Math.min(Math.max(rect.left + rect.width / 2 - box.left, 90), box.width - 90),
      y: rect.top - box.top,
    });
  };
  const choose = (code: string) => {
    onSelect(code);
    // Sur petit écran, la liste est sous la carte : on l'amène à l'écran.
    if (window.matchMedia('(max-width: 899px)').matches)
      panelRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  };
  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const code = tileAt(event)?.dataset.code;
    if (code && byCountry[code]) choose(code);
  };

  const countriesCount = ranked.length;

  return (
    <div className={styles.layout} data-tone="arts" data-testid="women-map">
      <div className={styles.mapCol}>
        <div
          ref={mapRef}
          className={styles.map}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={() => setHover(null)}
          role="img"
          aria-label={`Carte : ${women(personIds.length)} dans ${countriesCount} pays. Choisissez un pays dans la liste.`}
        >
          {countries.map((country) => {
            const n = byCountry[country.code]?.length ?? 0;
            const level = n === 0 ? 'empty' : n > 1 ? 'many' : 'one';
            return (
              <span
                key={country.code}
                className={`${styles.tile} ${styles[level]} ${country.code === current ? styles.on : ''}`}
                style={{ gridColumn: country.col + 1, gridRow: country.row + 1 }}
                data-code={country.code}
                data-count={n}
                data-testid={`women-tile-${country.code}`}
              >
                {n > 0 ? <span className={styles.n}>{n}</span> : null}
              </span>
            );
          })}
          {hover ? (
            <span
              className={styles.hover}
              style={{ left: hover.x, top: hover.y }}
              aria-hidden="true"
            >
              <strong>{names.get(hover.code)}</strong>
              <span>{women(byCountry[hover.code]?.length ?? 0)}</span>
            </span>
          ) : null}
        </div>
        <p className={`t-caption c-muted ${styles.note}`}>
          Case claire : une femme ; case pleine : plusieurs. Une femme compte pour chaque pays dont
          elle a eu la nationalité, d’après Wikidata.
        </p>
      </div>

      <div ref={panelRef} className={styles.panel} aria-live="polite">
        {current ? (
          <>
            <div className={styles.panelHead}>
              <h2 className="t-title2" data-testid="women-country-title">
                {names.get(current)}
              </h2>
              <p className="t-caption c-muted">{women(list.length)}</p>
              <button
                type="button"
                className={`t-label ${styles.back}`}
                onClick={() => onSelect(null)}
                data-testid="women-country-back"
              >
                Tous les pays
              </button>
            </div>
            <ul className={styles.rows} data-testid="women-country-list">
              {list.map((id) => (
                <li key={id} data-testid={`women-row-${id}`}>
                  {rows[id]}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <h2 className="t-title3">Choisissez un pays</h2>
            <p className="t-body-sm c-2">
              Sur la carte, ou dans la liste : {women(personIds.length)}, {countriesCount} pays.
            </p>
          </>
        )}
        <div className={styles.countries}>
          <ChipGroup legend="Pays" hideLegend>
            {ranked.map(([code, ids]) => (
              <Chip
                key={code}
                type="radio"
                name="pays"
                value={code}
                checked={code === current}
                onChange={() => choose(code)}
                count={ids.length}
                testId={`women-country-${code}`}
              >
                {names.get(code)}
              </Chip>
            ))}
          </ChipGroup>
        </div>
      </div>
    </div>
  );
}
