/**
 * Dates exactes de naissance et de décès des femmes du catalogue, pour « Ce jour-là ».
 * Source : propriétés P569 et P570 de leur notice Wikidata (voir womenCountries.ts), consultées
 * le 2026-10-22. Ne sont gardées que les dates précises au jour, sans valeur concurrente dans la
 * notice, postérieures au calendrier grégorien (1583) et dont l'année concorde avec la fiche.
 */
export interface WomanDates {
  /** AAAA-MM-JJ. */
  born?: string;
  died?: string;
}

export const WOMEN_DATES: Record<string, WomanDates> = {
  'person-sofonisba-anguissola': { died: '1625-11-16' },
  'person-emily-mary-osborn': { died: '1925-04-14' },
  'person-suzanne-valadon': { born: '1865-09-23', died: '1938-04-07' },
  'person-rosa-bonheur': { born: '1822-03-16', died: '1899-05-25' },
  'person-artemisia-gentileschi': { born: '1593-07-08' },
  'person-mary-cassatt': { born: '1844-05-22', died: '1926-06-14' },
  'person-ada-lovelace': { born: '1815-12-10', died: '1852-11-27' },
  'person-marie-curie': { born: '1867-11-07', died: '1934-07-04' },
  'person-emmy-noether': { born: '1882-03-23', died: '1935-04-14' },
  'person-lise-meitner': { died: '1968-10-27' },
  'person-hedy-lamarr': { born: '1914-11-09', died: '2000-01-19' },
  'person-grace-hopper': { born: '1906-12-09', died: '1992-01-01' },
  'person-rosalind-franklin': { born: '1920-07-25', died: '1958-04-16' },
  'person-katherine-johnson': { born: '1918-08-26', died: '2020-02-24' },
  'person-wangari-maathai': { born: '1940-04-01', died: '2011-09-25' },
  'person-tu-youyou': { born: '1930-12-30' },
  'person-toni-morrison': { born: '1931-02-18', died: '2019-08-05' },
  'person-zaha-hadid': { born: '1950-10-31', died: '2016-03-31' },
  'person-ellen-johnson-sirleaf': { born: '1938-10-29' },
  'person-malala-yousafzai': { born: '1997-07-12' },
  'person-katalin-kariko': { born: '1955-01-17' },
  'person-emmanuelle-charpentier': { born: '1968-12-11' },
  'person-agnes-varda': { born: '1928-05-30', died: '2019-03-29' },
  'person-ruth-bader-ginsburg': { born: '1933-03-15', died: '2020-09-18' },
  'person-mae-jemison': { born: '1956-10-17' },
  'person-jane-goodall': { born: '1934-04-03', died: '2025-10-01' },
  'person-nina-simone': { born: '1933-02-21', died: '2003-04-21' },
  'person-miriam-makeba': { born: '1932-03-04' },
  'person-aretha-franklin': { born: '1942-03-25', died: '2018-08-16' },
  'person-yayoi-kusama': { born: '1929-03-22', died: '2026-08-14' },
  'person-louise-bourgeois': { born: '1911-12-25', died: '2010-05-31' },
  'person-niki-de-saint-phalle': { born: '1930-10-29' },
  'person-maya-angelou': { born: '1928-04-04', died: '2014-05-28' },
  'person-annie-ernaux': { born: '1940-09-01' },
  'person-benazir-bhutto': { born: '1953-06-21', died: '2007-12-27' },
  'person-michelle-bachelet': { born: '1951-09-29' },
  'person-jacinda-ardern': { born: '1980-07-26' },
  'person-shirin-ebadi': { born: '1947-06-21' },
  'person-sonia-sotomayor': { born: '1954-06-25' },
  'person-christiane-taubira': { born: '1952-02-02' },
  'person-rigoberta-menchu': { born: '1959-01-09' },
  'person-nadia-murad': { born: '1993-03-10' },
  'person-narges-mohammadi': { born: '1972-04-21' },
  'person-angela-davis': { born: '1944-01-26' },
  'person-bell-hooks': { born: '1952-09-25', died: '2021-12-15' },
  'person-billie-jean-king': { born: '1943-11-22' },
  'person-olympe-de-gouges': { born: '1748-05-07', died: '1793-11-03' },
  'person-hubertine-auclert': { born: '1848-04-10', died: '1914-04-08' },
  'person-cecile-brunschvicg': { born: '1877-07-19', died: '1946-10-05' },
  'person-louise-weiss': { born: '1893-01-25', died: '1983-05-26' },
  'person-marie-andree-lagroua-weill-halle': { born: '1916-01-13', died: '1994-01-08' },
  'person-simone-de-beauvoir': { born: '1908-01-09', died: '1986-04-14' },
  'person-gisele-halimi': { born: '1927-07-27', died: '2020-07-28' },
  'person-simone-veil': { born: '1927-07-13', died: '2017-06-30' },
  'person-yvette-roudy': { born: '1929-04-10', died: '2026-08-18' },
  'person-brigitte-gros': { born: '1925-06-12', died: '1985-03-11' },
  'person-julie-victoire-daubie': { born: '1824-03-26', died: '1874-08-26' },
};
