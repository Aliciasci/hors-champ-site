import type { CultureEntity, CultureLink, Source } from '@/types';

/**
 * Passage entre une fiche telle que le backoffice la stocke et le modèle du site (`CultureEntity`).
 * Le backoffice range certains champs autrement (listes d'objets, groupes toujours présents,
 * relations), mais ne perd rien : `entityToFiche(ficheToEntity(x))` redonne la même fiche.
 */

type Maybe<T> = T | null | undefined;
type Ref = string | { id: string };

export interface FicheSource {
  sourceId: string;
  title: string;
  publisher: string;
  url: string;
  sourceType: Source['sourceType'];
  publishedAt?: Maybe<string>;
  accessedAt: string;
  relevantExcerpt?: Maybe<string>;
  note?: Maybe<string>;
}

export interface FicheDoc {
  id: string;
  kind: CultureEntity['kind'];
  domain?: Maybe<CultureEntity['domain']>;
  title: string;
  hook?: Maybe<string>;
  subtitle?: Maybe<string>;
  period?: Maybe<{ label?: Maybe<string>; sortYear?: Maybe<number>; endYear?: Maybe<number> }>;
  summary: string;
  image?: Maybe<number | string | { id: number | string }>;
  categoryId?: Maybe<CultureEntity['categoryId']>;
  right?: Maybe<{
    category?: Maybe<string>;
    country?: Maybe<string>;
    before?: Maybe<string>;
    steps?: Maybe<{ date: string; text: string }[]>;
    outcome?: Maybe<string>;
    limits?: Maybe<{ text: string }[]>;
    later?: Maybe<{ text: string; involves?: Maybe<Ref[]> }[]>;
  }>;
  law?: Maybe<{ institution?: Maybe<string>; reference?: Maybe<string> }>;
  links?: Maybe<
    {
      target: Ref;
      relation: CultureLink['relation'];
      contribution?: Maybe<CultureLink['contribution']>;
      detail?: Maybe<string>;
      sourceId?: Maybe<string>;
      year?: Maybe<number>;
    }[]
  >;
  sources?: Maybe<FicheSource[]>;
  article?: Maybe<{
    paragraphs?: Maybe<{ heading?: Maybe<string>; text: string; sourceIds?: Maybe<string[]> }[]>;
    preparedWith?: Maybe<string>;
    acceptedAt?: Maybe<string>;
  }>;
  editorialStatus: CultureEntity['editorialStatus'];
  reviewedAt?: Maybe<string>;
  person?: Maybe<{
    wikidata?: Maybe<string>;
    countries?: Maybe<string[]>;
    historical?: Maybe<string>;
    born?: Maybe<string>;
    died?: Maybe<string>;
  }>;
}

const refId = (ref: Ref) => (typeof ref === 'string' ? ref : ref.id);
const opt = <T>(value: Maybe<T>): T | undefined =>
  value === null || value === undefined || value === '' ? undefined : value;

