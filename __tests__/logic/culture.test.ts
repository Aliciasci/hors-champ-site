import { CATEGORY_IDS } from '@/constants/enums';
import { localCultureEntities } from '@/data/culture';
import { contemporaries } from '@/data/culture/contemporaines';
import { galleries } from '@/data/galleries';
import { getCatalog } from '@/content/catalog';
import { sportswomen } from '@/data/culture/sportives';
import { twentyFirstCentury } from '@/data/culture/xxie-siecle';
import { portraitThemes } from '@/data/portraitThemes';
import { localExperiences } from '@/data/experiences';
import {
  groupByKind,
  relatedEntities,
  relatedExperiences,
  sortForBrowsing,
} from '@/features/culture/cultureGraph';
import { prepareCultureEntities, validateCultureEntity } from '@/features/culture/validateCulture';
import { pickCultureSuggestions } from '@/features/home/homeSelectors';
import {
  INITIAL_STATE,
  isDiscoverySaved,
  recordExploration,
  toggleDiscovery,
} from '@/features/progress/progressLogic';
import type { CultureEntity } from '@/types';
import { TEST_SOURCE } from './fixtures';

const issues: unknown[] = [];
const catalog = prepareCultureEntities(localCultureEntities, (issue) => issues.push(issue));
/** Les contemporaines n'ont pas encore de fiches d'œuvres ni de découvertes : tests dédiés. */
// Contemporaines, sportives et femmes du XXIe siècle : des portraits sans œuvre au catalogue.
const contemporaryIds = new Set(
  [...contemporaries, ...sportswomen, ...twentyFirstCentury].map((e) => e.id),
);

