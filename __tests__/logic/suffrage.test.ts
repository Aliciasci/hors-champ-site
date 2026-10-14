import { SUFFRAGE } from '@/content/suffrage';
import { levelAt, rightCount, TODAY, WORLD_COUNTRIES, WORLD_RIGHTS } from '@/content/world';

const right = (id: string) => WORLD_RIGHTS.find((r) => r.id === id)!;

describe('carte des droits des femmes dans le monde', () => {
  it('a des codes et des positions de tuiles uniques', () => {
    expect(new Set(WORLD_COUNTRIES.map((c) => c.code)).size).toBe(WORLD_COUNTRIES.length);
    expect(new Set(WORLD_COUNTRIES.map((c) => `${c.col},${c.row}`)).size).toBe(
      WORLD_COUNTRIES.length,
    );
    for (const country of WORLD_COUNTRIES) {
      expect(country.col).toBeGreaterThanOrEqual(0);
      expect(country.col).toBeLessThan(26);
    }
  });

  it('ne cite que des pays placés sur la carte, avec des étapes dans l’ordre', () => {
    const codes = new Set(WORLD_COUNTRIES.map((c) => c.code));
    for (const r of WORLD_RIGHTS) {
      for (const [code, steps] of Object.entries(r.countries)) {
        expect(codes.has(code)).toBe(true);
        expect(steps.length).toBeGreaterThan(0);
        const years = steps.map((s) => s.year);
        expect([...years].sort((a, b) => a - b)).toEqual(years);
      }
    }
  });

  it('appuie chaque étape hors vote sur un extrait de la source', () => {
    for (const r of WORLD_RIGHTS.filter((x) => x.id !== 'vote')) {
      for (const steps of Object.values(r.countries)) {
        for (const step of steps) expect(step.excerpt?.length ?? 0).toBeGreaterThan(20);
      }
    }
  });

  it('garde les années du vote cohérentes', () => {
    for (const country of SUFFRAGE) {
      expect(country.first).toBeLessThanOrEqual(country.full);
      if (country.first !== country.full) expect(country.note).toBeTruthy();
    }
  });
});

describe('levelAt et rightCount', () => {
  it('distingue le droit sous conditions du droit plein', () => {
    const uk = right('vote').countries.GBR;
    expect(levelAt(uk, 1917)).toBe('none');
    expect(levelAt(uk, 1920)).toBe('partial');
    expect(levelAt(uk, 1928)).toBe('full');
    expect(levelAt(undefined, 1928)).toBeNull();
  });

  it('suit les reculs : URSS, États-Unis, Espagne', () => {
    const abortion = right('avortement').countries;
    expect(levelAt(abortion.RUS, 1930)).toBe('full');
    expect(levelAt(abortion.RUS, 1940)).toBe('partial');
    expect(levelAt(abortion.RUS, 1960)).toBe('full');
    expect(levelAt(abortion.USA, 2000)).toBe('full');
    expect(levelAt(abortion.USA, 2023)).toBe('partial');
    const majority = right('majorite').countries.ESP;
    expect(levelAt(majority, 1935)).toBe('full');
    expect(levelAt(majority, 1950)).toBe('none');
    expect(levelAt(majority, 1980)).toBe('full');
  });

  it('montre « aujourd’hui » les pays où les femmes ne votent pas', () => {
    const vote = right('vote').countries;
    expect(levelAt(vote.AFG, 2000)).toBe('full');
    expect(levelAt(vote.AFG, TODAY)).toBe('none');
    expect(levelAt(vote.YEM, TODAY)).toBe('none');
    expect(levelAt(vote.VAT, TODAY)).toBe('none');
    expect(vote.AFG!.at(-1)).toMatchObject({ undated: true });
  });

  it('compte un seul pays votant en 1893', () => {
    expect(rightCount(right('vote'), 1893)).toMatchObject({ total: 1, partial: 0 });
  });
});
