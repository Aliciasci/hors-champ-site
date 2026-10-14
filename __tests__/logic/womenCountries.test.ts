import { localCultureEntities } from '@/data/culture';
import { WORLD_COUNTRIES } from '@/content/world';
import { worldShapes } from '@/content/world/geo';
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

  it('place chaque pays des femmes sur la vraie carte, avec sa pastille', () => {
    const shapes = worldShapes();
    const onMap = new Map(shapes.countries.filter((c) => c.code).map((c) => [c.code!, c]));
    const used = new Set(Object.values(WOMEN_COUNTRIES).flatMap((w) => w.countries));
    for (const code of used) {
      const country = onMap.get(code);
      expect({ code, onMap: Boolean(country?.d) }).toEqual({ code, onMap: true });
      expect(country!.x).toBeGreaterThan(0);
      expect(country!.x).toBeLessThan(shapes.width);
      expect(country!.y).toBeGreaterThan(0);
      expect(country!.y).toBeLessThan(shapes.height);
    }
    // La pastille de la France est en métropole, pas en Guyane.
    const france = onMap.get('FRA')!;
    expect(france.x).toBeGreaterThan(onMap.get('GBR')!.x! - 30);
  });
});
