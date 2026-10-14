import { STORAGE_KEY } from '@/constants/config';
import { INITIAL_STATE } from '@/features/progress/progressLogic';
import {
  migratePersistedState,
  sanitizePersistedState,
  STORAGE_SCHEMA_VERSION,
} from '@/services/persistenceSchema';
import { createStorageService, type KeyValueStorage } from '@/services/storageService';
import { createAppStore } from '@/store/useAppStore';

/** Stockage clé/valeur en mémoire, partagé entre deux « lancements » de l'application. */
function memoryBackend(
  initial: Record<string, string> = {},
): KeyValueStorage & { data: Record<string, string> } {
  const data = { ...initial };
  return {
    data,
    getItem: async (key) => data[key] ?? null,
    setItem: async (key, value) => {
      data[key] = value;
    },
    removeItem: async (key) => {
      delete data[key];
    },
  };
}

const flushAsync = () => new Promise((resolve) => setTimeout(resolve, 0));

async function launch(backend: KeyValueStorage) {
  const store = createAppStore(createStorageService(backend));
  await store.persist.rehydrate();
  return store;
}

describe('persistance du store', () => {
  it('conserve favoris, progression et préférences après redémarrage', async () => {
    const backend = memoryBackend();
    const first = await launch(backend);
    const actions = first.getState();
    actions.completeOnboarding({
      favoriteCategoryIds: ['stereotypes'],
      preferredDifficulty: 'approfondi',
    });
    actions.toggleBookmark('exp-1');
    actions.startExperience('exp-2');
    actions.goToStep('exp-2', 'question');
    actions.setSelection('exp-2', ['b']);

    const second = await launch(backend);
    const state = second.getState();
    expect(state.hasHydrated).toBe(true);
    expect(state.preferences).toEqual({
      onboardingCompleted: true,
      favoriteCategoryIds: ['stereotypes'],
      preferredDifficulty: 'approfondi',
      themeId: 'cartel',
      ageBand: null,
    });
    expect(state.bookmarks.map((b) => b.experienceId)).toEqual(['exp-1']);
    expect(state.progress['exp-2']).toMatchObject({
      currentStep: 'question',
      selectedOptionIds: ['b'],
    });
  });

  it('conserve l’état courant quand le stockage est vide', async () => {
    const store = createAppStore(createStorageService(memoryBackend()));
    store.getState().toggleBookmark('avant-hydratation');
    await store.persist.rehydrate();
    expect(store.getState().bookmarks.map((b) => b.experienceId)).toEqual(['avant-hydratation']);
  });

  it('écrit une version de schéma et n’enregistre pas l’état technique', async () => {
    const backend = memoryBackend();
    const store = await launch(backend);
    store.getState().toggleBookmark('exp-1');
    const saved = JSON.parse(backend.data[STORAGE_KEY] ?? '{}');
    expect(saved.version).toBe(STORAGE_SCHEMA_VERSION);
    expect(saved.state.hasHydrated).toBeUndefined();
  });

  it('démarre avec l’état initial si les données sont illisibles', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const store = await launch(memoryBackend({ [STORAGE_KEY]: '{pas du json' }));
    expect(store.getState().hasHydrated).toBe(true);
    expect(store.getState().bookmarks).toEqual([]);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('restauration impossible'),
      expect.anything(),
    );
    warn.mockRestore();
  });

  it('survit à une panne du stockage', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const broken: KeyValueStorage = {
      getItem: () => Promise.reject(new Error('disque plein')),
      setItem: () => Promise.reject(new Error('disque plein')),
      removeItem: () => Promise.reject(new Error('disque plein')),
    };
    const store = await launch(broken);
    expect(() => store.getState().toggleBookmark('exp-1')).not.toThrow();
    expect(store.getState().bookmarks).toHaveLength(1);
    await flushAsync();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('l’effacement des données vide tout sauf l’onboarding', async () => {
    const backend = memoryBackend();
    const store = await launch(backend);
    const s = store.getState();
    s.completeOnboarding({ favoriteCategoryIds: ['stereotypes'], preferredDifficulty: null });
    s.toggleBookmark('exp-1');
    s.startExperience('exp-1');
    s.recordView('exp-1');
    s.resetAllData();

    const relaunched = await launch(backend);
    const state = relaunched.getState();
    expect(state.bookmarks).toEqual([]);
    expect(state.progress).toEqual({});
    expect(state.recentlyViewedIds).toEqual([]);
    expect(state.preferences).toEqual({ ...INITIAL_STATE.preferences, onboardingCompleted: true });
  });
});

