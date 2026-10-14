import { readFileSync } from 'node:fs';
import path from 'node:path';

import { geoArea, geoEqualEarth, geoPath } from 'd3-geo';
import type { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import { feature } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';

/**
 * Vraie carte du monde, préparée au build : contours des pays de Natural Earth (domaine public,
 * via le paquet world-atlas, échelle 1:110 000 000), projection Equal Earth. Le navigateur reçoit
 * des tracés SVG prêts à l'emploi, sans calcul ni bibliothèque.
 */

/** Code ISO numérique (celui de world-atlas) des pays où figurent des femmes du catalogue. */
export const ISO_NUMERIC: Record<string, string> = {
  AUT: '040',
  BEL: '056',
  CHE: '756',
  CHL: '152',
  CHN: '156',
  DEU: '276',
  DZA: '012',
  FRA: '250',
  GBR: '826',
  GIN: '324',
  GTM: '320',
  HUN: '348',
  IRN: '364',
  IRQ: '368',
  ITA: '380',
  JPN: '392',
  KEN: '404',
  LBR: '430',
  NZL: '554',
  PAK: '586',
  POL: '616',
  SWE: '752',
  TUN: '788',
  USA: '840',
  ZAF: '710',
};

export interface MapCountry {
  /** Code ISO numérique de world-atlas. */
  id: string;
  /** Code ISO à trois lettres, pour les pays du catalogue. */
  code?: string;
  d: string;
  /** Point d'ancrage de la pastille : centre du plus grand territoire du pays. */
  x?: number;
  y?: number;
  /** Pastille dans le cadre « Europe ». */
  europe?: boolean;
}

export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WorldShapes {
  width: number;
  height: number;
  /** Contour du globe (l'océan). */
  sphere: string;
  countries: MapCountry[];
  /** Cadre du zoom sur l'Europe, où les pays sont serrés. */
  europe: Box;
}

const WIDTH = 1000;
const HEIGHT = 500;

let cache: WorldShapes | null = null;

/** Les tracés de la carte, calculés une fois par build. */
export function worldShapes(): WorldShapes {
  if (cache) return cache;
  const file = path.join(process.cwd(), 'node_modules/world-atlas/countries-110m.json');
  const topo = JSON.parse(readFileSync(file, 'utf8')) as Topology<{
    countries: GeometryCollection<{ name: string }>;
  }>;
  const all = feature(topo, topo.objects.countries) as FeatureCollection<
    Polygon | MultiPolygon,
    { name: string }
  >;
  // L'Antarctique occupe le bas de la carte sans rien y apporter ici.
  const land = all.features.filter((f) => f.properties.name !== 'Antarctica');
  const projection = geoEqualEarth().fitSize([WIDTH, HEIGHT], {
    type: 'FeatureCollection',
    features: land,
  });
  const draw = geoPath(projection).digits(1);
  // Cadre de l'Europe : de l'Atlantique à la mer Noire, du Maghreb au centre de la Scandinavie.
  const corners = [
    [-12, 34],
    [-12, 67],
    [34, 34],
    [34, 67],
    [11, 67],
    [11, 34],
  ].map((c) => projection(c as [number, number])!);
  const xs = corners.map((c) => c[0]);
  const ys = corners.map((c) => c[1]);
  const europe: Box = {
    x: Math.round(Math.min(...xs)),
    y: Math.round(Math.min(...ys)),
    width: Math.round(Math.max(...xs) - Math.min(...xs)),
    height: Math.round(Math.max(...ys) - Math.min(...ys)),
  };
  const codeOf = new Map(Object.entries(ISO_NUMERIC).map(([code, id]) => [id, code]));

  const countries = land.map((f): MapCountry => {
    const id = String(f.id);
    const code = codeOf.get(id);
    const country: MapCountry = { id, d: draw(f) ?? '' };
    if (code) {
      const [x, y] = draw.centroid(largestPart(f));
      country.code = code;
      country.x = Math.round(x * 10) / 10;
      country.y = Math.round(y * 10) / 10;
      country.europe =
        x > europe.x && x < europe.x + europe.width && y > europe.y && y < europe.y + europe.height;
    }
    return country;
  });

  cache = {
    width: WIDTH,
    height: HEIGHT,
    sphere: geoPath(projection).digits(1)({ type: 'Sphere' }) ?? '',
    countries,
    europe,
  };
  return cache;
}

/** Le plus grand territoire d'un pays (la métropole, pas les outre-mer). */
function largestPart(f: Feature<Polygon | MultiPolygon>): Feature<Polygon> {
  if (f.geometry.type === 'Polygon') return f as Feature<Polygon>;
  const parts = f.geometry.coordinates.map((coordinates): Feature<Polygon> => ({
    type: 'Feature',
    properties: {},
    geometry: { type: 'Polygon', coordinates },
  }));
  return parts.reduce((a, b) => (geoArea(b) > geoArea(a) ? b : a));
}
