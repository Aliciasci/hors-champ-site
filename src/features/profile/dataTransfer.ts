import { migratePersistedState, STORAGE_SCHEMA_VERSION } from '@/services/persistenceSchema';
import type { PersistedState } from '@/types';
import { isRecord } from '@/utils/guards';

/**
 * Export et import des données locales (changer de navigateur, reprendre un export mobile).
 * Le format est celui du stockage : `{ version, state }`.
 */

export interface ExportFile {
  app: 'hors-champ';
  exportedAt: string;
  version: number;
  state: PersistedState;
}

export function buildExport(state: PersistedState, now = new Date()): ExportFile {
  return {
    app: 'hors-champ',
    exportedAt: now.toISOString(),
    version: STORAGE_SCHEMA_VERSION,
    state,
  };
}

export function exportFileName(now = new Date()): string {
  return `hors-champ-donnees-${now.toISOString().slice(0, 10)}.json`;
}

export type ImportResult = { ok: true; state: PersistedState } | { ok: false; error: string };

const KNOWN_KEYS = [
  'preferences',
  'bookmarks',
  'progress',
  'recentlyViewedIds',
  'savedDiscoveries',
  'exploredEntityIds',
];

/**
 * Lit un fichier exporté (site ou application mobile : `{ version, state }`, ou l'état seul),
 * applique les migrations du schéma et nettoie chaque champ. Refuse ce qui n'en est pas un.
 */
export function parseImport(text: string): ImportResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: 'Ce fichier n’est pas un fichier JSON lisible.' };
  }
  if (!isRecord(raw))
    return { ok: false, error: 'Ce fichier ne contient pas de données Hors-Champ.' };

  const wrapped = isRecord(raw.state);
  const state = wrapped ? (raw.state as Record<string, unknown>) : raw;
  const version = wrapped ? raw.version : STORAGE_SCHEMA_VERSION;

  if (!KNOWN_KEYS.some((key) => key in state)) {
    return { ok: false, error: 'Ce fichier ne contient pas de données Hors-Champ.' };
  }
  if (typeof version !== 'number' || !Number.isInteger(version) || version < 0) {
    return { ok: false, error: 'La version des données est illisible.' };
  }
  if (version > STORAGE_SCHEMA_VERSION) {
    return {
      ok: false,
      error:
        'Ces données viennent d’une version plus récente de Hors-Champ et ne peuvent pas être lues ici.',
    };
  }
  return { ok: true, state: migratePersistedState(state, version) };
}