describe('catalogue culturel', () => {
  it('est entièrement valide, sans lien cassé', () => {
    expect(issues).toEqual([]);
    expect(catalog).toHaveLength(localCultureEntities.length);
  });

  it('cite au moins une source pour chaque fiche factuelle', () => {
    for (const entity of catalog) {
      if (entity.kind !== 'idea') expect(entity.sources.length).toBeGreaterThan(0);
    }
  });

  it('relie chaque femme à au moins une œuvre, et chaque œuvre à une idée', () => {
    // Les femmes de « Derrière chaque droit » sont reliées à des conquêtes (tests dédiés).
    const people = catalog.filter(
      (e) => e.kind === 'person' && e.domain !== 'droits' && !contemporaryIds.has(e.id),
    );
    expect(people.length).toBeGreaterThan(0);
    for (const person of people)
      expect(person.links.some((l) => l.relation === 'created')).toBe(true);
    for (const work of catalog.filter((e) => e.kind === 'work')) {
      expect(work.links.some((l) => l.relation === 'illustrates')).toBe(true);
    }
  });

  it('propose au moins une idée par thème de l’application', () => {
    const ideaCategories = new Set(
      catalog.filter((e) => e.kind === 'idea').map((e) => e.categoryId),
    );
    for (const id of CATEGORY_IDS) expect(ideaCategories.has(id)).toBe(true);
  });

  it('range chaque fiche (hors idées) dans un domaine : arts, sciences, droits ou sport', () => {
    for (const entity of catalog) {
      if (entity.kind === 'idea') expect(entity.domain).toBeUndefined();
      else expect(['arts', 'sciences', 'droits', 'sport']).toContain(entity.domain);
    }
  });

  it('relie chaque scientifique à une invention ou découverte sourcée', () => {
    const scientists = catalog.filter(
      (e) => e.kind === 'person' && e.domain === 'sciences' && !contemporaryIds.has(e.id),
    );
    expect(scientists).toHaveLength(8);
    for (const person of scientists) {
      const created = relatedEntities(catalog, person.id).filter(
        (r) => r.entity.kind === 'science',
      );
      expect(created.length).toBeGreaterThan(0);
      for (const { entity } of created) expect(entity.sources.length).toBeGreaterThan(0);
    }
  });

  it('illustre chaque invention par une image libre, décrite et créditée', () => {
    for (const entity of catalog.filter((e) => e.kind === 'science')) {
      const image = entity.image;
      expect(image).toBeDefined();
      if (!image) continue;
      expect(['Domaine public', 'CC0', 'CC BY 2.0']).toContain(image.license);
      expect(image.alt.length).toBeGreaterThan(30);
      expect(image.sourceUrl).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
      // Une licence CC BY impose de nommer l'auteur ou le détenteur.
      if (image.license === 'CC BY 2.0') expect(image.artist).not.toMatch(/inconnu/i);
    }
  });

  it('ne relie à l’effet Matilda que des scientifiques citées par sa source', () => {
    const matilda = catalog.find((e) => e.id === 'idea-effet-matilda');
    const linked = relatedEntities(catalog, 'idea-effet-matilda')
      .filter((r) => r.entity.kind === 'person')
      .map((r) => r.entity.title);
    expect(linked.length).toBeGreaterThan(0);
    const excerpts = (matilda?.sources ?? []).map((src) => src.relevantExcerpt ?? '').join(' ');
    for (const name of linked) expect(excerpts).toContain(name);
  });

  it('présente chaque femme par ce qu’elle a fait, en une accroche courte', () => {
    for (const person of catalog.filter((e) => e.kind === 'person')) {
      expect({ id: person.id, hook: typeof person.hook }).toEqual({
        id: person.id,
        hook: 'string',
      });
      expect(person.hook!.length).toBeLessThanOrEqual(75);
      // L'accroche ne répète pas le nom : c'est l'action qui doit éveiller la curiosité.
      expect(person.hook).not.toContain(person.title);
    }
  });

  it('varie les accroches : pas deux fois la même ouverture', () => {
    const openings = catalog
      .filter((e) => e.kind === 'person')
      .map((e) => (e.hook ?? '').split(' ').slice(0, 2).join(' ').toLowerCase());
    expect(new Set(openings).size).toBe(openings.length);
  });

  it('documente chaque sportive : citations, Wikidata, domaine et thématique', () => {
    const sport = portraitThemes.find((t) => t.id === 'sport')!;
    const limits = portraitThemes.find((t) => t.id === 'limites')!;
    expect(sportswomen).toHaveLength(10);
    for (const person of sportswomen) {
      expect(person.domain).toBe('sport');
      const quotes = person.sources.filter((s) => s.publisher === 'Wikipédia');
      expect(quotes.length).toBeGreaterThan(0);
      for (const quote of quotes) expect(quote.relevantExcerpt?.length).toBeGreaterThan(30);
      expect(person.sources.some((s) => s.publisher === 'Wikidata')).toBe(true);
      const themed = [...sport.members, ...limits.members].map((m) => m.personId);
      expect(themed).toContain(person.id);
      if (person.image) expect(['Domaine public', 'CC0']).toContain(person.image.license);
    }
  });

  it('documente chaque contemporaine : citations, Wikidata, « Notre époque » et une autre thématique', () => {
    const epoque = portraitThemes.find((t) => t.id === 'epoque')!;
    expect(contemporaries).toHaveLength(32);
    expect(twentyFirstCentury).toHaveLength(11);
    for (const person of [...contemporaries, ...twentyFirstCentury]) {
      expect(person.kind).toBe('person');
      const quotes = person.sources.filter((s) => s.publisher === 'Wikipédia');
      expect(quotes.length).toBeGreaterThan(0);
      for (const quote of quotes) expect(quote.relevantExcerpt?.length).toBeGreaterThan(30);
      expect(person.sources.some((s) => s.publisher === 'Wikidata')).toBe(true);
      expect(epoque.members.map((m) => m.personId)).toContain(person.id);
      const others = portraitThemes.filter(
        (t) => t.id !== 'epoque' && t.members.some((m) => m.personId === person.id),
      );
      expect({ id: person.id, n: others.length > 0 }).toEqual({ id: person.id, n: true });
      if (person.image) expect(['Domaine public', 'CC0']).toContain(person.image.license);
    }
  });

  it('ne présente aucune fiche non relue comme vérifiée', () => {
    for (const entity of catalog) expect(entity.editorialStatus).not.toBe('verified');
  });
});

const base: CultureEntity = {
  id: 'event-test',
  kind: 'event',
  title: 'Événement',
  summary: 'Résumé',
  links: [],
  sources: [TEST_SOURCE],
  editorialStatus: 'draft',
  reviewedAt: null,
};

describe('validation des fiches', () => {
  it('exige une source pour une fiche factuelle', () => {
    const result = validateCultureEntity({ ...base, sources: [] });
    expect(result.ok).toBe(false);
  });

  it('exige que l’identifiant commence par le type', () => {
    expect(validateCultureEntity({ ...base, id: 'person-test' }).ok).toBe(false);
  });

  it('exige une catégorie pour une idée', () => {
    expect(validateCultureEntity({ ...base, id: 'idea-x', kind: 'idea', sources: [] }).ok).toBe(
      false,
    );
  });

  it('retire les liens cassés ou incohérents et les signale', () => {
    const found: unknown[] = [];
    const person: CultureEntity = {
      ...base,
      id: 'person-a',
      kind: 'person',
      links: [
        { targetId: 'event-test', relation: 'took-part' },
        { targetId: 'event-absent', relation: 'took-part' },
        { targetId: 'event-test', relation: 'illustrates' },
      ],
    };
    const [prepared] = prepareCultureEntities([person, base], (issue) => found.push(issue));
    expect(prepared?.links).toEqual([{ targetId: 'event-test', relation: 'took-part' }]);
    expect(found).toHaveLength(1);
  });

  it('écarte les doublons', () => {
    const found: unknown[] = [];
    expect(prepareCultureEntities([base, base], (i) => found.push(i))).toHaveLength(1);
    expect(found).toHaveLength(1);
  });
});

