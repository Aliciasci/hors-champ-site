import { localCultureEntities } from '@/data/culture';
import {
  combatsOf,
  contributorsOf,
  EMPTY_RIGHT_FILTERS,
  filterRights,
  lawsFor,
  matchesPeriod,
  relatedEntities,
  RIGHT_CATEGORY_ORDER,
} from '@/features/culture/cultureGraph';
import { prepareCultureEntities, validateCultureEntity } from '@/features/culture/validateCulture';
import type { CultureEntity } from '@/types';
import { TEST_SOURCE } from './fixtures';

const issues: unknown[] = [];
const catalog = prepareCultureEntities(localCultureEntities, (issue) => issues.push(issue));
const rights = catalog.filter((e) => e.kind === 'right');
const byId = new Map(catalog.map((e) => [e.id, e]));

describe('Derrière chaque droit — corpus', () => {
  it('est valide et propose au moins cinq conquêtes françaises', () => {
    expect(issues).toEqual([]);
    expect(rights.length).toBeGreaterThanOrEqual(5);
    for (const right of rights) expect(right.right?.country).toBe('France');
  });

  it('reste en brouillon : aucun nouveau contenu n’est présenté comme relu', () => {
    for (const entity of catalog.filter((e) => e.domain === 'droits')) {
      expect(entity.editorialStatus).toBe('draft');
    }
  });

  it('rattache chaque conquête à un texte et à l’institution qui l’a adopté', () => {
    for (const right of rights) {
      const laws = lawsFor(catalog, right.id);
      expect(laws.length).toBeGreaterThan(0);
      for (const law of laws) expect(law.law?.institution.length).toBeGreaterThan(3);
    }
  });

  it('décrit chaque conquête : situation avant, étapes datées, résultat', () => {
    for (const right of rights) {
      expect(right.right?.before.length).toBeGreaterThan(20);
      expect(right.right?.steps.length).toBeGreaterThan(0);
      expect(right.right?.outcome.length).toBeGreaterThan(20);
    }
  });

  it('ne relie une femme ou une organisation à un droit que si sa source décrit son rôle', () => {
    for (const contributor of catalog) {
      for (const link of contributor.links.filter((l) => l.relation === 'contributed')) {
        expect(link.contribution).toBeDefined();
        expect(link.detail?.length).toBeGreaterThan(20);
        const source = contributor.sources.find((s) => s.id === link.sourceId);
        expect(source?.relevantExcerpt).toBeTruthy();
        // La citation parle bien d'elle : article qui lui est consacré, ou nom cité.
        const aboutHer =
          source?.title === contributor.title ||
          (source?.relevantExcerpt ?? '').includes(contributor.title);
        expect({ id: contributor.id, aboutHer }).toEqual({ id: contributor.id, aboutHer: true });
      }
    }
  });

  it('ne présente pas une conquête comme l’œuvre d’une seule femme', () => {
    for (const right of rights) {
      // Toujours au moins une autre partie prenante qu'une femme : organisation ou institution.
      const organizations = contributorsOf(catalog, right.id).filter(
        (c) => c.contributor.kind === 'organization',
      );
      expect(organizations.length + lawsFor(catalog, right.id).length).toBeGreaterThan(0);
      // Les étapes nomment d'autres actrices et acteurs que les seules contributrices reliées.
      expect(right.right?.steps.length).toBeGreaterThan(0);
    }
  });

  it('assume une conquête sans contributrice documentée plutôt que d’en inventer une', () => {
    const matrimonial = byId.get('right-regimes-matrimoniaux');
    expect(matrimonial).toBeDefined();
    expect(contributorsOf(catalog, 'right-regimes-matrimoniaux')).toEqual([]);
  });

  it('crédite les portraits sous une licence libre et compatible', () => {
    for (const entity of catalog.filter((e) => e.domain === 'droits' && e.image)) {
      expect(['Domaine public', 'CC0', 'CC BY 3.0']).toContain(entity.image?.license);
      expect(entity.image?.alt.length).toBeGreaterThan(30);
    }
  });
});

describe('Derrière chaque droit — relations', () => {
  it('sont lisibles dans les deux sens', () => {
    const fromRight = relatedEntities(catalog, 'right-ivg').map((r) => r.entity.id);
    expect(fromRight).toEqual(
      expect.arrayContaining(['person-simone-veil', 'organization-choisir', 'law-loi-veil']),
    );
    const fromPerson = relatedEntities(catalog, 'person-gisele-halimi').map((r) => r.entity.id);
    expect(fromPerson).toEqual(expect.arrayContaining(['right-ivg', 'right-viol-crime']));
  });

  it('relient une femme à plusieurs droits et un droit à plusieurs femmes', () => {
    expect(new Set(combatsOf(catalog, 'person-gisele-halimi').map((c) => c.right.id)).size).toBe(2);
    const women = contributorsOf(catalog, 'right-ivg').filter(
      (c) => c.contributor.kind === 'person',
    );
    expect(new Set(women.map((c) => c.contributor.id)).size).toBeGreaterThanOrEqual(3);
  });

  it('distinguent les droits obtenus de son vivant, après sa mort, et les combats poursuivis', () => {
    expect(combatsOf(catalog, 'person-olympe-de-gouges').map((c) => c.timing)).toEqual([
      'posthumous',
    ]);
    expect(combatsOf(catalog, 'person-cecile-brunschvicg').map((c) => c.timing)).toEqual([
      'lifetime',
    ]);
    const roudy = combatsOf(catalog, 'person-yvette-roudy');
    expect(roudy.find((c) => c.right.id === 'right-ivg')?.timing).toBe('after-adoption');
    expect(roudy.find((c) => c.right.id === 'right-egalite-professionnelle')?.timing).toBe(
      'lifetime',
    );
  });

  it('classent les contributions par ordre chronologique', () => {
    const years = contributorsOf(catalog, 'right-droit-de-vote').map((c) => c.link.year ?? 0);
    expect(years).toEqual([...years].sort((a, b) => a - b));
    expect(contributorsOf(catalog, 'right-droit-de-vote')[0]?.contributor.id).toBe(
      'person-olympe-de-gouges',
    );
  });
});

