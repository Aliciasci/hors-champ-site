import { localCultureEntities } from '@/data/culture';
import { selectLibrarySection } from '@/features/bookmarks/librarySelectors';
import { prepareCultureEntities } from '@/features/culture/validateCulture';
import {
  countActiveFilters,
  EMPTY_FILTERS,
  filterExperiences,
  hasActiveFilters,
  matchesDuration,
  type ExperienceFilters,
} from '@/features/experiences/filterExperiences';
import {
  buildFeed,
  buildSideFeed,
  feedPages,
  FEED_PAGE_SIZE,
  pickFeaturedExperience,
  recentlyStarted,
} from '@/features/home/homeSelectors';
import {
  completeExperience,
  INITIAL_STATE,
  startExperience,
  submitAnswer,
  toggleBookmark,
} from '@/features/progress/progressLogic';
import { makeExperience } from './fixtures';

const experiences = [
  makeExperience({
    id: 'mail',
    title: 'Le même mail, deux lectures',
    categoryId: 'doubles-standards',
    estimatedMinutes: 4,
  }),
  makeExperience({
    id: 'pub',
    title: 'Une publicité',
    categoryId: 'medias-publicite',
    contentType: 'image-analysis',
    estimatedMinutes: 6,
    difficulty: 'intermediaire',
  }),
  makeExperience({
    id: 'histoire',
    title: 'Le test de Bechdel',
    categoryId: 'histoire-culture',
    contentType: 'historical-context',
    estimatedMinutes: 9,
  }),
];

describe('filterExperiences', () => {
  it('recherche sans tenir compte des accents ni de la casse', () => {
    expect(
      filterExperiences(experiences, { ...EMPTY_FILTERS, query: 'MEME' }).map((e) => e.id),
    ).toEqual(['mail']);
    expect(
      filterExperiences(experiences, { ...EMPTY_FILTERS, query: 'publicité' }).map((e) => e.id),
    ).toEqual(['pub']);
  });

  it('cherche aussi dans le nom de la catégorie', () => {
    const result = filterExperiences(
      experiences,
      { ...EMPTY_FILTERS, query: 'culture' },
      { 'histoire-culture': 'Histoire et culture' },
    );
    expect(result.map((e) => e.id)).toEqual(['histoire']);
  });

  it('combine les filtres : « ou » dans un groupe, « et » entre groupes', () => {
    const filters: ExperienceFilters = {
      ...EMPTY_FILTERS,
      categoryIds: ['doubles-standards', 'medias-publicite'],
      durations: ['medium'],
    };
    expect(filterExperiences(experiences, filters).map((e) => e.id)).toEqual(['pub']);
  });

  it('renvoie une liste vide quand rien ne correspond', () => {
    expect(filterExperiences(experiences, { ...EMPTY_FILTERS, query: 'zzz' })).toEqual([]);
    expect(hasActiveFilters({ ...EMPTY_FILTERS, query: '  ' })).toBe(false);
  });

  it('compte les filtres actifs, sans la recherche textuelle', () => {
    expect(countActiveFilters({ ...EMPTY_FILTERS, query: 'mail' })).toBe(0);
    expect(
      countActiveFilters({
        query: '',
        categoryIds: ['stereotypes', 'raisonnement'],
        contentTypes: ['scenario'],
        durations: ['short'],
      }),
    ).toBe(4);
  });

  it('classe les durées sans trou ni chevauchement', () => {
    for (let minutes = 1; minutes <= 20; minutes += 1) {
      const matches = (['short', 'medium', 'long'] as const).filter((f) =>
        matchesDuration(minutes, f),
      );
      expect(matches).toHaveLength(1);
    }
  });
});