describe('sanitizePersistedState', () => {
  it('renvoie l’état initial pour une valeur non exploitable', () => {
    expect(sanitizePersistedState(null)).toEqual(INITIAL_STATE);
    expect(sanitizePersistedState('texte')).toEqual(INITIAL_STATE);
  });

  it('écarte les champs invalides sans perdre les valeurs valides', () => {
    const result = sanitizePersistedState({
      preferences: {
        onboardingCompleted: 'oui',
        favoriteCategoryIds: ['stereotypes', 'inventee'],
        preferredDifficulty: 'extreme',
      },
      bookmarks: [
        { experienceId: 'a', savedAt: 'x' },
        { experienceId: 'a', savedAt: 'y' },
        { nope: true },
        'b',
      ],
      progress: {
        ok: {
          status: 'in-progress',
          currentStep: 'feedback',
          startedAt: 't',
          updatedAt: 't',
          submittedOptionIds: null,
        },
        cassee: { status: 'peut-etre' },
      },
      recentlyViewedIds: ['a', 'a', 'b', 3],
    });
    expect(result.preferences).toEqual({
      onboardingCompleted: false,
      favoriteCategoryIds: ['stereotypes'],
      preferredDifficulty: null,
      themeId: 'cartel',
      ageBand: null,
    });
    expect(result.bookmarks).toEqual([{ experienceId: 'a', savedAt: 'x' }]);
    expect(Object.keys(result.progress)).toEqual(['ok']);
    // Un retour sans réponse validée est ramené à la question.
    expect(result.progress.ok?.currentStep).toBe('question');
    expect(result.recentlyViewedIds).toEqual([]);
  });
});

describe('thème', () => {
  it('le choix de thème est persisté et survit à l’effacement des données', async () => {
    const backend = memoryBackend();
    const store = await launch(backend);
    store.getState().setTheme('revue');
    store.getState().resetAllData();
    const relaunched = await launch(backend);
    expect(relaunched.getState().preferences.themeId).toBe('revue');
  });

  it('un thème inconnu revient au thème par défaut', () => {
    expect(sanitizePersistedState({ preferences: { themeId: 'neon' } }).preferences.themeId).toBe(
      'cartel',
    );
  });
});

