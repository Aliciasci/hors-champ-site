import { SUFFRAGE, suffrageCount, suffrageState } from '@/content/suffrage';

describe('données du droit de vote dans le monde', () => {
  it('a des codes et des positions uniques', () => {
    expect(new Set(SUFFRAGE.map((c) => c.code)).size).toBe(SUFFRAGE.length);
    expect(new Set(SUFFRAGE.map((c) => `${c.col},${c.row}`)).size).toBe(SUFFRAGE.length);
  });

  it('a des années cohérentes, dans la période de la source', () => {
    for (const country of SUFFRAGE) {
      expect(country.first).toBeLessThanOrEqual(country.full);
      expect(country.first).toBeGreaterThanOrEqual(1893);
      expect(country.full).toBeLessThanOrEqual(2011);
      if (country.first !== country.full) expect(country.note).toBeTruthy();
    }
  });

  it('place chaque pays dans la grille de 26 colonnes', () => {
    for (const country of SUFFRAGE) {
      expect(country.col).toBeGreaterThanOrEqual(0);
      expect(country.col).toBeLessThan(26);
    }
  });
});

describe('suffrageState et suffrageCount', () => {
  const uk = SUFFRAGE.find((c) => c.code === 'GBR')!;

  it('distingue le droit sous conditions du droit plein', () => {
    expect(suffrageState(uk, 1917)).toBe('none');
    expect(suffrageState(uk, 1920)).toBe('partial');
    expect(suffrageState(uk, 1928)).toBe('full');
  });

  it('compte un seul pays en 1893, tous en 2011', () => {
    expect(suffrageCount(SUFFRAGE, 1893)).toEqual({ total: 1, partial: 0 });
    expect(suffrageCount(SUFFRAGE, 2011).total).toBe(SUFFRAGE.length);
  });
});
