import { readingLabel, readingMinutes } from '@/lib/readingTime';
import type { CultureEntity } from '@/types';

/** Données de test uniquement, sans valeur éditoriale. */
function entity(overrides: Partial<CultureEntity> = {}): CultureEntity {
  return {
    id: 'person-test',
    kind: 'person',
    title: 'Personne de test',
    summary: 'Un résumé court.',
    links: [],
    sources: [],
    editorialStatus: 'draft',
    reviewedAt: null,
    ...overrides,
  };
}

const words = (count: number) => Array.from({ length: count }, () => 'mot').join(' ');

describe('readingMinutes', () => {
  it('compte au moins une minute pour un texte court', () => {
    expect(readingMinutes(entity(), [])).toBe(1);
  });

  it('compte environ 200 mots par minute', () => {
    expect(readingMinutes(entity({ summary: words(600) }), [])).toBe(3);
  });

  it('ignore la ponctuation isolée', () => {
    expect(readingMinutes(entity({ summary: `${words(390)} — : ; « »` }), [])).toBe(2);
  });

  it('inclut les contributions décrites sur une conquête depuis d’autres fiches', () => {
    const right = entity({ id: 'right-test', kind: 'right', summary: words(100) });
    const contributor = entity({
      links: [{ targetId: 'right-test', relation: 'contributed', detail: words(300) }],
    });
    expect(readingMinutes(right, [right, contributor])).toBe(2);
  });
});

describe('readingLabel', () => {
  it('formule la durée', () => {
    expect(readingLabel(3)).toBe('3 min de lecture');
  });
});
