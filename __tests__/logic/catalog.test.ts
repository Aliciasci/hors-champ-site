import { categories } from '@/data/categories';
import { localCultureEntities } from '@/data/culture';
import { localExperiences } from '@/data/experiences';
import { localYouthItems, youthLives } from '@/data/youth';
import { buildCatalog, ContentValidationError, getCatalog } from '@/content/catalog';

const raw = {
  experiences: localExperiences,
  culture: [['src/data/culture', localCultureEntities]] as [string, unknown[]][],
  youthItems: localYouthItems,
  youthLives,
  categories,
};

describe('catalogue du site (validation au build)', () => {
  it('reprend tous les contenus du mobile, plus les contemporaines, sportives et femmes du XXIe siècle du site', () => {
    const catalog = buildCatalog(raw, { includeDevExamples: true });
    expect(catalog.culture).toHaveLength(85 + 32 + 10 + 11);
    expect(catalog.experiences).toHaveLength(6);
    expect(catalog.themes).toHaveLength(11);
    expect(catalog.youthItems.length).toBeGreaterThan(0);
  });

  it('construit le site avec toutes les fiches du catalogue local, sans en oublier un fichier', () => {
    expect(
      getCatalog()
        .culture.map((e) => e.id)
        .sort(),
    ).toEqual(localCultureEntities.map((e) => e.id).sort());
  });

  it('masque les exemples de développement sans le drapeau', () => {
    expect(buildCatalog(raw, { includeDevExamples: false }).experiences).toEqual([]);
  });

  it('refuse une fiche sans source, avec le fichier, la fiche et la règle', () => {
    const bad = { ...localCultureEntities[0]!, sources: [] };
    expect(() =>
      buildCatalog(
        {
          ...raw,
          culture: [['src/data/culture/people.ts', [bad, ...localCultureEntities.slice(1)]]],
        },
        { includeDevExamples: true },
      ),
    ).toThrowError(
      /src\/data\/culture\/people\.ts — fiche « person-[^»]+ » : cette fiche doit citer au moins une source/,
    );
  });

  it('refuse un lien cassé et un doublon', () => {
    const first = localCultureEntities[0]!;
    const broken = { ...first, links: [{ targetId: 'work-inexistante', relation: 'created' }] };
    try {
      buildCatalog(
        { ...raw, culture: [['f.ts', [broken, first, ...localCultureEntities.slice(1)]]] },
        { includeDevExamples: true },
      );
      throw new Error('aurait dû échouer');
    } catch (error) {
      expect(error).toBeInstanceOf(ContentValidationError);
      const text = (error as Error).message;
      expect(text).toContain('identifiant dupliqué');
      expect(text).toContain('lien vers une fiche absente : work-inexistante');
    }
  });

  it('refuse un contrechamp vérifié sans date de relecture', () => {
    const bad = { ...localExperiences[0]!, editorialStatus: 'verified', reviewedAt: null };
    expect(() =>
      buildCatalog(
        { ...raw, experiences: [bad, ...localExperiences.slice(1)] },
        { includeDevExamples: true },
      ),
    ).toThrowError(/une expérience vérifiée doit avoir une date de relecture/);
  });

  it('refuse un texte jeunesse sans ses deux versions', () => {
    const [first, ...rest] = localYouthItems;
    const bad = {
      ...first!,
      title: first!.title,
      ...(first!.kind === 'career' ? { hook: { '6-10': '', '11-14': 'x' } } : {}),
    };
    expect(() =>
      buildCatalog(
        { ...raw, youthItems: [bad as typeof first & object, ...rest] },
        { includeDevExamples: true },
      ),
    ).toThrowError(/texte manquant pour une tranche d’âge/);
  });

  it('le catalogue réel est valide', () => {
    expect(() => getCatalog()).not.toThrow();
  });
});
