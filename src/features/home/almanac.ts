import { WOMEN_DATES } from '@/content/world/womenDates';
import type { CultureEntity } from '@/types';

/**
 * L'almanach de l'accueil : ce qui s'est passé un jour donné (naissances, décès, étapes des
 * conquêtes), et les journées internationales à venir. Tout vient des fiches ou de dates fixes :
 * la page suit le calendrier sans rédaction nouvelle.
 */

export type AlmanacKind = 'born' | 'died' | 'step';

export interface AlmanacEvent {
  month: number;
  day: number;
  year: number;
  kind: AlmanacKind;
  /** Fiche liée. */
  entityId: string;
  /** Nom de la femme, ou titre de la conquête. */
  title: string;
  /** Accroche de la femme, ou texte de l'étape. */
  text: string;
}

const MONTHS = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
];

/** « 21 avril 1944 », « 1er mai 1890 » ; une date sans jour (« Avril 1973 ») ne compte pas. */
export function parseFrenchDate(
  label: string,
): { day: number; month: number; year: number } | null {
  const m = /^(\d{1,2})(?:er)? (\p{L}+) (\d{4})$/u.exec(label.trim());
  if (!m) return null;
  const month = MONTHS.indexOf(m[2]!.toLowerCase()) + 1;
  if (!month) return null;
  return { day: Number(m[1]), month, year: Number(m[3]) };
}

function fromIso(iso: string) {
  const [year, month, day] = iso.split('-').map(Number);
  return { year: year!, month: month!, day: day! };
}

/** Tous les événements datés au jour du catalogue, calculés au build. */
export function almanacEvents(culture: readonly CultureEntity[]): AlmanacEvent[] {
  const events: AlmanacEvent[] = [];
  for (const e of culture) {
    const dates = e.kind === 'person' ? WOMEN_DATES[e.id] : undefined;
    const text = e.hook ?? e.subtitle ?? '';
    if (dates?.born)
      events.push({ ...fromIso(dates.born), kind: 'born', entityId: e.id, title: e.title, text });
    if (dates?.died)
      events.push({ ...fromIso(dates.died), kind: 'died', entityId: e.id, title: e.title, text });
    for (const step of e.right?.steps ?? []) {
      const date = parseFrenchDate(step.date);
      if (date)
        events.push({ ...date, kind: 'step', entityId: e.id, title: e.title, text: step.text });
    }
  }
  return events;
}

export interface AlmanacDay {
  /** Jours d'écart avec aujourd'hui : 0 pour « Ce jour-là », sinon les jours suivants. */
  offset: number;
  month: number;
  day: number;
  events: AlmanacEvent[];
}

/** Numéro du jour (heure locale), pour changer de contenu chaque jour. */
export const dayNumber = (date: Date) =>
  Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);

const addDays = (date: Date, n: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + n);

/**
 * Les événements du jour, les plus anciens d'abord. Un jour sans événement laisse place au
 * prochain jour qui en a : la rubrique n’est jamais vide.
 */
export function almanacFor(
  events: readonly AlmanacEvent[],
  today: Date,
  horizon = 31,
): AlmanacDay | null {
  for (let offset = 0; offset <= horizon; offset++) {
    const date = addDays(today, offset);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const found = events
      .filter((e) => e.month === month && e.day === day && e.year < date.getFullYear())
      .sort((a, b) => a.year - b.year);
    if (found.length) return { offset, month, day, events: found };
  }
  return null;
}

/** Journée internationale, à date fixe chaque année. */
export interface Observance {
  month: number;
  day: number;
  name: string;
  /** Ce que la page propose ce jour-là. */
  pitch: string;
  href: string;
  /** Jours pendant lesquels elle s'annonce avant la date. */
  lead: number;
}

export const OBSERVANCES: Observance[] = [
  {
    month: 2,
    day: 11,
    name: 'Journée internationale des femmes et des filles de science',
    pitch: 'Celles qui ont révolutionné le monde',
    href: '/elles?theme=revolutionne',
    lead: 14,
  },
  {
    month: 3,
    day: 8,
    name: 'Journée internationale des droits des femmes',
    pitch: 'Les conquêtes, une à une',
    href: '/droits',
    lead: 21,
  },
  {
    month: 9,
    day: 28,
    name: 'Journée mondiale pour le droit à l’avortement',
    pitch: 'Avorter, pays par pays',
    href: '/droits/monde#chapitre-avortement',
    lead: 14,
  },
  {
    month: 10,
    day: 11,
    name: 'Journée internationale de la fille',
    pitch: 'Leurs portraits',
    href: '/elles',
    lead: 10,
  },
  {
    month: 11,
    day: 25,
    name: 'Journée internationale pour l’élimination de la violence à l’égard des femmes',
    pitch: 'Féminicides : derrière chaque chiffre, une histoire',
    href: '/feminicides',
    lead: 35,
  },
];

/** La prochaine journée dans sa fenêtre d'annonce (ou aujourd'hui), avec les jours restants. */
export function nextObservance(
  today: Date,
  list: readonly Observance[] = OBSERVANCES,
): { observance: Observance; days: number } | null {
  const start = addDays(today, 0).getTime();
  let best: { observance: Observance; days: number } | null = null;
  for (const observance of list) {
    for (const year of [today.getFullYear(), today.getFullYear() + 1]) {
      const days = Math.round(
        (new Date(year, observance.month - 1, observance.day).getTime() - start) / 86_400_000,
      );
      if (days >= 0 && days <= observance.lead && (!best || days < best.days)) {
        best = { observance, days };
      }
    }
  }
  return best;
}

export const monthName = (month: number) => MONTHS[month - 1]!;

const years = (n: number) => (n === 1 ? 'un an' : `${n} ans`);

/**
 * Les mots de l'ouverture : la grande accroche (« Il y a 58 ans », « Dans 5 jours ») et la
 * phrase qui la suit. `offset` : jours avant la date ; `year` : l'année de cette date.
 */
export function almanacLead(
  e: AlmanacEvent,
  offset: number,
  year: number,
): { lead: string; accent: string; line: string } {
  const n = year - e.year;
  if (offset === 0) {
    const line =
      e.kind === 'born'
        ? `naissait ${e.title}.`
        : e.kind === 'died'
          ? `mourait ${e.title}.`
          : e.title;
    return { lead: 'Il y a', accent: years(n), line };
  }
  const line =
    e.kind === 'born'
      ? `il y aura ${years(n)} que ${e.title} est née.`
      : e.kind === 'died'
        ? `il y aura ${years(n)} que ${e.title} est morte.`
        : `${e.title} : il y aura ${years(n)}.`;
  return offset === 1
    ? { lead: '', accent: 'Demain', line }
    : { lead: 'Dans', accent: `${offset} jours`, line };
}
