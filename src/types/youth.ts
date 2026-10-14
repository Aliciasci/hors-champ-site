import type { Artwork, EditorialStatus, Source } from './content';

/**
 * « Tout est possible » : parcours jeunesse. Les tranches d'âge adaptent la lecture (longueur,
 * vocabulaire, activités) ; elles ne présupposent aucun centre d'intérêt.
 */
export type AgeBand = '6-10' | '11-14';

/** Un texte écrit pour chaque tranche d'âge. */
export type Leveled = Record<AgeBand, string>;

/** Portes d'entrée de « Qu'est-ce que tu aimerais explorer aujourd'hui ? ». */
export type ExploreDoor = 'comprendre' | 'inventer' | 'creer' | 'resoudre' | 'nature' | 'histoires';

/** Lien expliqué vers une fiche culturelle existante. Jamais une filiation inventée. */
export interface YouthCultureLink {
  /** Fiche de la collection culturelle (`person-…`, `science-…`…). */
  targetId: string;
  /** Ce qui relie les deux, en termes factuels (même domaine, même outil…), sans influence supposée. */
  explanation: Leveled;
  /** Source, parmi celles de l'élément, qui établit le fait côté jeunesse. */
  sourceId: string;
}

interface YouthBase {
  id: string;
  title: string;
  doors: ExploreDoor[];
  image?: Artwork;
  sources: Source[];
  editorialStatus: EditorialStatus;
  reviewedAt: string | null;
}

/** Fiche métier : « Et si tu devenais… » ou « Des métiers auxquels on ne pense pas ». */
export interface Career extends YouthBase {
  kind: 'career';
  /** Classe la fiche dans « Des métiers auxquels on ne pense pas ». */
  unusual: boolean;
  /** Une phrase d'accroche. */
  hook: Leveled;
  /** Ce que l'on fait vraiment, au quotidien. */
  daily: Leveled;
  /** Les problèmes que l'on peut aider à résoudre. */
  problems: Leveled;
  /** Compétences utiles, en mots simples. */
  skills: string[];
  /** Les voies possibles. `sourced` : appuyé par une source ; sinon présenté comme un repère. */
  paths: { text: Leveled; sourceId?: string }[];
  /** Exigences réelles si la profession est réglementée. */
  regulated?: Leveled;
  /** Portrait d'une femme réelle du domaine. */
  portraitId: string;
  /** Activité pour en découvrir un aspect. */
  activityId?: string;
  cultureLinks: YouthCultureLink[];
}

/** Portrait « Elles aussi, elles ont commencé quelque part ». */
export interface YouthPortrait extends YouthBase {
  kind: 'portrait';
  /** Années de vie, ex. « 1799 – 1847 » ou « née en 1935 ». */
  period: string;
  field: string;
  curiosity: Leveled;
  learning: Leveled;
  /** Difficultés et obstacles, seulement s'ils sont documentés. */
  difficulties?: Leveled;
  achievements: Leveled;
  /** Personnes ou circonstances qui l'ont aidée, si documentées. */
  helpers?: Leveled;
  /** Ce que l'on peut retenir, sans en faire une recette. */
  takeaway: Leveled;
  careerIds: string[];
  cultureLinks: YouthCultureLink[];
}

export type ActivityKind = 'riddle' | 'observe' | 'design' | 'build';

export interface ActivityChoice {
  id: string;
  label: string;
  /** Ce que ce choix fait apparaître. Jamais une note : une piste. */
  feedback: Leveled;
}

/** Activité « À toi d'essayer ». Toujours un exemple pédagogique, pas un fait documenté. */
export interface Activity extends YouthBase {
  kind: 'activity';
  activityKind: ActivityKind;
  minutes: number;
  /** Matériel gratuit ou courant ; vide si tout se fait dans l'application. */
  materials: string[];
  /** Consignes de sécurité, si l'activité se fait en vrai. */
  safety?: string[];
  intro: Leveled;
  /** Énigme et pont : une question et des pistes. */
  question?: Leveled;
  choices?: ActivityChoice[];
  /** Pont : étapes à réaliser. */
  steps?: Leveled[];
  /** Observation : détails à repérer dans l'œuvre `image`. */
  details?: { id: string; label: Leveled; explanation: Leveled }[];
  /** Robot : étapes de conception, chacune avec ses options. */
  design?: {
    id: string;
    prompt: Leveled;
    /** Intitulé dans le récapitulatif : « Son rôle », « Ce qu'il perçoit »… */
    summary: string;
    options: { id: string; label: string }[];
  }[];
  /** Ce qu'il fallait comprendre, une fois l'activité faite. */
  explanation: Leveled;
  /** Lien avec une discipline ou un métier réel. */
  discipline: Leveled;
  careerIds: string[];
}

/** Collection « Les vies qu'on n'imagine pas ». */
export interface YouthLife {
  id: string;
  title: string;
  intro: Leveled;
  /** Métiers, portraits, activités ou fiches culturelles. */
  itemIds: string[];
}

export type YouthItem = Career | YouthPortrait | Activity;
