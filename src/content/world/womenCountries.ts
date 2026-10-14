/**
 * Pays de chaque femme du catalogue, pour la carte « Elles, pays par pays ».
 * Source : nationalité (propriété P27) de sa notice Wikidata, consultée le 2026-10-14 ; un code
 * ISO à trois lettres par pays, dans l'ordre de la notice. Une femme peut compter pour plusieurs
 * pays. Quand la notice ne donne qu'un État disparu, `historical` le nomme et le pays d'aujourd'hui
 * qui le recouvre est ajouté en tête.
 */
export interface WomanCountries {
  /** Notice Wikidata de la femme. */
  qid: string;
  countries: string[];
  /** État historique de la notice, rattaché au pays d'aujourd'hui. */
  historical?: string;
}

export const WOMEN_COUNTRIES: Record<string, WomanCountries> = {
  'person-sofonisba-anguissola': {
    qid: 'Q236038',
    countries: ['ITA'],
    historical: 'duché de Milan',
  },
  'person-emily-mary-osborn': { qid: 'Q5372282', countries: ['GBR'] },
  'person-suzanne-valadon': { qid: 'Q156889', countries: ['FRA'] },
  'person-rosa-bonheur': { qid: 'Q241732', countries: ['FRA'] },
  'person-artemisia-gentileschi': {
    qid: 'Q212657',
    countries: ['ITA'],
    historical: 'États pontificaux',
  },
  'person-mary-cassatt': { qid: 'Q173223', countries: ['USA'] },
  'person-ada-lovelace': {
    qid: 'Q7259',
    countries: ['GBR'],
    historical: 'Royaume-Uni de Grande-Bretagne et d’Irlande',
  },
  'person-marie-curie': {
    qid: 'Q7186',
    countries: ['POL', 'FRA'],
    historical: 'Empire russe (née à Varsovie)',
  },
  'person-emmy-noether': { qid: 'Q7099', countries: ['DEU'] },
  'person-lise-meitner': { qid: 'Q56189', countries: ['AUT', 'SWE'] },
  'person-hedy-lamarr': { qid: 'Q49034', countries: ['AUT', 'USA'] },
  'person-grace-hopper': { qid: 'Q11641', countries: ['USA'] },
  'person-rosalind-franklin': { qid: 'Q7474', countries: ['GBR'] },
  'person-katherine-johnson': { qid: 'Q11740', countries: ['USA'] },
  'person-wangari-maathai': { qid: 'Q46795', countries: ['KEN'] },
  'person-tu-youyou': { qid: 'Q462843', countries: ['CHN'] },
  'person-toni-morrison': { qid: 'Q72334', countries: ['USA'] },
  'person-zaha-hadid': { qid: 'Q47780', countries: ['GBR', 'IRQ'] },
  'person-ellen-johnson-sirleaf': { qid: 'Q43179', countries: ['LBR'] },
  'person-malala-yousafzai': { qid: 'Q32732', countries: ['PAK'] },
  'person-katalin-kariko': { qid: 'Q88608397', countries: ['HUN', 'USA'] },
  'person-emmanuelle-charpentier': { qid: 'Q17280087', countries: ['FRA'] },
  'person-agnes-varda': { qid: 'Q229990', countries: ['FRA', 'BEL'] },
  'person-ruth-bader-ginsburg': { qid: 'Q11116', countries: ['USA'] },
  'person-mae-jemison': { qid: 'Q34091', countries: ['USA'] },
  'person-jane-goodall': { qid: 'Q184746', countries: ['GBR'] },
  'person-nina-simone': { qid: 'Q174957', countries: ['USA'] },
  'person-miriam-makeba': { qid: 'Q146256', countries: ['GIN', 'DZA', 'ZAF'] },
  'person-aretha-franklin': { qid: 'Q125121', countries: ['USA'] },
  'person-yayoi-kusama': { qid: 'Q231121', countries: ['JPN'] },
  'person-louise-bourgeois': { qid: 'Q159409', countries: ['FRA', 'USA'] },
  'person-niki-de-saint-phalle': { qid: 'Q168704', countries: ['FRA', 'CHE', 'USA'] },
  'person-maya-angelou': { qid: 'Q19526', countries: ['USA'] },
  'person-annie-ernaux': { qid: 'Q1153825', countries: ['FRA'] },
  'person-benazir-bhutto': { qid: 'Q34413', countries: ['PAK'] },
  'person-michelle-bachelet': { qid: 'Q320', countries: ['CHL'] },
  'person-jacinda-ardern': { qid: 'Q3606816', countries: ['NZL'] },
  'person-shirin-ebadi': { qid: 'Q131152', countries: ['IRN'] },
  'person-sonia-sotomayor': { qid: 'Q11107', countries: ['USA'] },
  'person-christiane-taubira': { qid: 'Q268675', countries: ['FRA'] },
  'person-rigoberta-menchu': { qid: 'Q188620', countries: ['GTM'] },
  'person-nadia-murad': { qid: 'Q22007112', countries: ['IRQ'] },
  'person-narges-mohammadi': { qid: 'Q4967771', countries: ['IRN'] },
  'person-angela-davis': { qid: 'Q160456', countries: ['USA'] },
  'person-bell-hooks': { qid: 'Q259507', countries: ['USA'] },
  'person-billie-jean-king': { qid: 'Q54527', countries: ['USA'] },
  'person-olympe-de-gouges': { qid: 'Q206972', countries: ['FRA'] },
  'person-hubertine-auclert': { qid: 'Q448953', countries: ['FRA'] },
  'person-cecile-brunschvicg': { qid: 'Q3009715', countries: ['FRA'] },
  'person-louise-weiss': { qid: 'Q274163', countries: ['FRA'] },
  'person-marie-andree-lagroua-weill-halle': { qid: 'Q18328198', countries: ['FRA'] },
  'person-simone-de-beauvoir': { qid: 'Q7197', countries: ['FRA'] },
  'person-gisele-halimi': { qid: 'Q457705', countries: ['FRA', 'TUN'] },
  'person-simone-veil': { qid: 'Q298180', countries: ['FRA', 'BEL'] },
  'person-yvette-roudy': { qid: 'Q3574055', countries: ['FRA'] },
  'person-brigitte-gros': { qid: 'Q2925431', countries: ['FRA'] },
  'person-julie-victoire-daubie': { qid: 'Q3189140', countries: ['FRA'] },
};

/** Les femmes de chaque pays, dans l'ordre du catalogue. */
export function womenByCountry(ids: readonly string[]): Record<string, string[]> {
  const byCountry: Record<string, string[]> = {};
  for (const id of ids) {
    for (const code of WOMEN_COUNTRIES[id]?.countries ?? []) (byCountry[code] ??= []).push(id);
  }
  return byCountry;
}
