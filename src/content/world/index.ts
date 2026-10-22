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

export interface StoryStep {
  year: number;
  text: string;
  /** Pays dont parle l'étape (étiquette sur la carte, frise d'Atlas). */
  code: string;
}

/** Le bloc sombre d'un droit : combien d'années entre le premier pas et le droit plein. */
export interface GapPosterCopy {
  kicker: string;
  title: string;
  /** Libellés des deux années (« hommes 1848, femmes 1971 »). */
  fromLabel: string;
  toLabel: string;
}

export interface WorldRight {
  id: WorldRightId;
  /** Libellé court, pour le sélecteur. */
  label: string;
  /** Nom du droit, en surtitre (« Droit de vote »). */
  name: string;
  /** Fiche du catalogue sur ce droit en France, s'il y en a une. */
  ficheId?: string;
  /** Une femme du catalogue liée à ce droit, mise en avant (thème Atlas). */
  figureId?: string;
  /** « … pays de cette carte {verb} ». */
  verb: string;
  /** Le même verbe au singulier, pour un seul pays. */
  verbOne: string;
  /** Ce que signifie, pour un pays, d'avoir le droit plein puis partiel (cartes d'Atlas). */
  facts: { full: string; partial: string };
  /** Phrase d'introduction, facultative. */
  intro?: string;
  fullLabel: string;
  partialLabel: string;
  /** « …, dont 7 {partialPhrase} ». */
  partialPhrase: string;
  /** Le droit plein, en tête de l'infobulle (« Droit de vote depuis 82 ans »). */
  fullTitle: string;
  /** Légende des cases sans le droit (en rouge). */
  noneLabel: string;
  range: [number, number];
  /** Années clés ; `TODAY` s'affiche « Aujourd'hui ». */
  keyYears: number[];
  defaultYear: number;
  /** Précision affichée à la position « Aujourd'hui ». */
  todayNote?: string;
  source: Source;
  /** Ouverture du chapitre de ce droit, sur la page. */
  chapter: { title: string; accent: string };
  /** Le récit défilant : chaque phrase reprend un fait de la source du droit. */
  story: StoryStep[];
  gap: GapPosterCopy;
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
  { code: 'BLZ', name: 'Belize', col: 4, row: 6 },
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
  { code: 'LBR', name: 'Liberia', col: 9, row: 10 },
  { code: 'KEN', name: 'Kenya', col: 14, row: 10 },
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
    name: 'Droit de vote',
    ficheId: 'right-droit-de-vote',
    figureId: 'person-hubertine-auclert',
    verb: 'accordent le vote aux femmes',
    verbOne: 'accorde le vote aux femmes',
    facts: {
      full: 'Les femmes obtiennent le droit de vote.',
      partial: 'Les femmes obtiennent le droit de vote, sous conditions.',
    },
    intro: 'Du premier pays, la Nouvelle-Zélande en 1893, aux derniers, au début du XXIᵉ siècle.',
    fullLabel: 'droit de vote',
    partialLabel: 'sous conditions',
    partialPhrase: 'sous conditions',
    noneLabel: 'pas de droit de vote',
    fullTitle: 'Droit de vote',
    range: [1890, TODAY],
    keyYears: [1893, 1918, 1944, 1971, 2011, TODAY],
    defaultYear: 1944,
    todayNote:
      'En Arabie saoudite et à Brunei, seules des élections locales existent, pour les femmes comme pour les hommes.',
    source: SUFFRAGE_SOURCE,
    chapter: { title: 'Voter.', accent: 'De 1893 à aujourd’hui.' },
    story: [
      {
        year: 1893,
        text: 'La Nouvelle-Zélande est le premier pays où les femmes votent.',
        code: 'NZL',
      },
      {
        year: 1918,
        text: 'Après la guerre, une vague. Le Royaume-Uni l’accorde, mais à partir de 30 ans seulement.',
        code: 'GBR',
      },
      {
        year: 1944,
        text: 'Le 21 avril, les Françaises obtiennent enfin le droit de vote.',
        code: 'FRA',
      },
      {
        year: 1971,
        text: 'La Suisse l’accorde au niveau fédéral. Le dernier canton suivra en 1990.',
        code: 'CHE',
      },
      {
        year: 2011,
        text: 'L’Arabie saoudite, où seules les élections municipales donnent lieu à un vote.',
        code: 'SAU',
      },
      {
        year: TODAY,
        text: 'Les femmes ne votent toujours pas, ou plus, en Afghanistan, au Yémen et au Vatican.',
        code: 'AFG',
      },
    ],
    gap: {
      kicker: 'Voter · l’attente des femmes',
      title: 'Combien d’années les femmes ont-elles attendu, après les hommes, pour voter ?',
      fromLabel: 'hommes',
      toLabel: 'femmes',
    },
    countries: voteSteps(),
  },
  {
    id: 'universite',
    label: 'Étudier',
    name: 'Droit d’étudier',
    ficheId: 'event-1861-daubie-baccalaureat',
    figureId: 'person-julie-victoire-daubie',
    verb: 'ouvrent l’université aux femmes',
    verbOne: 'ouvre l’université aux femmes',
    facts: {
      full: 'Les universités s’ouvrent aux femmes.',
      partial: 'Une première ouverture de l’université aux femmes.',
    },
    intro: 'D’abord comme auditrices ou dans une seule université, puis partout, comme les hommes.',
    fullLabel: 'universités ouvertes',
    partialLabel: 'ouverture partielle',
    partialPhrase: 'en partie seulement',
    noneLabel: 'universités fermées',
    fullTitle: 'Universités ouvertes',
    range: [1830, 1940],
    keyYears: [1833, 1861, 1880, 1905, 1935],
    defaultYear: 1880,
    source: FR_CHRONOLOGY,
    chapter: { title: 'Étudier.', accent: 'Passer la porte de l’université.' },
    story: [
      {
        year: 1833,
        text: 'Aux États-Unis, l’Oberlin College devient la première université mixte du pays.',
        code: 'USA',
      },
      {
        year: 1861,
        text: 'En France, Julie-Victoire Daubié est la première femme étudiante.',
        code: 'FRA',
      },
      {
        year: 1880,
        text: 'La France, le Canada et l’Australie ouvrent leurs universités aux femmes.',
        code: 'FRA',
      },
      { year: 1905, text: 'En Russie, les universités s’ouvrent enfin aux femmes.', code: 'RUS' },
      {
        year: 1935,
        text: 'En Iran, les femmes sont admises à l’université de Téhéran.',
        code: 'IRN',
      },
    ],
    gap: {
      kicker: 'Étudier · l’attente des femmes',
      title:
        'Combien d’années entre les premières étudiantes et des universités ouvertes à toutes ?',
      fromLabel: 'premier pas',
      toLabel: 'ouverture',
    },
    countries: stepsOf(universite as Extracted),
  },
  {
    id: 'majorite',
    label: 'Être majeure',
    name: 'Majorité légale',
    ficheId: 'right-regimes-matrimoniaux',
    verb: 'reconnaissent la majorité légale des femmes',
    verbOne: 'reconnaît la majorité légale des femmes',
    facts: {
      full: 'Toutes les femmes deviennent majeures.',
      partial: 'Les femmes non mariées deviennent majeures.',
    },
    intro:
      'Signer, gérer ses biens, agir en justice sans tuteur ni mari. Les femmes mariées l’obtiennent souvent bien après les autres.',
    fullLabel: 'toutes les femmes',
    partialLabel: 'non mariées seulement',
    partialPhrase: 'pour les seules femmes non mariées',
    noneLabel: 'pas de majorité légale',
    fullTitle: 'Majorité légale pour toutes',
    range: [1850, 2010],
    keyYears: [1857, 1900, 1938, 1975, 2006],
    defaultYear: 1938,
    source: FR_CHRONOLOGY,
    chapter: { title: 'Être majeure.', accent: 'Décider seule.' },
    story: [
      { year: 1857, text: 'Au Danemark, les femmes non mariées deviennent majeures.', code: 'DNK' },
      {
        year: 1893,
        text: 'En France, la majorité légale est accordée aux femmes non mariées et séparées.',
        code: 'FRA',
      },
      { year: 1938, text: 'En France, les femmes mariées deviennent enfin majeures.', code: 'FRA' },
      {
        year: 1939,
        text: 'En Espagne, la majorité des femmes mariées, accordée en 1931, est annulée.',
        code: 'ESP',
      },
      {
        year: 1984,
        text: 'En Suisse, une femme mariée n’a plus besoin de l’accord de son mari pour agir en justice.',
        code: 'CHE',
      },
      {
        year: 2006,
        text: 'Au Lesotho, la loi abolit la suprématie du mari sur son épouse.',
        code: 'LSO',
      },
    ],
    gap: {
      kicker: 'Être majeure · l’attente des femmes mariées',
      title:
        'Combien d’années les femmes mariées ont-elles attendu, après les célibataires, pour être majeures ?',
      fromLabel: 'célibataires',
      toLabel: 'mariées',
    },
    countries: stepsOf(majorite as Extracted),
  },
  {
    id: 'avortement',
    label: 'Avorter',
    name: 'Droit à l’avortement',
    ficheId: 'right-ivg',
    figureId: 'person-simone-veil',
    verb: 'autorisent l’avortement',
    verbOne: 'autorise l’avortement',
    facts: {
      full: 'L’avortement est autorisé à la demande.',
      partial: 'L’avortement est autorisé pour certains motifs.',
    },
    fullLabel: 'à la demande',
    partialLabel: 'pour certains motifs',
    partialPhrase: 'pour certains motifs',
    noneLabel: 'interdit',
    fullTitle: 'Avortement à la demande',
    range: [1915, 2025],
    keyYears: [1920, 1936, 1975, 2000, 2022],
    defaultYear: 1975,
    source: EN_REPRODUCTIVE,
    chapter: { title: 'Avorter.', accent: 'Un droit qui peut reculer.' },
    story: [
      {
        year: 1920,
        text: 'L’Union soviétique est le premier pays à autoriser l’avortement à la demande.',
        code: 'RUS',
      },
      { year: 1936, text: 'Staline revient sur l’essentiel de cette légalisation.', code: 'RUS' },
      {
        year: 1939,
        text: 'En France, l’avortement est permis pour sauver la vie de la femme enceinte.',
        code: 'FRA',
      },
      {
        year: 1975,
        text: 'La France l’autorise à la demande, au premier trimestre. L’Allemagne de l’Ouest suit en 1976.',
        code: 'FRA',
      },
      {
        year: 2019,
        text: 'En Irlande, l’interruption de grossesse devient possible jusqu’à 12 semaines.',
        code: 'IRL',
      },
      {
        year: 2022,
        text: 'Aux États-Unis, l’arrêt Dobbs supprime la protection fédérale. La Colombie, elle, dépénalise.',
        code: 'USA',
      },
    ],
    gap: {
      kicker: 'Avorter · l’attente des femmes',
      title: 'Combien d’années entre les premières exceptions et l’avortement à la demande ?',
      fromLabel: 'exceptions',
      toLabel: 'à la demande',
    },
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

export interface GapRow {
  name: string;
  from: number;
  to: number;
}

/**
 * Pour un droit hors vote : par pays, l'année du premier pas (droit partiel) et celle du droit
 * plein qui suit ; seuls les pays où les deux existent sont retenus, du plus long au plus court.
 */
export function rightGaps(right: WorldRight): GapRow[] {
  const names = new Map(WORLD_COUNTRIES.map((c) => [c.code, c.name]));
  return Object.entries(right.countries)
    .flatMap(([code, steps]) => {
      const first = steps.find((s) => s.level === 'partial');
      const full = first && steps.find((s) => s.level === 'full' && s.year > first.year);
      return first && full
        ? [{ name: names.get(code) ?? code, from: first.year, to: full.year }]
        : [];
    })
    .sort((a, b) => b.to - b.from - (a.to - a.from) || a.name.localeCompare(b.name));
}
