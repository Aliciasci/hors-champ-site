import type { Source } from '@/types';

import { SUFFRAGE, SUFFRAGE_SOURCE, SUFFRAGE_TODAY } from '../suffrage';
import avortement from './avortement.json';
import majorite from './majorite.json';
import universite from './universite.json';

/**
 * Droits des femmes dans le monde (page « Le monde s'allume »). Contenu propre au web.
 * Le vote vient de src/content/suffrage.ts ; les autres droits sont produits par
 * `npm run redaction:droits` puis `redaction:droits-site`, chaque étape citant un extrait exact.
 */

/** Plein, partiel (sous conditions, pour certains cas), ou pas (encore, ou plus). */
export type Level = 'full' | 'partial' | 'none';

export interface RightStep {
  year: number;
  level: Level;
  /** Passage exact de la source qui établit l'étape. */
  excerpt?: string;
  note?: string;
  /** Situation actuelle, décrite sans date par la source : placée à « Aujourd'hui ». */
  undated?: boolean;
}

/** Position « Aujourd'hui » des frises : la situation actuelle, quand la source la décrit. */
export const TODAY = 2026;

export type WorldRightId = 'vote' | 'universite' | 'majorite' | 'avortement';

export interface WorldRight {
  id: WorldRightId;
  /** Libellé court, pour le sélecteur. */
  label: string;
  /** « … pays de cette carte {verb} ». */
  verb: string;
  /** Phrase d'introduction, facultative. */
  intro?: string;
  fullLabel: string;
  partialLabel: string;
  /** « …, dont 7 {partialPhrase} ». */
  partialPhrase: string;
  /** Légende des cases sans le droit (en rouge). */
  noneLabel: string;
  range: [number, number];
  /** Années clés ; `TODAY` s'affiche « Aujourd'hui ». */
  keyYears: number[];
  defaultYear: number;
  /** Précision affichée à la position « Aujourd'hui ». */
  todayNote?: string;
  source: Source;
  /** Étapes par code de pays, dans l'ordre chronologique. */
  countries: Record<string, RightStep[]>;
}

export interface WorldCountry {
  code: string;
  name: string;
  /** Position sur la carte en tuiles, approximativement géographique. */
  col: number;
  row: number;
}

/** Pays présents dans les chronologies des autres droits, absents de celle du vote. */
const EXTRA_COUNTRIES: WorldCountry[] = [
  { code: 'GTM', name: 'Guatemala', col: 2, row: 7 },
  { code: 'CRI', name: 'Costa Rica', col: 4, row: 9 },
  { code: 'MNE', name: 'Monténégro', col: 12, row: 6 },
  { code: 'SRB', name: 'Serbie', col: 14, row: 6 },
  { code: 'CHN', name: 'Chine', col: 20, row: 5 },
  { code: 'KOR', name: 'Corée du Sud', col: 23, row: 5 },
  { code: 'SGP', name: 'Singapour', col: 21, row: 10 },
  { code: 'IDN', name: 'Indonésie', col: 22, row: 11 },
  { code: 'BEN', name: 'Bénin', col: 10, row: 9 },
  { code: 'RWA', name: 'Rwanda', col: 13, row: 10 },
  { code: 'AGO', name: 'Angola', col: 12, row: 11 },
  { code: 'ZWE', name: 'Zimbabwe', col: 13, row: 11 },
  { code: 'MOZ', name: 'Mozambique', col: 14, row: 11 },
  { code: 'NAM', name: 'Namibie', col: 12, row: 12 },
  { code: 'BWA', name: 'Botswana', col: 14, row: 12 },
  { code: 'LSO', name: 'Lesotho', col: 13, row: 13 },
  { code: 'YEM', name: 'Yémen', col: 16, row: 9 },
  { code: 'VAT', name: 'Vatican', col: 11, row: 6 },
];

export const WORLD_COUNTRIES: WorldCountry[] = [
  ...SUFFRAGE.map(({ code, name, col, row }) => ({ code, name, col, row })),
  ...EXTRA_COUNTRIES,
];

const FR_CHRONOLOGY: Source = {
  id: 'wikipedia-chronologie_des_droits_des_femmes_autres_que_le_suffrage',
  title: 'Chronologie des droits des femmes autres que le suffrage',
  publisher: 'Wikipédia',
  url: 'https://fr.wikipedia.org/wiki/Chronologie_des_droits_des_femmes_autres_que_le_suffrage',
  sourceType: 'encyclopedia',
  accessedAt: '2026-10-14',
  relevantExcerpt:
    'La chronologie des droits des femmes autres que le suffrage souligne les événements majeurs de l’élaboration des droits des femmes concernant les inégalités par rapport aux droits autres que celui du droit de vote.',
  note: 'Article collaboratif : à compléter par les sources primaires qu’il cite.',
};