/** Fiche du backoffice → modèle du site (sans l'image, résolue à part). */
export function ficheToEntity(doc: FicheDoc): Omit<CultureEntity, 'image'> {
  const entity: Omit<CultureEntity, 'image'> = {
    id: doc.id,
    kind: doc.kind,
    title: doc.title,
    summary: doc.summary,
    links: (doc.links ?? []).map((link) => {
      const out: CultureLink = { targetId: refId(link.target), relation: link.relation };
      if (opt(link.contribution)) out.contribution = link.contribution!;
      if (opt(link.detail)) out.detail = link.detail!;
      if (opt(link.sourceId)) out.sourceId = link.sourceId!;
      if (opt(link.year)) out.year = link.year!;
      return out;
    }),
    sources: (doc.sources ?? []).map((s) => {
      const src = {
        id: s.sourceId,
        title: s.title,
        publisher: s.publisher,
        url: s.url,
        sourceType: s.sourceType,
        accessedAt: s.accessedAt,
      } as Source;
      if (opt(s.publishedAt)) src.publishedAt = s.publishedAt!;
      if (opt(s.relevantExcerpt)) src.relevantExcerpt = s.relevantExcerpt!;
      if (opt(s.note)) src.note = s.note!;
      return src;
    }),
    editorialStatus: doc.editorialStatus,
    reviewedAt: opt(doc.reviewedAt) ?? null,
  };
  if (opt(doc.domain)) entity.domain = doc.domain!;
  if (opt(doc.hook)) entity.hook = doc.hook!;
  if (opt(doc.subtitle)) entity.subtitle = doc.subtitle!;
  if (opt(doc.categoryId)) entity.categoryId = doc.categoryId!;
  if (opt(doc.period?.label) && typeof doc.period?.sortYear === 'number') {
    entity.period = { label: doc.period.label!, sortYear: doc.period.sortYear };
    if (typeof doc.period.endYear === 'number') entity.period.endYear = doc.period.endYear;
  }
  if (doc.kind === 'right' && doc.right) {
    entity.right = {
      category: doc.right.category as NonNullable<CultureEntity['right']>['category'],
      country: doc.right.country ?? '',
      before: doc.right.before ?? '',
      steps: (doc.right.steps ?? []).map(({ date, text }) => ({ date, text })),
      outcome: doc.right.outcome ?? '',
      limits: (doc.right.limits ?? []).map((l) => l.text),
      later: (doc.right.later ?? []).map((l) => {
        const involves = (l.involves ?? []).map(refId);
        return involves.length ? { text: l.text, involves } : { text: l.text };
      }),
    };
  }
  if (doc.kind === 'law' && opt(doc.law?.institution)) {
    entity.law = { institution: doc.law!.institution! };
    if (opt(doc.law?.reference)) entity.law.reference = doc.law!.reference!;
  }
  if (
    doc.article?.paragraphs?.length &&
    opt(doc.article.preparedWith) &&
    opt(doc.article.acceptedAt)
  ) {
    entity.article = {
      paragraphs: doc.article.paragraphs.map((p) => ({
        ...(opt(p.heading) ? { heading: p.heading! } : {}),
        text: p.text,
        sourceIds: p.sourceIds ?? [],
      })),
      preparedWith: doc.article.preparedWith!,
      acceptedAt: doc.article.acceptedAt!,
    };
  }
  return entity;
}

/** Données propres aux femmes (carte, « Ce jour-là »), rangées avec leur fiche dans le backoffice. */
export interface PersonExtras {
  wikidata?: string;
  countries?: string[];
  historical?: string;
  born?: string;
  died?: string;
}

/** Modèle du site → fiche du backoffice (pour l'import ; l'image est passée par son identifiant). */
export function entityToFiche(
  entity: CultureEntity,
  extras: { image?: number | string; person?: PersonExtras } = {},
): FicheDoc {
  return {
    id: entity.id,
    kind: entity.kind,
    domain: entity.domain ?? null,
    title: entity.title,
    hook: entity.hook ?? null,
    subtitle: entity.subtitle ?? null,
    period: entity.period
      ? {
          label: entity.period.label,
          sortYear: entity.period.sortYear,
          endYear: entity.period.endYear ?? null,
        }
      : {},
    summary: entity.summary,
    image: extras.image ?? null,
    categoryId: entity.categoryId ?? null,
    right: entity.right
      ? {
          ...entity.right,
          limits: entity.right.limits.map((text) => ({ text })),
          later: entity.right.later.map((l) => ({ text: l.text, involves: l.involves ?? [] })),
        }
      : {},
    law: entity.law
      ? { institution: entity.law.institution, reference: entity.law.reference ?? null }
      : {},
    links: entity.links.map((l) => ({
      target: l.targetId,
      relation: l.relation,
      contribution: l.contribution ?? null,
      detail: l.detail ?? null,
      sourceId: l.sourceId ?? null,
      year: l.year ?? null,
    })),
    sources: entity.sources.map((s) => ({
      sourceId: s.id,
      title: s.title,
      publisher: s.publisher,
      url: s.url,
      sourceType: s.sourceType,
      publishedAt: s.publishedAt ?? null,
      accessedAt: s.accessedAt,
      relevantExcerpt: s.relevantExcerpt ?? null,
      note: s.note ?? null,
    })),
    article: entity.article
      ? {
          paragraphs: entity.article.paragraphs.map((p) => ({
            heading: p.heading ?? null,
            text: p.text,
            sourceIds: p.sourceIds,
          })),
          preparedWith: entity.article.preparedWith,
          acceptedAt: entity.article.acceptedAt,
        }
      : {},
    editorialStatus: entity.editorialStatus,
    reviewedAt: entity.reviewedAt,
    // Les groupes du backoffice sont toujours des objets, éventuellement vides (jamais `null`).
    person: extras.person ?? {},
  };
}
