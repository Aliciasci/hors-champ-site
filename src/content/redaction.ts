import type { CultureArticle } from '@/types';

import redaction from './redaction.json';

/**
 * Réécritures validées par la rédaction (outil `npm run redaction:*`), superposées aux fiches
 * venues de l'application mobile. Propre au web : rien n'est modifié dans src/data.
 */
export interface RedactionEntry {
  title?: string;
  hook?: string;
  summary?: string;
  article?: CultureArticle;
}

const entries = (redaction as { entities: Record<string, RedactionEntry> }).entities;

/**
 * Applique les réécritures aux fiches brutes, avant validation. Signale une réécriture orpheline
 * ou un paragraphe qui cite une source absente de la fiche : le build s'arrête.
 */
export function applyRedaction(items: readonly unknown[], problems: string[]): unknown[] {
  const known = new Set<string>();
  const result = items.map((item) => {
    const record = item as { id?: string; kind?: string; sources?: { id: string }[] };
    if (!record.id || !entries[record.id]) return item;
    known.add(record.id);
    const entry = entries[record.id]!;
    const at = `src/content/redaction.json — fiche « ${record.id} »`;
    if (entry.title && ['person', 'work', 'law', 'organization'].includes(record.kind ?? '')) {
      problems.push(
        `${at} : le titre d’une ${record.kind} est un nom propre, il ne se réécrit pas`,
      );
    }
    const sourceIds = new Set((record.sources ?? []).map((s) => s.id));
    entry.article?.paragraphs.forEach((paragraph, index) => {
      if (!paragraph.text.trim()) problems.push(`${at} : paragraphe ${index + 1} vide`);
      if (paragraph.sourceIds.length === 0)
        problems.push(`${at} : le paragraphe ${index + 1} ne cite aucune source`);
      for (const id of paragraph.sourceIds) {
        if (!sourceIds.has(id))
          problems.push(`${at} : paragraphe ${index + 1}, source inconnue « ${id} »`);
      }
    });
    return { ...record, ...entry };
  });
  for (const id of Object.keys(entries)) {
    if (!known.has(id)) problems.push(`src/content/redaction.json : fiche inconnue « ${id} »`);
  }
  return result;
}
