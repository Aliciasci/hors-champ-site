/**
 * Types et données de la carte du monde utilisables dans le navigateur (sans accès aux fichiers) ;
 * les tracés sont calculés au build par ./geo.ts.
 */
export interface MapCountry {
  /** Code ISO numérique de world-atlas. */
  id: string;
  /** Code ISO à trois lettres. */
  code?: string;
  d: string;
  /** Point d'ancrage (pastille, étiquette) : centre du plus grand territoire du pays. */
  x?: number;
  y?: number;
  /** Ancrage dans le cadre « Europe ». */
  europe?: boolean;
  /** Emprise du plus grand territoire : x0, y0, x1, y1. */
  b?: [number, number, number, number];
}

/** Pays trop petits pour l'échelle de la carte : un point à leur position. */
export interface MapDot {
  code: string;
  x: number;
  y: number;
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
  dots: MapDot[];
  /** Cadre du zoom sur l'Europe, où les pays sont serrés. */
  europe: Box;
}

/**
 * États disparus des données, rattachés aux pays d'aujourd'hui qui les recouvrent : un pays
 * successeur sans données propres prend celles de l'État d'origine.
 */
export const SUCCESSORS: Record<string, string[]> = {
  CSK: ['CZE', 'SVK'],
  YUG: ['SRB', 'HRV', 'SVN', 'BIH', 'MKD', 'MNE'],
};
