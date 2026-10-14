import type { Artwork, CategoryId, EditorialStatus, IsoDate, Source } from './content';

/**
 * Découverte culturelle : un graphe de fiches reliées entre elles
 * (femmes, œuvres, inventions, mouvements, événements, idées, conquêtes de droits,
 * organisations, textes de loi).
 */
export type CultureKind =
  'person' | 'work' | 'science' | 'movement' | 'event' | 'idea' | 'right' | 'organization' | 'law';

/** Domaine d'une fiche, pour filtrer la vue d'ensemble. Les idées n'en ont pas : elles sont transversales. */
export type CultureDomain = 'arts' | 'sciences' | 'droits';

/**
 * Nature d'un lien, déclaré dans un seul sens dans les données.
 * Le sens inverse est calculé (voir features/culture/cultureGraph.ts).
 * - `created` : une femme → l'œuvre qu'elle a créée, ou l'invention / la découverte qu'elle a faite ;
 * - `member-of` : une femme → le mouvement auquel elle est rattachée ;
 * - `took-part` : une femme → un événement qui la concerne ;
 * - `illustrates` : une œuvre → l'idée qu'elle a été choisie pour illustrer (choix éditorial) ;
 * - `contributed` : une femme ou une organisation → une conquête à laquelle elle a contribué
 *   (nature de la contribution, détail et source obligatoires) ;
 * - `enacted` : un texte de loi → la conquête qu'il établit ;
 * - `context` : tout autre rapprochement documenté.
 */
export type CultureRelation =
  'created' | 'member-of' | 'took-part' | 'illustrates' | 'contributed' | 'enacted' | 'context';

/**
 * Nature d'une contribution à une conquête. On distingue toujours qui revendique,
 * qui mobilise, qui défend une réforme… et l'institution qui adopte la loi (fiche `law`).
 */
export type ContributionKind =
  | 'claim'
  | 'mobilization'
  | 'publication'
  | 'research'
  | 'legal-action'
  | 'advocacy'
  | 'drafting'
  | 'reform'
  | 'continuation';

export interface CultureLink {
  targetId: string;
  relation: CultureRelation;
  /** Pour `contributed` : nature de la contribution. */
  contribution?: ContributionKind;
  /** Pour `contributed` : la contribution précise, appuyée par la source `sourceId`. */
  detail?: string;
  /** Identifiant d'une source de la fiche d'origine, qui établit ce lien. */
  sourceId?: string;
  /** Année (ou début) de la contribution. */
  year?: number;
}

/** Les huit grandes familles de conquêtes. */
export type RightCategory =
  | 'politique'
  | 'autonomie'
  | 'reproduction'
  | 'education'
  | 'travail'
  | 'violences'
  | 'famille'
  | 'libertes';

export interface RightStep {
  /** Date affichée, ex. « 5 avril 1971 ». */
  date: string;
  text: string;
}

/** Détails propres à une conquête. Chaque élément est appuyé par les sources de la fiche. */
export interface RightDetails {
  category: RightCategory;
  country: string;
  /** La situation avant l'avancée. */
  before: string;
  /** Les principales étapes du combat, dans l'ordre. */
  steps: RightStep[];
  /** La loi, la réforme ou le changement obtenu. */
  outcome: string;
  /** Résistances et limites historiques. */
  limits: string[];
  /** Évolutions ultérieures. */
  later: RightLater[];
}

export interface RightLater {
  text: string;
  /** Fiches (personnes, organisations) dont la participation à cette évolution est documentée. */
  involves?: string[];
}

export interface LawDetails {
  /** Institution qui a adopté ou pris le texte. */
  institution: string;
  /** Référence officielle, si elle est connue. */
  reference?: string;
}

export interface CulturePeriod {
  /** Libellé affiché, ex. « vers 1532 – 1625 ». */
  label: string;
  /** Année servant au classement chronologique (naissance, adoption, date d'un événement). */
  sortYear: number;
  /** Année de fin : décès d'une personne. Sert à distinguer ce qui a été obtenu de son vivant. */
  endYear?: number;
}

/**
 * Paragraphe d'un article long (propre au web) : intertitre éventuel, texte, et les sources de
 * la fiche dont il tire ses faits.
 */
export interface ArticleParagraph {
  heading?: string;
  text: string;
  sourceIds: string[];
}

/** Article long d'une fiche, validé par la rédaction (voir src/content/redaction.json). */
export interface CultureArticle {
  paragraphs: ArticleParagraph[];
  /** Modèle qui a préparé le texte, affiché par transparence. */
  preparedWith: string;
  /** Date de validation par la rédaction. */
  acceptedAt: IsoDate;
}

export interface CultureEntity {
  /** Préfixé par le type : `person-…`, `work-…`, `movement-…`, `event-…`, `idea-…`. */
  id: string;
  kind: CultureKind;
  title: string;
  /**
   * Accroche : ce qu'elle a fait, en une phrase courte, pour présenter une femme par son
   * action plutôt que par un nom parfois inconnu. Tirée du résumé sourcé de la fiche.
   */
  hook?: string;
  /** Ligne courte sous le titre (« Peintre italienne », « Huile sur toile »…). */
  subtitle?: string;
  period?: CulturePeriod;
  /** Résumé factuel, appuyé sur les sources listées. */
  summary: string;
  /** Illustration : une œuvre du domaine public, créditée. */
  image?: Artwork;
  /** Pour une idée : la catégorie d'expériences correspondante. */
  categoryId?: CategoryId;
  domain?: CultureDomain;
  /** Pour une conquête (`right`). */
  right?: RightDetails;
  /** Pour un texte de loi (`law`). */
  law?: LawDetails;
  links: CultureLink[];
  sources: Source[];
  /** Article long (web uniquement), superposé par src/content/redaction.json. */
  article?: CultureArticle;
  editorialStatus: EditorialStatus;
  reviewedAt: IsoDate | null;
}

export interface SavedDiscovery {
  entityId: string;
  savedAt: string;
}

/** Les grandes thématiques qui regroupent les portraits (onglet « Elles »). */
export type PortraitThemeId =
  | 'revolutionne'
  | 'culture'
  | 'droits'
  | 'idees'
  | 'oubliees'
  | 'pionnieres'
  | 'quotidien'
  | 'histoire'
  | 'limites';

export interface PortraitThemeMember {
  /** Fiche `person`. */
  personId: string;
  /** Pourquoi elle figure ici, tiré du résumé sourcé de sa fiche. */
  reason: string;
}

export interface PortraitTheme {
  id: PortraitThemeId;
  /** « Elles ont révolutionné le monde ». */
  title: string;
  /** Domaines couverts : « Inventions, sciences, technologies et découvertes ». */
  subtitle: string;
  description: string;
  /** Une femme peut figurer dans plusieurs thématiques. */
  members: PortraitThemeMember[];
  /** Précaution éditoriale propre à la thématique. */
  caution?: string;
}