describe('sélecteurs de l’accueil', () => {
  it('met en avant une expérience non commencée qui correspond aux préférences', () => {
    const preferences = {
      onboardingCompleted: true,
      favoriteCategoryIds: ['medias-publicite' as const],
      preferredDifficulty: null,
      themeId: 'cartel' as const,
      ageBand: null,
    };
    expect(pickFeaturedExperience(experiences, {}, preferences)?.id).toBe('pub');
    const started = startExperience(INITIAL_STATE, 'pub', 't');
    expect(pickFeaturedExperience(experiences, started.progress, preferences)?.id).toBe('mail');
  });

  it('renvoie null sans contenu', () => {
    expect(pickFeaturedExperience([], {}, INITIAL_STATE.preferences)).toBeNull();
  });

  it('trie les expériences récentes', () => {
    let state = startExperience(INITIAL_STATE, 'mail', '2026-01-01');
    state = startExperience(state, 'histoire', '2026-01-03');
    expect(recentlyStarted(experiences, state.progress).map((e) => e.id)).toEqual([
      'histoire',
      'mail',
    ]);
  });
});

describe('sections de la bibliothèque', () => {
  let state = toggleBookmark(INITIAL_STATE, 'pub', '2026-01-01');
  state = toggleBookmark(state, 'supprimee', '2026-01-02');
  state = startExperience(state, 'mail', '2026-01-01');
  state = startExperience(state, 'histoire', '2026-01-01');
  state = submitAnswer(state, 'histoire', ['a'], '2026-01-02');
  state = completeExperience(state, 'histoire', '2026-01-02');

  it('liste les favoris en ignorant les contenus disparus', () => {
    expect(
      selectLibrarySection('saved', experiences, state.bookmarks, state.progress).map((e) => e.id),
    ).toEqual(['pub']);
  });

  it('sépare en cours et terminées', () => {
    expect(
      selectLibrarySection('in-progress', experiences, state.bookmarks, state.progress).map(
        (e) => e.id,
      ),
    ).toEqual(['mail']);
    expect(
      selectLibrarySection('completed', experiences, state.bookmarks, state.progress).map(
        (e) => e.id,
      ),
    ).toEqual(['histoire']);
  });
});

describe('fil de l’accueil', () => {
  const culture = prepareCultureEntities(localCultureEntities, () => {});

  it('met la fiche choisie en tête et alterne les domaines dans « À la une »', () => {
    const feed = buildFeed(culture, 'all', 'person-rosa-bonheur');
    expect(feed[0]?.id).toBe('person-rosa-bonheur');
    const side = buildSideFeed(culture, 'all');
    // Chaque fiche est soit dans le fil, soit dans la colonne de côté, jamais les deux.
    expect(new Set([...feed, ...side].map((e) => e.id)).size).toBe(culture.length);
    expect(feed.length + side.length).toBe(culture.length);
    const domains = buildFeed(culture, 'all')
      .slice(0, 3)
      .map((e) => e.domain);
    expect(domains).toEqual(['sciences', 'arts', 'droits']);
  });

  it('ne garde que son domaine dans une rubrique, femmes d’abord', () => {
    const feed = buildFeed(culture, 'droits');
    expect(feed.every((e) => e.domain === 'droits')).toBe(true);
    expect(feed[0]?.kind).toBe('person');
  });

  it('sort les idées et les événements du fil, vers la colonne de côté', () => {
    for (const section of ['all', 'arts', 'sciences', 'droits'] as const) {
      expect(buildFeed(culture, section).some((e) => e.kind === 'event' || e.kind === 'idea')).toBe(
        false,
      );
      const side = buildSideFeed(culture, section);
      expect(side.every((e) => e.kind === 'event' || e.kind === 'idea')).toBe(true);
      if (section !== 'all') expect(side.every((e) => e.domain === section)).toBe(true);
    }
    expect(buildSideFeed(culture, 'all').length).toBeGreaterThan(0);
  });
});

describe('la Une du fil', () => {
  it('compose chaque page : article principal, trois articles, cinq brèves, quatre titres', () => {
    const ids = Array.from({ length: FEED_PAGE_SIZE + 4 }, (_, i) => i);
    const [first, second] = feedPages(ids);
    expect(first).toEqual({
      lead: 0,
      column: [1, 2, 3],
      briefs: [4, 5, 6, 7, 8],
      strip: [9, 10, 11, 12],
    });
    // La dernière page se remplit dans l'ordre.
    expect(second).toEqual({ lead: 13, column: [14, 15, 16], briefs: [], strip: [] });
  });
});
