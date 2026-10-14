import type { StaticImageData } from 'next/image';

/**
 * Modèle des contenus éditoriaux.
 * Ces types décrivent les données, indépendamment de leur provenance
 * (fichiers locaux aujourd'hui, API distante demain).
 */

/** Date ISO 8601 au format AAAA-MM-JJ. */
export type IsoDate = string;

export type CategoryId =
  | 'doubles-standards'
  | 'sexisme-quotidien'
  | 'medias-publicite'
  | 'stereotypes'
  | 'raisonnement'
  | 'histoire-culture';

export interface Category {
  id: CategoryId;
  title: string;
  shortTitle: string;
  description: string;
  /** Œuvre illustrant la catégorie, `null` pour utiliser le motif graphique. */
  artwork: Artwork | null;
  /** Motif graphique de repli, si aucune œuvre n'est disponible. */
  motif: CoverMotif;
}

export type CoverMotif = 'split' | 'circles' | 'frame' | 'stripes' | 'arrows' | 'arch';

/**
 * Image utilisée comme illustration (œuvre, photographie, document). Uniquement du domaine
 * public ou sous licence libre, avec un lien vers la page qui atteste la licence.
 */
export interface Artwork {
  /** Illustration locale (voir `data/images.ts`) ou URL. */
  image: StaticImageData | string;
  /** Description factuelle pour les lecteurs d'écran. */
  alt: string;
  title: string;
  artist: string;
  date: string;
  /** Musée ou collection de conservation, si une seule institution est identifiée. */
  holder?: string;
  /**
   * Licence de la reproduction. Les licences `CC BY` imposent de créditer l'auteur ou le détenteur
   * (champ `artist`), ce que fait le bouton « i » et la page Crédits du Profil.
   */
  license: 'Domaine public' | 'CC0' | 'CC BY 2.0' | 'CC BY 3.0';
  /** Page attestant la licence (Wikimedia Commons, site du musée…). */
  sourceUrl: string;
  /** Point de cadrage pour les recadrages (valeurs CSS en %, ex. `{ top: '10%' }`) : devient un `object-position`. */
  focus?: { top?: `${number}%`; left?: `${number}%` };
}

export type ExperienceContentType =
  'scenario' | 'image-analysis' | 'double-standard' | 'argument-analysis' | 'historical-context';

export type Difficulty = 'decouverte' | 'intermediaire' | 'approfondi';

/**
 * Statut éditorial.
 * - `dev-example` : contenu de développement, non documenté, à ne jamais présenter comme une analyse.
 * - `draft` : rédaction en cours.
 * - `in-review` : relecture éditoriale en cours.
 * - `verified` : relu, sources vérifiées à la date `reviewedAt`.
 */
export type EditorialStatus = 'dev-example' | 'draft' | 'in-review' | 'verified';

export type SourceType =
  'academic' | 'institutional' | 'legal' | 'press' | 'book' | 'encyclopedia' | 'archive' | 'other';

interface SourceBase {
  id: string;
  title: string;
  publisher: string;
  url: string;
  sourceType: SourceType;
  publishedAt?: IsoDate;
  accessedAt: IsoDate;
}

/** Une source doit comporter un extrait pertinent, une note explicative, ou les deux. */
export type Source = SourceBase &
  ({ relevantExcerpt: string; note?: string } | { relevantExcerpt?: string; note: string });

export interface CoverImage {
  /** Illustration locale ou URL distante. */
  source: StaticImageData | string;
  /** Description pour les lecteurs d'écran. Obligatoire. */
  alt: string;
  credit?: string;
}

/** Blocs qui composent la mise en situation. */
export type ScenarioBlock =
  | { kind: 'paragraph'; text: string }
  /** Réplique d'un personnage fictif (jamais une citation réelle). */
  | { kind: 'dialogue'; speaker: string; text: string }
  /** Mise en regard de deux situations, pour les doubles standards. */
  | {
      kind: 'comparison';
      left: { label: string; text: string };
      right: { label: string; text: string };
    }
  /** Description d'un visuel (publicité, image) analysé. */
  | { kind: 'visual'; title: string; description: string; image?: CoverImage }
  /** Argument à analyser, présenté comme prémisses et conclusion. */
  | { kind: 'argument'; premises: string[]; conclusion: string }
  | { kind: 'context'; title: string; text: string };

export interface Scenario {
  title: string;
  blocks: ScenarioBlock[];
}

/**
 * Qualité de raisonnement associée à une option.
 * On évalue le raisonnement, jamais la personne.
 */
export type OptionAssessment =
  /** Raisonnement solide au vu des éléments disponibles. */
  | 'solid'
  /** En partie fondé, mais va plus loin que ce que les éléments permettent. */
  | 'partial'
  /** Lecture défendable parmi d'autres : la situation admet plusieurs interprétations. */
  | 'open'
  /** Raisonnement fragile : il repose sur un raccourci ou une erreur. */
  | 'weak';

export interface AnswerOption {
  id: string;
  label: string;
  assessment: OptionAssessment;
  /** Explication propre à cette réponse, affichée après validation. */
  feedback: string;
}

/**
 * - `single` : une réponse à choisir.
 * - `multiple` : plusieurs éléments à repérer.
 */
export type QuestionMode = 'single' | 'multiple';

export interface Question {
  prompt: string;
  mode: QuestionMode;
  helper?: string;
}

export interface Explanation {
  summary: string;
  keyPoints: string[];
}

export interface CounterArgument {
  claim: string;
  response: string;
}

export interface Nuance {
  canConclude: string[];
  cannotConclude: string[];
  counterArguments: CounterArgument[];
}

export interface Experience {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  introduction: string;
  categoryId: CategoryId;
  estimatedMinutes: number;
  difficulty: Difficulty;
  coverImage: CoverImage | null;
  contentType: ExperienceContentType;
  scenario: Scenario;
  question: Question;
  answerOptions: AnswerOption[];
  explanation: Explanation;
  nuance: Nuance;
  sources: Source[];
  relatedExperienceIds: string[];
  editorialStatus: EditorialStatus;
  /** Date de dernière relecture éditoriale, `null` si jamais relu. */
  reviewedAt: IsoDate | null;
}
