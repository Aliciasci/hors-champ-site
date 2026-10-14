import { localCultureEntities } from '@/data/culture';
import { WORLD_COUNTRIES } from '@/content/world';
import { WOMEN_COUNTRIES, womenByCountry } from '@/content/world/womenCountries';

const people = localCultureEntities.filter((e) => e.kind === 'person');
const codes = new Set(WORLD_COUNTRIES.map((c) => c.code));

describe('Elles, pays par pays', () => {
  it('donne au moins un pays, présent sur la carte, à chaque femme du catalogue', () => {
    for (const person of people) {
      const entry = WOMEN_COUNTRIES[person.id];
      expect({ id: person.id, ok: (entry?.countries.length ?? 0) > 0 }).toEqual({
        id: person.id,
        ok: true,
      });
      for (const code of entry!.countries)
        expect({ id: person.id, code, ok: codes.has(code) }).toEqual({
          id: person.id,
          code,
          ok: true,
        });
      expect(entry!.qid).toMatch(/^Q\d+$/);
    }
  });

  it('ne garde pas de femme absente du catalogue', () => {
    const ids = new Set(people.map((p) => p.id));
    for (const id of Object.keys(WOMEN_COUNTRIES)) expect(ids.has(id)).toBe(true);
  });

  it('compte une femme pour chacun de ses pays', () => {
    const byCountry = womenByCountry(['person-marie-curie', 'person-simone-veil']);
    expect(byCountry.POL).toEqual(['person-marie-curie']);
    expect(byCountry.FRA).toEqual(['person-marie-curie', 'person-simone-veil']);
    expect(WOMEN_COUNTRIES['person-marie-curie']?.historical).toMatch(/Empire russe/);
  });
});
