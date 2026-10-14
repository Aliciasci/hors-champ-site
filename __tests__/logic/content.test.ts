import { CATEGORY_IDS } from '@/constants/enums';
import { categories } from '@/data/categories';
import { localExperiences } from '@/data/experiences';
import { validateExperience } from '@/features/experiences/validateExperience';
import { createLocalContentRepository, prepareExperiences } from '@/services/contentRepository';
import { makeExperience, TEST_SOURCE } from './fixtures';

describe('catalogue local', () => {
  it.each(localExperiences.map((e) => [e.id, e] as const))(
    '%s respecte le modèle',
    (_id, experience) => {
      const result = validateExperience(experience);
      expect(result.ok ? [] : result.errors).toEqual([]);
    },
  );

  it('a des identifiants uniques et des liens internes valides', () => {
    const ids = localExperiences.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const experience of localExperiences) {
      for (const related of experience.relatedExperienceIds) expect(ids).toContain(related);
    }
  });

  it('couvre chaque catégorie déclarée', () => {
    expect(categories.map((c) => c.id).sort()).toEqual([...CATEGORY_IDS].sort());
  });

  it('ne présente aucun exemple de développement comme vérifié', () => {
    for (const experience of localExperiences) {
      if (experience.sources.length === 0) expect(experience.editorialStatus).not.toBe('verified');
    }
  });

  it('propose au moins une question à plusieurs réponses et une à lectures ouvertes', () => {
    expect(localExperiences.some((e) => e.question.mode === 'multiple')).toBe(true);
    expect(
      localExperiences.some(
        (e) => e.answerOptions.filter((o) => o.assessment === 'open').length >= 2,
      ),
    ).toBe(true);
  });
});

describe('illustrations des catégories', () => {
  it.each(categories.map((c) => [c.id, c] as const))(
    '%s : œuvre libre, créditée et décrite',
    (_id, category) => {
      const artwork = category.artwork;
      expect(artwork).not.toBeNull();
      if (!artwork) return;
      expect(['Domaine public', 'CC0']).toContain(artwork.license);
      expect(artwork.sourceUrl).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
      expect(artwork.alt.length).toBeGreaterThan(30);
      expect(artwork.artist && artwork.title && artwork.date).toBeTruthy();
      // Un fichier manquant fait déjà échouer le require() de src/data/artworks.ts.
      expect(artwork.image).toBeDefined();
    },
  );
});

describe('validateExperience — contenus invalides', () => {
  it('rejette une valeur qui n’est pas un objet', () => {
    expect(validateExperience(null)).toEqual({ ok: false, id: null, errors: ['objet attendu'] });
  });

  it('signale les champs manquants et les valeurs inconnues', () => {
    const result = validateExperience({
      ...makeExperience(),
      title: '',
      categoryId: 'inconnue',
      estimatedMinutes: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.id).toBe('exp-test');
      expect(result.errors).toEqual(
        expect.arrayContaining([
          'title manquant',
          'categoryId inconnu',
          'estimatedMinutes doit être un entier positif',
        ]),
      );
    }
  });

  it('rejette les identifiants d’options dupliqués', () => {
    const experience = makeExperience();
    const result = validateExperience({
      ...experience,
      answerOptions: [...experience.answerOptions, { ...experience.answerOptions[0] }],
    });
    expect(!result.ok && result.errors.some((e) => e.includes('dupliqué'))).toBe(true);
  });

  it('exige sources et date de relecture pour un contenu vérifié', () => {
    const result = validateExperience(makeExperience({ editorialStatus: 'verified' }));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toEqual(
        expect.arrayContaining([
          'une expérience vérifiée doit citer au moins une source',
          'une expérience vérifiée doit avoir une date de relecture',
        ]),
      );
    }
    expect(
      validateExperience(
        makeExperience({
          editorialStatus: 'verified',
          reviewedAt: '2026-02-01',
          sources: [TEST_SOURCE],
        }),
      ).ok,
    ).toBe(true);
  });

  it('rejette une source sans https, sans date ou sans explication', () => {
    const result = validateExperience(
      makeExperience({
        sources: [{ ...TEST_SOURCE, url: 'http://example.org', accessedAt: 'hier', note: '' }],
      }),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors).toHaveLength(3);
  });
});

describe('repository local', () => {
  const valid = makeExperience({
    id: 'valide',
    relatedExperienceIds: ['absente', 'brouillon', 'valide'],
  });
  const draft = makeExperience({ id: 'brouillon', editorialStatus: 'draft' });
  const devOnly = makeExperience({ id: 'dev' });

  it('écarte les contenus invalides et les signale', () => {
    const issues: unknown[] = [];
    const result = prepareExperiences([valid, { id: 'cassee' }, valid], {
      includeDevExamples: true,
      onInvalidContent: (issue) => issues.push(issue),
    });
    expect(result.map((e) => e.id)).toEqual(['valide']);
    expect(issues).toHaveLength(2); // contenu invalide + doublon
  });

  it('masque les exemples de développement si demandé', () => {
    const result = prepareExperiences([valid, draft, devOnly], { includeDevExamples: false });
    expect(result.map((e) => e.id)).toEqual(['brouillon']);
  });

  it('retire les liens vers des expériences absentes ou vers elle-même', () => {
    const [prepared] = prepareExperiences([valid, draft], { includeDevExamples: true });
    expect(prepared?.relatedExperienceIds).toEqual(['brouillon']);
  });

  it('renvoie null pour un identifiant inconnu', async () => {
    const repository = createLocalContentRepository(
      { experiences: [valid], categories },
      { includeDevExamples: true },
    );
    await expect(repository.getExperience('nexiste-pas')).resolves.toBeNull();
    await expect(repository.getExperience('valide')).resolves.toMatchObject({ id: 'valide' });
    await expect(repository.listCategories()).resolves.toHaveLength(categories.length);
  });
});
