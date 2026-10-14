import type { Source } from '@/types';

/** Date de consultation de l'ensemble des sources de ce dossier. */
const ACCESSED = '2026-10-12';

/**
 * Article de Wikipédia en français. `excerpt` est une citation exacte de l'article,
 * qui appuie le résumé de la fiche ; `key` distingue plusieurs citations d'un même article.
 */
export function wikipedia(article: string, path: string, excerpt: string, key = 'intro'): Source {
  return {
    id: `wikipedia-${path.toLowerCase()}-${key}`,
    title: article,
    publisher: 'Wikipédia',
    url: `https://fr.wikipedia.org/wiki/${path}`,
    sourceType: 'encyclopedia',
    accessedAt: ACCESSED,
    relevantExcerpt: excerpt,
    note: 'Article collaboratif : à compléter par les sources primaires qu’il cite.',
  };
}

/** Notice Wikidata : données structurées (dates, lieux, mouvement). */
export function wikidata(qid: string, label: string, note: string): Source {
  return {
    id: `wikidata-${qid.toLowerCase()}`,
    title: `${label} (${qid})`,
    publisher: 'Wikidata',
    url: `https://www.wikidata.org/wiki/${qid}`,
    sourceType: 'encyclopedia',
    accessedAt: ACCESSED,
    note,
  };
}

/** Fiche Wikimedia Commons d'une œuvre : titre, date, institution et licence de l'image. */
export function commons(url: string, title: string): Source {
  return {
    id: `commons-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    title,
    publisher: 'Wikimedia Commons',
    url,
    sourceType: 'archive',
    accessedAt: ACCESSED,
    note: 'Fiche de l’œuvre : date, institution de conservation et licence de la reproduction.',
  };
}
