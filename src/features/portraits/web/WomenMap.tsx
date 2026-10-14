'use client';

import { useMemo, useRef, useState, type PointerEvent, type ReactNode } from 'react';

import { Chip, ChipGroup, Segmented } from '@/components/ui/Chip';
import type { WorldCountry } from '@/content/world';
import type { WorldShapes } from '@/content/world/geo';
import { womenByCountry } from '@/content/world/womenCountries';

import styles from './WomenMap.module.css';

const women = (n: number) => `${n} femme${n > 1 ? 's' : ''}`;

/**
 * Elles, pays par pays, sur une vraie carte du monde : chaque pays se colore selon le nombre de
 * femmes du catalogue, une pastille en donne le nombre. On choisit un pays sur la carte (souris,
 * doigt) ou dans la liste des pays (clavier, lecteur d'écran) ; ses femmes s'affichent à côté.
 */
export function WomenMap({
  personIds,
  countries,
  shapes,
  rows,
  selected,
  onSelect,
}: {
  /** Les femmes affichées (selon la thématique choisie), dans l'ordre du mur. */
  personIds: string[];
  /** Noms des pays, par code. */
  countries: WorldCountry[];
  /** Tracés de la carte, préparés au build. */
  shapes: WorldShapes;
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

  const [zoom, setZoom] = useState<'monde' | 'europe'>(() =>
    current && shapes.countries.find((c) => c.code === current)?.europe ? 'europe' : 'monde',
  );
  const inEurope = useMemo(
    () => new Set(shapes.countries.filter((c) => c.europe).map((c) => c.code!)),
    [shapes],
  );
  // Zoom : on agrandit le cadre de l'Europe à la largeur de la carte ; les pastilles et les
  // traits gardent leur taille à l'écran.
  const box = zoom === 'europe' ? shapes.europe : null;
  const k = box ? Math.min(shapes.width / box.width, shapes.height / box.height) : 1;
  const tx = box ? -box.x * k + (shapes.width - box.width * k) / 2 : 0;
  const ty = box ? -box.y * k + (shapes.height - box.height * k) / 2 : 0;

  const [hover, setHover] = useState<{ code: string; x: number; y: number } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const codeAt = (event: PointerEvent<HTMLDivElement>) =>
    (event.target as Element).closest<SVGElement>('[data-code]')?.dataset.code;
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const code = codeAt(event);
    const box = mapRef.current?.getBoundingClientRect();
    if (!code || !box || !byCountry[code]) return setHover(null);
    setHover({
      code,
      x: Math.min(Math.max(event.clientX - box.left, 90), box.width - 90),
      y: event.clientY - box.top - 12,
    });
  };
  const choose = (code: string) => {
    onSelect(code);
    setZoom(inEurope.has(code) ? 'europe' : 'monde');
    // Sur petit écran, la liste est sous la carte : on l'amène à l'écran.
    if (window.matchMedia('(max-width: 899px)').matches)
      panelRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  };
  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const code = codeAt(event);
    if (code && byCountry[code]) choose(code);
  };

  const countriesCount = ranked.length;
  // Pastilles : les plus grandes d'abord, pour que les petites restent au-dessus.
  const bubbles = shapes.countries
    .filter((c) => c.code && byCountry[c.code])
    .sort((a, b) => byCountry[b.code!]!.length - byCountry[a.code!]!.length);

  return (
    <div className={styles.layout} data-tone="arts" data-testid="women-map">
      <div className={styles.mapCol}>
        <div className={styles.zoom}>
          <Segmented
            legend="Zoom de la carte"
            name="zoom"
            options={[
              { id: 'monde', label: 'Monde' },
              { id: 'europe', label: 'Europe' },
            ]}
            value={zoom}
            onChange={setZoom}
            testIdPrefix="women-zoom"
          />
        </div>
        <div
          ref={mapRef}
          className={styles.map}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={() => setHover(null)}
          role="img"
          aria-label={`Carte du monde : ${women(personIds.length)} dans ${countriesCount} pays. Choisissez un pays dans la liste.`}
        >
          <svg
            viewBox={`0 0 ${shapes.width} ${shapes.height}`}
            className={styles.svg}
            aria-hidden="true"
            focusable="false"
          >
            <g
              className={styles.world}
              style={{ transform: `translate(${tx}px, ${ty}px) scale(${k})` }}
            >
              <path d={shapes.sphere} className={styles.ocean} />
              {shapes.countries.map((country) => {
                const n = country.code ? (byCountry[country.code]?.length ?? 0) : 0;
                const level = n === 0 ? 'land' : n > 1 ? 'many' : 'one';
                return (
                  <path
                    key={country.id}
                    d={country.d}
                    className={`${styles[level]} ${country.code && country.code === current ? styles.on : ''}`}
                    data-code={country.code}
                    data-count={country.code ? n : undefined}
                    data-testid={country.code ? `women-tile-${country.code}` : undefined}
                  />
                );
              })}
              {bubbles.map((country) => {
                const n = byCountry[country.code!]!.length;
                const r = 7 + 3.2 * Math.sqrt(n);
                return (
                  <g
                    key={country.code}
                    className={`${styles.bubble} ${country.code === current ? styles.bubbleOn : ''}`}
                    data-code={country.code}
                    data-testid={`women-bubble-${country.code}`}
                    transform={`translate(${country.x} ${country.y})`}
                  >
                    <g className={styles.unscale} style={{ transform: `scale(${1 / k})` }}>
                      <circle r={r} />
                      <text dy="0.35em" fontSize={r > 12 ? 13 : 10}>
                        {n}
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>
          </svg>
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
          Le nombre de chaque pastille : les femmes du catalogue liées au pays. Une femme compte
          pour chaque pays dont elle a eu la nationalité, d’après Wikidata. Fond de carte : Natural
          Earth.
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