const EN_REPRODUCTIVE: Source = {
  id: 'wikipedia-en-timeline_of_reproductive_rights_legislation',
  title: 'Timeline of reproductive rights legislation',
  publisher: 'Wikipedia (en anglais)',
  url: 'https://en.wikipedia.org/wiki/Timeline_of_reproductive_rights_legislation',
  sourceType: 'encyclopedia',
  accessedAt: '2026-10-14',
  relevantExcerpt:
    'This is a timeline of reproductive rights legislation, a chronological list of laws and legal decisions affecting human reproductive rights.',
  note: 'Article collaboratif : à compléter par les sources primaires qu’il cite.',
};

/** Étapes du vote : première reconnaissance, droit plein, puis la situation actuelle. */
function voteSteps(): Record<string, RightStep[]> {
  const steps: Record<string, RightStep[]> = Object.fromEntries(
    SUFFRAGE.map((c) => [
      c.code,
      c.first === c.full
        ? [{ year: c.first, level: 'full' as const, note: c.note }]
        : [
            { year: c.first, level: 'partial' as const, note: c.note },
            { year: c.full, level: 'full' as const },
          ],
    ]),
  );
  for (const today of SUFFRAGE_TODAY) {
    steps[today.code] = [
      ...(steps[today.code] ?? []),
      { year: TODAY, level: 'none', excerpt: today.excerpt, note: today.note, undated: true },
    ];
  }
  return steps;
}

type Extracted = { countries: Record<string, { steps: RightStep[] }> };
const stepsOf = (data: Extracted) =>
  Object.fromEntries(Object.entries(data.countries).map(([code, c]) => [code, c.steps]));

export const WORLD_RIGHTS: WorldRight[] = [
  {
    id: 'vote',
    label: 'Voter',
    verb: 'accordent le vote aux femmes',
    intro: 'Du premier pays, la Nouvelle-Zélande en 1893, aux derniers, au début du XXIᵉ siècle.',
    fullLabel: 'droit de vote',
    partialLabel: 'sous conditions',
    partialPhrase: 'sous conditions',
    noneLabel: 'pas de droit de vote',
    range: [1890, TODAY],
    keyYears: [1893, 1918, 1944, 1971, 2011, TODAY],
    defaultYear: 1944,
    todayNote:
      'En Arabie saoudite et à Brunei, seules des élections locales existent, pour les femmes comme pour les hommes.',
    source: SUFFRAGE_SOURCE,
    countries: voteSteps(),
  },
  {
    id: 'universite',
    label: 'Étudier',
    verb: 'ouvrent l’université aux femmes',
    intro: 'D’abord comme auditrices ou dans une seule université, puis partout, comme les hommes.',
    fullLabel: 'universités ouvertes',
    partialLabel: 'ouverture partielle',
    partialPhrase: 'en partie seulement',
    noneLabel: 'universités fermées',
    range: [1830, 1940],
    keyYears: [1833, 1861, 1880, 1905, 1935],
    defaultYear: 1880,
    source: FR_CHRONOLOGY,
    countries: stepsOf(universite as Extracted),
  },
  {
    id: 'majorite',
    label: 'Être majeure',
    verb: 'reconnaissent la majorité légale des femmes',
    intro:
      'Signer, gérer ses biens, agir en justice sans tuteur ni mari. Les femmes mariées l’obtiennent souvent bien après les autres.',
    fullLabel: 'toutes les femmes',
    partialLabel: 'non mariées seulement',
    partialPhrase: 'pour les seules femmes non mariées',
    noneLabel: 'pas de majorité légale',
    range: [1850, 2010],
    keyYears: [1857, 1900, 1938, 1975, 2006],
    defaultYear: 1938,
    source: FR_CHRONOLOGY,
    countries: stepsOf(majorite as Extracted),
  },
  {
    id: 'avortement',
    label: 'Avorter',
    verb: 'autorisent l’avortement',
    fullLabel: 'à la demande',
    partialLabel: 'pour certains motifs',
    partialPhrase: 'pour certains motifs',
    noneLabel: 'interdit',
    range: [1915, 2025],
    keyYears: [1920, 1936, 1975, 2000, 2022],
    defaultYear: 1975,
    source: EN_REPRODUCTIVE,
    countries: stepsOf(avortement as Extracted),
  },
];

/** Situation d'un pays une année donnée : la dernière étape passée, sinon rien. */
export function levelAt(steps: readonly RightStep[] | undefined, year: number): Level | null {
  if (!steps) return null;
  let level: Level = 'none';
  for (const step of steps) if (step.year <= year) level = step.level;
  return level;
}

/** Pays où le droit existe (plein ou partiel) une année donnée. */
export function rightCount(right: WorldRight, year: number) {
  const levels = Object.values(right.countries).map((steps) => levelAt(steps, year));
  return {
    total: levels.filter((l) => l === 'full' || l === 'partial').length,
    partial: levels.filter((l) => l === 'partial').length,
    known: levels.length,
  };
}

/** Premières années (même partielles), et premières années du droit plein. */
export function firstYear(steps: readonly RightStep[]) {
  return steps.find((s) => s.level !== 'none')?.year ?? null;
}
export function fullYear(steps: readonly RightStep[]) {
  return steps.find((s) => s.level === 'full')?.year ?? null;
}
