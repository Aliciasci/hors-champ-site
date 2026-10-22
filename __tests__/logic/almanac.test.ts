import { localCultureEntities } from '@/data/culture';
import { WOMEN_DATES } from '@/content/world/womenDates';
import {
  almanacEvents,
  almanacFor,
  nextObservance,
  OBSERVANCES,
  parseFrenchDate,
} from '@/features/home/almanac';

const events = almanacEvents(localCultureEntities);

describe('Almanach de l’accueil', () => {
  it('lit les dates françaises précises au jour, et elles seules', () => {
    expect(parseFrenchDate('21 avril 1944')).toEqual({ day: 21, month: 4, year: 1944 });
    expect(parseFrenchDate('1er mai 1890')).toEqual({ day: 1, month: 5, year: 1890 });
    expect(parseFrenchDate('Avril 1973')).toBeNull();
    expect(parseFrenchDate('Octobre – novembre 1972')).toBeNull();
  });

  it('accorde chaque date exacte avec l’année de la fiche', () => {
    const byId = new Map(localCultureEntities.map((e) => [e.id, e]));
    for (const [id, dates] of Object.entries(WOMEN_DATES)) {
      const person = byId.get(id);
      expect({ id, person: person?.kind }).toEqual({ id, person: 'person' });
      if (dates.born)
        expect({ id, year: +dates.born.slice(0, 4) }).toEqual({
          id,
          year: person!.period!.sortYear,
        });
      if (dates.died)
        expect({ id, ok: person!.period!.label.includes(dates.died.slice(0, 4)) }).toEqual({
          id,
          ok: true,
        });
    }
  });

  it('trouve le droit de vote un 21 avril, et Simone Veil un 13 juillet', () => {
    const april21 = almanacFor(events, new Date(2026, 3, 21))!;
    expect(april21.offset).toBe(0);
    expect(april21.events.some((e) => e.kind === 'step' && e.year === 1944)).toBe(true);
    const july13 = almanacFor(events, new Date(2026, 6, 13))!;
    expect(july13.events.map((e) => e.entityId)).toContain('person-simone-veil');
  });

  it('ne laisse jamais la rubrique vide', () => {
    for (let d = 0; d < 366; d++) {
      const found = almanacFor(events, new Date(2028, 0, 1 + d));
      expect({ d, found: Boolean(found) }).toEqual({ d, found: true });
    }
  });

  it('annonce le 25 novembre un mois avant, et pas la veille de l’été', () => {
    const next = nextObservance(new Date(2026, 9, 26))!;
    expect(next.observance.href).toBe('/feminicides');
    expect(next.days).toBe(30);
    expect(nextObservance(new Date(2026, 5, 20))).toBeNull();
    expect(nextObservance(new Date(2027, 2, 8))?.days).toBe(0);
    expect(OBSERVANCES.every((o) => o.href.startsWith('/'))).toBe(true);
  });
});
