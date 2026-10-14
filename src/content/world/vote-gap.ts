import type { Source } from '@/types';

/**
 * Suffrage masculin et suffrage féminin, pays par pays : l'attente des femmes (page du monde).
 * Toutes les années viennent du tableau de la source ; seuls les pays où les femmes ont attendu
 * dix ans ou plus sont retenus.
 */
export const VOTE_GAP_SOURCE: Source = {
  id: 'wikipedia-en-universal_suffrage-dates_by_country',
  title: 'Universal suffrage',
  publisher: 'Wikipedia (en anglais)',
  url: 'https://en.wikipedia.org/wiki/Universal_suffrage#Dates_by_country',
  sourceType: 'encyclopedia',
  accessedAt: '2026-10-14',
  note: 'Tableau « Dates by country » : colonnes « Male » et « Female ». Ces années peuvent différer d’un an ou deux de la chronologie française utilisée sur la carte.',
};

export interface VoteGap {
  name: string;
  /** Suffrage masculin. */
  men: number;
  /** Suffrage féminin. */
  women: number;
}

export const VOTE_GAPS: VoteGap[] = [
  { name: 'Suisse', men: 1848, women: 1971 },
  { name: 'Espagne', men: 1812, women: 1933 },
  { name: 'Grèce', men: 1844, women: 1952 },
  { name: 'Argentine', men: 1853, women: 1952 },
  { name: 'France', men: 1848, women: 1944 },
  { name: 'Bulgarie', men: 1879, women: 1945 },
  { name: 'Danemark', men: 1849, women: 1915 },
  { name: 'États-Unis', men: 1856, women: 1920 },
  { name: 'Liechtenstein', men: 1921, women: 1984 },
  { name: 'Turquie', men: 1876, women: 1934 },
  { name: 'Iran', men: 1906, women: 1963 },
  { name: 'Serbie', men: 1888, women: 1945 },
  { name: 'Belgique', men: 1893, women: 1948 },
  { name: 'Allemagne', men: 1871, women: 1919 },
  { name: 'Koweït', men: 1962, women: 2005 },
  { name: 'Brésil', men: 1891, women: 1932 },
  { name: 'Mexique', men: 1917, women: 1953 },
  { name: 'Italie', men: 1912, women: 1945 },
  { name: 'Roumanie', men: 1918, women: 1948 },
  { name: 'Autriche', men: 1896, women: 1918 },
  { name: 'Tchécoslovaquie', men: 1896, women: 1918 },
  { name: 'Afrique du Sud', men: 1910, women: 1931 },
  { name: 'Japon', men: 1925, women: 1945 },
  { name: 'Colombie', men: 1936, women: 1954 },
  { name: 'Norvège', men: 1898, women: 1913 },
  { name: 'Bolivie', men: 1938, women: 1952 },
  { name: 'Nouvelle-Zélande', men: 1879, women: 1893 },
  { name: 'Maurice', men: 1948, women: 1959 },
  { name: 'Arabie saoudite', men: 2005, women: 2015 },
  { name: 'Suède', men: 1909, women: 1919 },
  { name: 'Royaume-Uni', men: 1918, women: 1928 },
];

/** Du plus long au plus court, puis par nom. */
export const sortedVoteGaps = () =>
  [...VOTE_GAPS].sort(
    (a, b) => b.women - b.men - (a.women - a.men) || a.name.localeCompare(b.name),
  );