describe('migratePersistedState', () => {
  it('v2 → v3 : ajoute découvertes et explorations vides', () => {
    const v2 = {
      preferences: {
        onboardingCompleted: true,
        favoriteCategoryIds: [],
        preferredDifficulty: null,
        themeId: 'revue',
      },
      bookmarks: [],
      progress: {},
      recentlyViewedIds: [],
    };
    const migrated = migratePersistedState(v2, 2);
    expect(migrated.savedDiscoveries).toEqual([]);
    expect(migrated.exploredEntityIds).toEqual([]);
    expect(migrated.preferences.themeId).toBe('revue');
  });

  it('les découvertes enregistrées survivent au redémarrage', async () => {
    const backend = memoryBackend();
    const store = await launch(backend);
    store.getState().toggleDiscovery('person-rosa-bonheur');
    store.getState().recordExploration('work-le-marche-aux-chevaux');
    const relaunched = await launch(backend);
    expect(relaunched.getState().savedDiscoveries.map((d) => d.entityId)).toEqual([
      'person-rosa-bonheur',
    ]);
    expect(relaunched.getState().exploredEntityIds).toEqual(['work-le-marche-aux-chevaux']);
  });

  it('nettoie des découvertes corrompues', () => {
    const result = sanitizePersistedState({
      savedDiscoveries: [{ entityId: 'a', savedAt: 't' }, { entityId: 'a' }, { nope: 1 }],
      exploredEntityIds: ['a', 'a', 4],
    });
    expect(result.savedDiscoveries).toEqual([{ entityId: 'a', savedAt: 't' }]);
    expect(result.exploredEntityIds).toEqual([]);
  });

  it('v1 → v2 : ajoute le thème Cartel sans toucher au reste', () => {
    const v1 = {
      preferences: {
        onboardingCompleted: true,
        favoriteCategoryIds: ['stereotypes'],
        preferredDifficulty: null,
      },
      bookmarks: [{ experienceId: 'a', savedAt: 't' }],
      progress: {},
      recentlyViewedIds: ['a'],
    };
    const migrated = migratePersistedState(v1, 1);
    expect(migrated.preferences).toEqual({
      onboardingCompleted: true,
      favoriteCategoryIds: ['stereotypes'],
      preferredDifficulty: null,
      themeId: 'cartel',
      ageBand: null,
    });
    expect(migrated.bookmarks).toHaveLength(1);
  });

  it('une sauvegarde v1 réelle est migrée au chargement', async () => {
    const legacy = JSON.stringify({
      version: 1,
      state: {
        preferences: {
          onboardingCompleted: true,
          favoriteCategoryIds: [],
          preferredDifficulty: null,
        },
        bookmarks: [],
        progress: {},
        recentlyViewedIds: [],
      },
    });
    const backend = memoryBackend({ [STORAGE_KEY]: legacy });
    const store = await launch(backend);
    expect(store.getState().preferences).toMatchObject({
      onboardingCompleted: true,
      themeId: 'cartel',
    });
    await flushAsync();
    expect(JSON.parse(backend.data[STORAGE_KEY] ?? '{}').version).toBe(STORAGE_SCHEMA_VERSION);
  });

  it('v3 → v4 : ajoute un niveau de lecture vide, puis le conserve une fois choisi', async () => {
    const v3 = {
      preferences: { onboardingCompleted: true, themeId: 'revue' },
      savedDiscoveries: [],
    };
    const migrated = migratePersistedState(v3, 3);
    expect(migrated.preferences.ageBand).toBeNull();
    expect(migrated.preferences.themeId).toBe('revue');
    expect(
      sanitizePersistedState({ preferences: { ageBand: '15-18' } }).preferences.ageBand,
    ).toBeNull();

    const backend = memoryBackend();
    const store = await launch(backend);
    store.getState().setAgeBand('6-10');
    await flushAsync();
    const relaunched = await launch(backend);
    expect(relaunched.getState().preferences.ageBand).toBe('6-10');
  });

  it('applique les migrations dans l’ordre jusqu’à la version cible', () => {
    const calls: number[] = [];
    const migrations = {
      0: (s: Record<string, unknown>) => {
        calls.push(0);
        return {
          ...s,
          bookmarks: (s.favoris as string[]).map((id) => ({ experienceId: id, savedAt: 't' })),
        };
      },
      1: (s: Record<string, unknown>) => {
        calls.push(1);
        return s;
      },
    };
    const result = migratePersistedState({ favoris: ['a', 'b'] }, 0, migrations, 2);
    expect(calls).toEqual([0, 1]);
    expect(result.bookmarks.map((b) => b.experienceId)).toEqual(['a', 'b']);
  });

  it('nettoie aussi les données sans migration à appliquer', () => {
    expect(
      migratePersistedState({ bookmarks: 'corrompu' }, STORAGE_SCHEMA_VERSION).bookmarks,
    ).toEqual([]);
  });
});
