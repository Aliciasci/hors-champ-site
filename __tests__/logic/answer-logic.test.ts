import {
  canSubmit,
  evaluateAnswer,
  sanitizeSelection,
  toggleOption,
} from '@/features/experiences/answerLogic';
import { makeExperience, makeOption } from './fixtures';

describe('toggleOption', () => {
  it('remplace la sélection en mode single et permet de désélectionner', () => {
    expect(toggleOption('single', [], 'a')).toEqual(['a']);
    expect(toggleOption('single', ['a'], 'b')).toEqual(['b']);
    expect(toggleOption('single', ['a'], 'a')).toEqual([]);
  });

  it('ajoute et retire en mode multiple', () => {
    expect(toggleOption('multiple', ['a'], 'b')).toEqual(['a', 'b']);
    expect(toggleOption('multiple', ['a', 'b'], 'a')).toEqual(['b']);
  });
});

describe('sanitizeSelection / canSubmit', () => {
  const single = makeExperience();
  const multiple = makeExperience({}, 'multiple');

  it('ignore les identifiants inconnus et les doublons', () => {
    expect(sanitizeSelection(multiple, ['a', 'zzz', 'a', 'c'])).toEqual(['a', 'c']);
  });

  it('ne garde qu’une réponse en mode single', () => {
    expect(sanitizeSelection(single, ['b', 'a'])).toEqual(['b']);
  });

  it('exige une réponse valide', () => {
    expect(canSubmit(single, [])).toBe(false);
    expect(canSubmit(single, ['inconnue'])).toBe(false);
    expect(canSubmit(single, ['a'])).toBe(true);
    expect(canSubmit(multiple, ['a', 'b'])).toBe(true);
  });
});

describe('evaluateAnswer — mode single', () => {
  const experience = makeExperience();
  it.each([
    ['a', 'grounded'],
    ['b', 'incomplete'],
    ['c', 'perspective'],
    ['d', 'revisit'],
  ])('option %s → %s', (option, outcome) => {
    expect(evaluateAnswer(experience, [option]).outcome).toBe(outcome);
  });

  it('refuse une réponse vide ou inconnue', () => {
    expect(() => evaluateAnswer(experience, [])).toThrow();
    expect(() => evaluateAnswer(experience, ['inconnue'])).toThrow();
  });
});

describe('evaluateAnswer — mode multiple', () => {
  const experience = makeExperience(
    {
      answerOptions: [
        makeOption('s1', 'solid'),
        makeOption('s2', 'solid'),
        makeOption('o', 'open'),
        makeOption('w', 'weak'),
      ],
    },
    'multiple',
  );

  it('tous les éléments solides repérés → grounded', () => {
    const result = evaluateAnswer(experience, ['s2', 's1', 'o']);
    expect(result.outcome).toBe('grounded');
    expect(result.missed).toEqual([]);
    // L'ordre suit celui de l'expérience, pas celui de la sélection.
    expect(result.selected.map((o) => o.id)).toEqual(['s1', 's2', 'o']);
  });

  it('une partie des éléments solides → incomplete, avec les manques', () => {
    const result = evaluateAnswer(experience, ['s1']);
    expect(result.outcome).toBe('incomplete');
    expect(result.missed.map((o) => o.id)).toEqual(['s2']);
  });

  it('seulement des lectures ouvertes → perspective', () => {
    expect(evaluateAnswer(experience, ['o']).outcome).toBe('perspective');
  });

  it('un raisonnement fragile sélectionné → revisit, même avec des éléments solides', () => {
    expect(evaluateAnswer(experience, ['s1', 's2', 'w']).outcome).toBe('revisit');
  });
});