describe('Derrière chaque droit — recherche et filtres', () => {
  it('trouve une conquête par le nom d’une contributrice, sans tenir compte des accents', () => {
    const ids = filterRights(catalog, { ...EMPTY_RIGHT_FILTERS, query: 'gisele halimi' }).map(
      (r) => r.id,
    );
    expect(ids).toEqual(['right-ivg', 'right-viol-crime']);
  });

  it('filtre par catégorie, période et personnalité', () => {
    const reproduction = filterRights(catalog, {
      ...EMPTY_RIGHT_FILTERS,
      categories: ['reproduction'],
    });
    expect(reproduction.map((r) => r.id)).toEqual(['right-contraception', 'right-ivg']);
    const early = filterRights(catalog, { ...EMPTY_RIGHT_FILTERS, periods: ['1900-1945'] });
    expect(early.map((r) => r.id)).toEqual(['right-droit-de-vote']);
    const veil = filterRights(catalog, { ...EMPTY_RIGHT_FILTERS, people: ['person-simone-veil'] });
    expect(veil.map((r) => r.id)).toEqual(['right-ivg']);
  });

  it('découpe les périodes sans recouvrement', () => {
    expect(matchesPeriod(1945, '1900-1945')).toBe(true);
    expect(matchesPeriod(1945, '1945-1970')).toBe(false);
    expect(matchesPeriod(1970, '1945-1970')).toBe(true);
    expect(matchesPeriod(1971, 'after-1970')).toBe(true);
    expect(matchesPeriod(1899, 'before-1900')).toBe(true);
  });

  it('couvre les huit familles demandées', () => {
    expect(RIGHT_CATEGORY_ORDER).toHaveLength(8);
  });
});

describe('Derrière chaque droit — validation', () => {
  const right: CultureEntity = {
    id: 'right-test',
    kind: 'right',
    title: 'Droit',
    summary: 'Résumé',
    period: { label: '1900', sortYear: 1900 },
    right: {
      category: 'politique',
      country: 'France',
      before: 'Avant',
      steps: [{ date: '1900', text: 'Étape' }],
      outcome: 'Résultat',
      limits: [],
      later: [],
    },
    links: [],
    sources: [TEST_SOURCE],
    editorialStatus: 'draft',
    reviewedAt: null,
  };
  const person: CultureEntity = {
    id: 'person-test',
    kind: 'person',
    title: 'Personne',
    summary: 'Résumé',
    links: [],
    sources: [TEST_SOURCE],
    editorialStatus: 'draft',
    reviewedAt: null,
  };

  it('accepte une conquête complète', () => {
    expect(validateCultureEntity(right).ok).toBe(true);
  });

  it('refuse une conquête sans détails ni étapes', () => {
    expect(validateCultureEntity({ ...right, right: undefined }).ok).toBe(false);
    const noSteps = { ...right, right: { ...right.right!, steps: [] } };
    expect(validateCultureEntity(noSteps).ok).toBe(false);
  });

  it('refuse un texte de loi sans institution', () => {
    expect(
      validateCultureEntity({ ...right, id: 'law-test', kind: 'law', right: undefined }).ok,
    ).toBe(false);
  });

  it('refuse une contribution sans nature, sans détail ou sans source de la fiche', () => {
    const link = {
      targetId: 'right-test',
      relation: 'contributed' as const,
      contribution: 'claim' as const,
      detail: 'Rédige un texte.',
      sourceId: TEST_SOURCE.id,
    };
    expect(validateCultureEntity({ ...person, links: [link] }).ok).toBe(true);
    expect(
      validateCultureEntity({ ...person, links: [{ ...link, contribution: undefined }] }).ok,
    ).toBe(false);
    expect(validateCultureEntity({ ...person, links: [{ ...link, detail: '' }] }).ok).toBe(false);
    expect(validateCultureEntity({ ...person, links: [{ ...link, sourceId: 'autre' }] }).ok).toBe(
      false,
    );
  });

  it('refuse une contribution vers autre chose qu’une conquête', () => {
    const issuesHere: unknown[] = [];
    const work: CultureEntity = { ...person, id: 'work-test', kind: 'work' };
    prepareCultureEntities(
      [
        work,
        {
          ...person,
          links: [
            {
              targetId: 'work-test',
              relation: 'contributed',
              contribution: 'claim',
              detail: 'Détail',
              sourceId: TEST_SOURCE.id,
            },
          ],
        },
      ],
      (issue) => issuesHere.push(issue),
    );
    expect(issuesHere.length).toBeGreaterThan(0);
  });
});
