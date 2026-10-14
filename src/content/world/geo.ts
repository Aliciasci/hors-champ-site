import { readFileSync } from 'node:fs';
import path from 'node:path';

import { geoArea, geoEqualEarth, geoGraticule10, geoOrthographic, geoPath } from 'd3-geo';
import type { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import countries from 'i18n-iso-countries';
import { feature } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';

import type { Box, MapCountry, WorldShapes } from './geoShared';

export type { Box, MapCountry, MapDot, WorldShapes } from './geoShared';
export { SUCCESSORS } from './geoShared';

/**
 * Vraie carte du monde, préparée au build : contours des pays de Natural Earth (domaine public,
 * via le paquet world-atlas, échelle 1:110 000 000), projection Equal Earth. Le navigateur reçoit
 * des tracés SVG prêts à l'emploi, sans calcul ni bibliothèque. Les codes à trois lettres viennent
 * de la norme ISO 3166 (paquet i18n-iso-countries).
 */

/** Micro-États absents de l'échelle 1:110 M : longitude et latitude de leur capitale. */
const SMALL_STATES: Record<string, [number, number]> = {
  LIE: [9.52, 47.14],
  BHR: [50.58, 26.22],
  MDV: [73.51, 4.18],
  WSM: [-171.76, -13.83],
  TON: [-175.2, -21.14],
  SGP: [103.82, 1.35],
  VAT: [12.45, 41.9],
  MLT: [14.51, 35.9],
  AND: [1.52, 42.51],
  MCO: [7.42, 43.74],
  SMR: [12.46, 43.94],
  LUX: [6.13, 49.61],
};

const WIDTH = 1000;
const HEIGHT = 500;
const round = (n: number) => Math.round(n * 10) / 10;

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
  const inEurope = (x: number, y: number) =>
    x > europe.x && x < europe.x + europe.width && y > europe.y && y < europe.y + europe.height;

  const shapes = land.map((f): MapCountry => {
    const id = f.id === undefined ? '' : String(f.id);
    const code = id ? countries.numericToAlpha3(id) : undefined;
    const country: MapCountry = { id: id || f.properties.name, d: draw(f) ?? '' };
    if (code) {
      const main = largestPart(f);
      const [x, y] = draw.centroid(main);
      const [[x0, y0], [x1, y1]] = draw.bounds(main);
      country.b = [round(x0), round(y0), round(x1), round(y1)];
      country.code = code;
      country.x = round(x);
      country.y = round(y);
      country.europe = inEurope(x, y);
    }
    return country;
  });

  const drawn = new Set(shapes.map((c) => c.code));
  const dots = Object.entries(SMALL_STATES)
    .filter(([code]) => !drawn.has(code))
    .map(([code, lonLat]) => {
      const [x, y] = projection(lonLat)!;
      return { code, x: round(x), y: round(y) };
    });

  cache = {
    width: WIDTH,
    height: HEIGHT,
    sphere: geoPath(projection).digits(1)({ type: 'Sphere' }) ?? '',
    countries: shapes,
    dots,
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

/** Le globe du collage d'Atlas : océan, méridiens et terres, vus depuis l'Atlantique. */
export function globe(size = 320): { sphere: string; graticule: string; land: string } {
  const file = path.join(process.cwd(), 'node_modules/world-atlas/land-110m.json');
  const topo = JSON.parse(readFileSync(file, 'utf8')) as Topology<{
    land: GeometryCollection;
  }>;
  const land = feature(topo, topo.objects.land);
  const projection = geoOrthographic().rotate([45, -12]).fitSize([size, size], { type: 'Sphere' });
  // Au pixel près : le globe est petit, la précision ne se verrait pas.
  const draw = geoPath(projection).digits(0);
  return {
    sphere: draw({ type: 'Sphere' }) ?? '',
    graticule: draw(geoGraticule10()) ?? '',
    land: draw(land) ?? '',
  };
}
