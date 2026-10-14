import { buildExport, parseImport } from '@/features/profile/dataTransfer';
import { INITIAL_STATE } from '@/features/progress/progressLogic';
import { STORAGE_SCHEMA_VERSION } from '@/services/persistenceSchema';

describe('export / import des données locales', () => {
  it('un export se réimporte à l’identique', () => {
    const state = {
      ...INITIAL_STATE,
      preferences: {
        ...INITIAL_STATE.preferences,
        onboardingCompleted: true,
        themeId: 'revue' as const,
      },
      savedDiscoveries: [{ entityId: 'person-ada-lovelace', savedAt: '2026-10-14T10:00:00.000Z' }],
    };
    const file = buildExport(state);
    expect(file.version).toBe(STORAGE_SCHEMA_VERSION);
    const result = parseImport(JSON.stringify(file));
    expect(result).toEqual({ ok: true, state });
  });

  it('accepte un export mobile ancien (v1) et le migre', () => {
    const mobile = {
      version: 1,
      state: {
        preferences: { onboardingCompleted: true, favoriteCategoryIds: ['stereotypes'] },
        bookmarks: [{ experienceId: 'rayon-jouets', savedAt: 't' }],
        progress: {},
        recentlyViewedIds: [],
      },
    };
    const result = parseImport(JSON.stringify(mobile));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.state.preferences).toMatchObject({ themeId: 'cartel', ageBand: null });
    expect(result.state.bookmarks).toHaveLength(1);
    expect(result.state.savedDiscoveries).toEqual([]);
  });

  it('accepte un état seul, sans enveloppe', () => {
    const result = parseImport(JSON.stringify({ exploredEntityIds: ['a', 'a', 'b'] }));
    expect(result.ok && result.state.exploredEntityIds).toEqual(['a', 'b']);
  });

  it('nettoie les champs corrompus au lieu de les propager', () => {
    const result = parseImport(
      JSON.stringify({ version: 4, state: { bookmarks: 'x', progress: [1] } }),
    );
    expect(result.ok && result.state.bookmarks).toEqual([]);
  });

  it.each([
    ['du texte', 'pas du json'],
    ['un tableau', '[]'],
    ['un objet étranger', '{"nom":"autre"}'],
    ['une version future', JSON.stringify({ version: 99, state: { bookmarks: [] } })],
    ['une version illisible', JSON.stringify({ version: 'v4', state: { bookmarks: [] } })],
  ])('refuse %s', (_label, text) => {
    const result = parseImport(text);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.length).toBeGreaterThan(10);
  });
});
