import { RECENTLY_VIEWED_LIMIT } from '@/constants/config';
import {
  answerForResult,
  completeExperience,
  computeProgressSummary,
  findLastInProgress,
  goToStep,
  hasCompleted,
  INITIAL_STATE,
  isBookmarked,
  recordView,
  restartExperience,
  setSelection,
  startExperience,
  submitAnswer,
  toggleBookmark,
} from '@/features/progress/progressLogic';
import { categories } from '@/data/categories';
import { makeExperience } from './fixtures';

const T0 = '2026-01-01T10:00:00.000Z';
const T1 = '2026-01-01T10:05:00.000Z';
const T2 = '2026-01-01T10:10:00.000Z';

describe('cycle de vie d’une expérience', () => {
  it('démarre à l’étape scénario, sans réponse', () => {
    const state = startExperience(INITIAL_STATE, 'x', T0);
    expect(state.progress.x).toMatchObject({
      status: 'in-progress',
      currentStep: 'scenario',
      selectedOptionIds: [],
      submittedOptionIds: null,
      completedCount: 0,
    });
  });

  it('ne réinitialise pas une tentative déjà en cours', () => {
    let state = startExperience(INITIAL_STATE, 'x', T0);
    state = goToStep(state, 'x', 'question', T1);
    expect(startExperience(state, 'x', T2)).toBe(state);
  });

  it('interdit d’atteindre le retour sans réponse validée', () => {
    let state = startExperience(INITIAL_STATE, 'x', T0);
    state = goToStep(state, 'x', 'feedback', T1);
    expect(state.progress.x?.currentStep).toBe('scenario');
  });

  it('enregistre la sélection, puis la fige après validation', () => {
    let state = startExperience(INITIAL_STATE, 'x', T0);
    state = setSelection(state, 'x', ['a'], T1);
    expect(state.progress.x?.selectedOptionIds).toEqual(['a']);
    state = submitAnswer(state, 'x', ['a'], T1);
    expect(state.progress.x).toMatchObject({ submittedOptionIds: ['a'], currentStep: 'feedback' });
    state = setSelection(state, 'x', ['b'], T2);
    expect(state.progress.x?.selectedOptionIds).toEqual(['a']);
  });

  it('ignore une validation vide', () => {
    const state = startExperience(INITIAL_STATE, 'x', T0);
    expect(submitAnswer(state, 'x', [], T1)).toBe(state);
  });

  it('termine une seule fois par tentative et conserve la réponse', () => {
    let state = startExperience(INITIAL_STATE, 'x', T0);
    state = completeExperience(state, 'x', T1);
    expect(hasCompleted(state.progress.x)).toBe(false); // pas de réponse : pas de complétion
    state = submitAnswer(state, 'x', ['a'], T1);
    state = completeExperience(state, 'x', T1);
    state = completeExperience(state, 'x', T2);
    expect(state.progress.x).toMatchObject({
      status: 'completed',
      completedCount: 1,
      firstCompletedAt: T1,
      lastCompletedOptionIds: ['a'],
    });
  });

  it('recommencer repart de zéro sans perdre l’historique ni l’analyse précédente', () => {
    let state = startExperience(INITIAL_STATE, 'x', T0);
    state = submitAnswer(state, 'x', ['a'], T0);
    state = completeExperience(state, 'x', T1);
    state = restartExperience(state, 'x', T2);
    const entry = state.progress.x;
    expect(entry).toMatchObject({
      status: 'in-progress',
      currentStep: 'scenario',
      submittedOptionIds: null,
      completedCount: 1,
      firstCompletedAt: T1,
    });
    expect(hasCompleted(entry)).toBe(true);
    expect(answerForResult(entry)).toEqual(['a']);
  });

  it('les transitions sur une expérience non démarrée sont sans effet', () => {
    expect(goToStep(INITIAL_STATE, 'inconnue', 'question', T0)).toBe(INITIAL_STATE);
    expect(completeExperience(INITIAL_STATE, 'inconnue', T0)).toBe(INITIAL_STATE);
  });
});

describe('favoris', () => {
  it('ajoute puis retire', () => {
    let state = toggleBookmark(INITIAL_STATE, 'x', T0);
    expect(isBookmarked(state.bookmarks, 'x')).toBe(true);
    expect(state.bookmarks[0]).toEqual({ experienceId: 'x', savedAt: T0 });
    state = toggleBookmark(state, 'x', T1);
    expect(isBookmarked(state.bookmarks, 'x')).toBe(false);
  });

  it('place le plus récent en premier', () => {
    let state = toggleBookmark(INITIAL_STATE, 'x', T0);
    state = toggleBookmark(state, 'y', T1);
    expect(state.bookmarks.map((b) => b.experienceId)).toEqual(['y', 'x']);
  });
});

describe('historique de consultation', () => {
  it('déduplique et limite la taille', () => {
    let state = INITIAL_STATE;
    for (let i = 0; i < RECENTLY_VIEWED_LIMIT + 5; i += 1) state = recordView(state, `e${i}`);
    state = recordView(state, 'e3');
    expect(state.recentlyViewedIds).toHaveLength(RECENTLY_VIEWED_LIMIT);
    expect(state.recentlyViewedIds[0]).toBe('e3');
    expect(new Set(state.recentlyViewedIds).size).toBe(RECENTLY_VIEWED_LIMIT);
  });
});

describe('résumé de progression', () => {
  const experiences = [
    makeExperience({ id: 'a', categoryId: 'doubles-standards' }),
    makeExperience({ id: 'b', categoryId: 'doubles-standards' }),
    makeExperience({ id: 'c', categoryId: 'stereotypes' }),
  ];

  it('compte l’exploration, sans aucun score', () => {
    let state = startExperience(INITIAL_STATE, 'a', T0);
    state = submitAnswer(state, 'a', ['a'], T0);
    state = completeExperience(state, 'a', T1);
    state = startExperience(state, 'c', T2);
    state = startExperience(state, 'supprimee', T2); // expérience retirée du catalogue

    const summary = computeProgressSummary(state.progress, experiences, categories);
    expect(summary).toMatchObject({
      startedCount: 2,
      inProgressCount: 1,
      completedCount: 1,
      totalCount: 3,
    });
    expect(summary.exploredCategoryIds).toEqual(['doubles-standards', 'stereotypes']);
    expect(summary.coverage.find((c) => c.categoryId === 'doubles-standards')).toMatchObject({
      completed: 1,
      total: 2,
    });
    expect(Object.keys(summary)).not.toContain('score');
  });

  it('trouve la dernière expérience en cours parmi celles qui existent', () => {
    let state = startExperience(INITIAL_STATE, 'a', T0);
    state = startExperience(state, 'supprimee', T2);
    expect(findLastInProgress(state.progress, new Set(['a']))?.experienceId).toBe('a');
    expect(findLastInProgress(INITIAL_STATE.progress, new Set(['a']))).toBeNull();
  });
});