describe('graphe de liens', () => {
  it('calcule les liens dans les deux sens', () => {
    const fromWork = relatedEntities(catalog, 'work-le-marche-aux-chevaux');
    expect(fromWork.find((r) => r.entity.id === 'person-rosa-bonheur')).toMatchObject({
      relation: 'created',
      direction: 'incoming',
    });
    expect(fromWork.find((r) => r.entity.id === 'idea-stereotypes')?.direction).toBe('outgoing');
    expect(
      fromWork.find((r) => r.entity.id === 'event-1853-salon-marche-aux-chevaux')?.direction,
    ).toBe('incoming');
  });

  it('regroupe par type, événements dans l’ordre chronologique', () => {
    const groups = groupByKind(relatedEntities(catalog, 'person-rosa-bonheur'));
    expect(groups.map((g) => g.kind)).toEqual(['work', 'movement', 'event']);
    const years = groups
      .find((g) => g.kind === 'event')
      ?.items.map((i) => i.entity.period?.sortYear);
    expect(years).toEqual([1800, 1853, 1865]);
  });

  it('mène aux expériences du thème illustré', () => {
    const experiences = relatedExperiences(catalog, 'work-le-marche-aux-chevaux', localExperiences);
    expect(experiences.map((e) => e.categoryId)).toEqual(['stereotypes']);
    expect(
      relatedExperiences(catalog, 'idea-raisonnement', localExperiences).length,
    ).toBeGreaterThan(0);
  });

  it('trie la vue d’ensemble par type puis par date', () => {
    const kinds = sortForBrowsing(catalog).map((e) => e.kind);
    expect(kinds.indexOf('work')).toBeGreaterThan(kinds.lastIndexOf('person'));
    expect(kinds.indexOf('idea')).toBeGreaterThan(kinds.lastIndexOf('event'));
  });
});

describe('découvertes', () => {
  it('enregistre puis retire une découverte', () => {
    let state = toggleDiscovery(INITIAL_STATE, 'person-a', 't1');
    expect(isDiscoverySaved(state, 'person-a')).toBe(true);
    state = toggleDiscovery(state, 'person-a', 't2');
    expect(isDiscoverySaved(state, 'person-a')).toBe(false);
  });

  it('mémorise les fiches explorées, la plus récente en premier, sans doublon', () => {
    let state = recordExploration(INITIAL_STATE, 'a');
    state = recordExploration(state, 'b');
    state = recordExploration(state, 'a');
    expect(state.exploredEntityIds).toEqual(['a', 'b']);
  });
});

describe('suggestions de l’accueil', () => {
  it('propose une femme, une œuvre, une invention et un événement sans lien entre eux', () => {
    const picks = pickCultureSuggestions(catalog, []);
    expect(picks.map((e) => e.kind)).toEqual(['person', 'work', 'science', 'event']);
    for (const a of picks) {
      for (const b of picks) {
        if (a !== b)
          expect(relatedEntities(catalog, a.id).map((r) => r.entity.id)).not.toContain(b.id);
      }
    }
  });

  it('privilégie les fiches pas encore explorées', () => {
    const first = pickCultureSuggestions(catalog, [])[0];
    const next = pickCultureSuggestions(catalog, [first?.id ?? ''])[0];
    expect(next?.id).not.toBe(first?.id);
  });
});

describe('galeries des artistes', () => {
  // Les galeries sont rangées avec leur fiche par le catalogue du site.
  const byId = new Map(getCatalog().culture.map((e) => [e.id, e]));

  it('ne montre que des œuvres du domaine public, d’artistes mortes depuis plus de 70 ans', () => {
    const entries = Object.entries(galleries);
    expect(entries.length).toBeGreaterThanOrEqual(6);
    for (const [id, works] of entries) {
      const person = byId.get(id);
      expect({ id, kind: person?.kind, domain: person?.domain }).toEqual({
        id,
        kind: 'person',
        domain: 'arts',
      });
      const death =
        person!.period!.endYear ?? Number(person!.period!.label.match(/(\d{4})\D*$/)?.[1]);
      expect({ id, publicDomain: death <= 2026 - 71 }).toEqual({ id, publicDomain: true });
      expect(person!.gallery).toBe(works);
      for (const work of works) {
        expect(['Domaine public', 'CC0']).toContain(work.license);
        expect(work.sourceUrl).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
        expect(work.alt.length).toBeGreaterThan(20);
        expect(work.artist).toBe(person!.title);
      }
    }
  });
});
