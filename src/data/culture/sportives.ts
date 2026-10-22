import type { CultureEntity } from '@/types';

import { portraits } from '../portraits';
import { wikidata, wikipedia } from './sources';

/** Date de consultation des sources de ce fichier. */
const ACCESSED = '2026-10-22';

const wp = (article: string, path: string, excerpt: string, key = 'intro') =>
  wikipedia(article, path, excerpt, key, ACCESSED);
const wd = (qid: string, label: string, note: string) => wikidata(qid, label, note, ACCESSED);

/**
 * Sportives et aventurières, du début du XXe siècle à aujourd'hui (thématique « sport » de
 * l'onglet Elles). Chaque résumé reprend des faits présents dans les extraits cités (Wikipédia en
 * français, consulté le 2026-10-22) ; dates recoupées avec Wikidata. Statut `draft` : textes non
 * relus par l'équipe éditoriale.
 */
export const sportswomen: CultureEntity[] = [
  {
    id: 'person-alice-milliat',
    kind: 'person',
    domain: 'sport',
    title: 'Alice Milliat',
    hook: 'Elle a fait reconnaître le sport féminin dans le monde',
    subtitle: 'Sportive et dirigeante française',
    period: { label: '1884 – 1957', sortYear: 1884, endYear: 1957 },
    summary:
      'Nageuse, hockeyeuse et rameuse française, Alice Milliat cofonde et préside la Fédération des sociétés féminines sportives de France. Elle milite pour la reconnaissance du sport féminin au niveau international.',
    image: portraits['alice-milliat'],
    links: [],
    sources: [
      wp('Alice Milliat', 'Alice_Milliat', 'est une nageuse, hockeyeuse et rameuse française.'),
      wp(
        'Alice Milliat',
        'Alice_Milliat',
        'Cofondatrice et présidente de la Fédération des sociétés féminines sportives de France, elle a milité pour la reconnaissance du sport féminin au niveau international.',
        'federation',
      ),
      wd('Q2836621', 'Alice Milliat', 'Dates de naissance et de décès.'),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'person-suzanne-lenglen',
    kind: 'person',
    domain: 'sport',
    title: 'Suzanne Lenglen',
    hook: 'La première star internationale du tennis féminin',
    subtitle: 'Joueuse de tennis française',
    period: { label: '1899 – 1938', sortYear: 1899, endYear: 1938 },
    summary:
      'Surnommée « la Divine », Suzanne Lenglen est la première star internationale du tennis féminin. Elle s’impose six fois à Wimbledon et remporte la médaille d’or olympique du simple dames aux Jeux d’Anvers, en 1920. Le deuxième court principal du stade Roland-Garros porte son nom.',
    image: portraits['suzanne-lenglen'],
    links: [],
    sources: [
      wp(
        'Suzanne Lenglen',
        'Suzanne_Lenglen',
        'Surnommée « la Divine », elle fut la première star internationale du tennis féminin.',
      ),
      wp(
        'Suzanne Lenglen',
        'Suzanne_Lenglen',
        "six fois à Wimbledon et remporte la médaille d'or olympique du simple dames aux Jeux d'Anvers 1920.",
        'palmares',
      ),
      wp(
        'Suzanne Lenglen',
        'Suzanne_Lenglen',
        'Le deuxième court principal du stade Roland-Garros porte son nom.',
        'court',
      ),
      wd('Q232831', 'Suzanne Lenglen', 'Dates de naissance et de décès.'),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'person-wilma-rudolph',
    kind: 'person',
    domain: 'sport',
    title: 'Wilma Rudolph',
    hook: 'Trois fois championne olympique à Rome, un élan pour toute une jeunesse',
    subtitle: 'Athlète américaine',
    period: { label: '1940 – 1994', sortYear: 1940, endYear: 1994 },
    summary:
      'Athlète américaine, Wilma Rudolph remporte trois médailles d’or aux Jeux olympiques de Rome, en 1960, sur 100 mètres, 200 mètres et relais 4 × 100 mètres. Elle est encore considérée comme celle ayant « la plus grande influence pour toutes les athlètes noires américaines ».',
    links: [],
    sources: [
      wp(
        'Wilma Rudolph',
        'Wilma_Rudolph',
        "Elle est triple médaille d'or des Jeux olympiques d'été de 1960 à Rome, sur 100, 200 mètres et relais 4 × 100 mètres.",
      ),
      wp(
        'Wilma Rudolph',
        'Wilma_Rudolph',
        'Elle est encore considérée comme celle ayant « la plus grande influence pour toutes les athlètes noires américaines »',
        'influence',
      ),
      wd('Q31083', 'Wilma Rudolph', 'Dates de naissance et de décès.'),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'person-nawal-el-moutawakel',
    kind: 'person',
    domain: 'sport',
    title: 'Nawal El Moutawakel',
    hook: 'Championne du premier 400 mètres haies féminin de l’histoire olympique',
    subtitle: 'Athlète et dirigeante sportive marocaine',
    period: { label: 'née en 1962', sortYear: 1962 },
    summary:
      'Athlète marocaine née à Casablanca, Nawal El Moutawakel remporte à Los Angeles, en 1984, la médaille d’or du premier 400 mètres haies féminin de l’histoire des Jeux olympiques. En 2012, elle est élue vice-présidente du Comité international olympique.',
    links: [],
    sources: [
      wp(
        'Nawal El Moutawakel',
        'Nawal_El_Moutawakel',
        "Elle remporte la médaille d'or du premier 400 mètres haies féminin de l'histoire des Jeux olympiques, à Los Angeles en 1984.",
      ),
      wp(
        'Nawal El Moutawakel',
        'Nawal_El_Moutawakel',
        'En juillet 2012, elle est élue membre du bureau exécutif et vice-présidente du Comité international olympique',
        'cio',
      ),
      wd('Q239993', 'Nawal El Moutawakel', 'Date de naissance.'),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'person-marie-jose-perec',
    kind: 'person',
    domain: 'sport',
    title: 'Marie-José Pérec',
    hook: 'La seule Française triple championne olympique d’athlétisme',
    subtitle: 'Athlète française',
    period: { label: 'née en 1968', sortYear: 1968 },
    summary:
      'Née à Basse-Terre, en Guadeloupe, Marie-José Pérec est la seule Française triple championne olympique d’athlétisme : sur 400 mètres à Barcelone en 1992, puis sur 400 et 200 mètres à Atlanta en 1996. Elle est la première athlète, hommes et femmes confondus, à remporter le 400 mètres lors de deux Jeux olympiques consécutifs.',
    links: [],
    sources: [
      wp(
        'Marie-José Pérec',
        'Marie-José_Pérec',
        "Elle est la seule Française triple championne olympique d'athlétisme : en 1992 aux Jeux de Barcelone (sur 400 mètres) et deux fois aux Jeux d'Atlanta en 1996 (sur 400 mètres et 200 mètres).",
      ),
      wp(
        'Marie-José Pérec',
        'Marie-José_Pérec',
        'la première athlète, hommes et femmes confondus, à avoir remporté, lors de deux Jeux olympiques consécutifs, le titre sur 400 mètres.',
        'record',
      ),
      wd('Q228808', 'Marie-José Pérec', 'Date de naissance.'),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'person-serena-williams',
    kind: 'person',
    domain: 'sport',
    title: 'Serena Williams',
    hook: 'Trente-neuf titres du Grand Chelem : elle a tout gagné',
    subtitle: 'Joueuse de tennis américaine',
    period: { label: 'née en 1981', sortYear: 1981 },
    summary:
      'Considérée comme l’une des plus grandes joueuses de tous les temps, Serena Williams remporte 39 titres du Grand Chelem en simple et en double. Elle est la première joueuse de l’histoire à avoir tout gagné en carrière, tournois du Grand Chelem et Jeux olympiques, en simple comme en double.',
    links: [],
    sources: [
      wp(
        'Serena Williams',
        'Serena_Williams',
        "Considérée comme l'une des plus grandes joueuses de tous les temps, elle a remporté 39 titres du Grand Chelem en simple et en double",
      ),
      wp(
        'Serena Williams',
        'Serena_Williams',
        "la première joueuse de l'histoire à avoir tout gagné en carrière, tournois du Grand Chelem et Jeux olympiques, en simple comme en double.",
        'carriere',
      ),
      wd('Q11459', 'Serena Williams', 'Date de naissance.'),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'person-simone-biles',
    kind: 'person',
    domain: 'sport',
    title: 'Simone Biles',
    hook: 'La gymnaste la plus médaillée de l’histoire',
    subtitle: 'Gymnaste artistique américaine',
    period: { label: 'née en 1997', sortYear: 1997 },
    summary:
      'Gymnaste artistique américaine, Simone Biles est la gymnaste la plus médaillée de l’histoire, avec 41 médailles dans les événements mondiaux. Aux Jeux de Tokyo, victime d’une perte de repères spatiaux imputée au stress, elle abandonne en pleine finale. Elle revient au plus haut niveau en 2023, puis remporte trois titres olympiques à Paris, en 2024.',
    links: [],
    sources: [
      wp(
        'Simone Biles',
        'Simone_Biles',
        "Elle est la gymnaste la plus médaillée de l'histoire avec 41 médailles dans les événements mondiaux",
      ),
      wp(
        'Simone Biles',
        'Simone_Biles',
        'elle y est victime de perte de repères spatiaux (ou perte de figures) imputée au stress. Elle abandonne en pleine finale du concours général par équipe',
        'tokyo',
      ),
      wp(
        'Simone Biles',
        'Simone_Biles',
        'Elle revient au plus haut niveau en 2023. Aux Jeux olympiques de Paris 2024, elle remporte quatre médailles dont trois en or',
        'retour',
      ),
      wd('Q7520267', 'Simone Biles', 'Date de naissance.'),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'person-megan-rapinoe',
    kind: 'person',
    domain: 'sport',
    title: 'Megan Rapinoe',
    hook: 'Ballon d’or de la Coupe du monde 2019, meilleure joueuse de la FIFA',
    subtitle: 'Footballeuse américaine',
    period: { label: 'née en 1985', sortYear: 1985 },
    summary:
      'Attaquante de l’équipe nationale des États-Unis, Megan Rapinoe remporte la médaille d’or olympique à Londres en 2012, puis les Coupes du monde 2015 et 2019. En 2019, elle reçoit le Soulier d’or et le Ballon d’or de la Coupe du monde, et elle est nommée meilleure joueuse de la FIFA.',
    links: [],
    sources: [
      wp(
        'Megan Rapinoe',
        'Megan_Rapinoe',
        'Rapinoe a remporté la médaille d’or avec l’équipe nationale aux Jeux Olympiques d’été de Londres de 2012, à la Coupe du monde féminine de la FIFA 2015 et à la Coupe du monde féminine de la FIFA 2019.',
        'palmares',
      ),
      wp(
        'Megan Rapinoe',
        'Megan_Rapinoe',
        'Gagnante du Soulier d’or féminin et du Ballon d’or féminin lors de la Coupe du monde féminine de la FIFA 2019 en France et nommée Meilleure Joueuse de la FIFA en 2019',
        'ballon-or',
      ),
      wd('Q260725', 'Megan Rapinoe', 'Date de naissance.'),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'person-junko-tabei',
    kind: 'person',
    domain: 'sport',
    title: 'Junko Tabei',
    hook: 'Au sommet de l’Everest, avant toutes les autres femmes',
    subtitle: 'Alpiniste japonaise',
    period: { label: '1939 – 2016', sortYear: 1939, endYear: 2016 },
    summary:
      'Alpiniste japonaise, Junko Tabei est la première femme à atteindre le sommet de l’Everest, le 16 mai 1975.',
    links: [],
    sources: [
      wp(
        'Junko Tabei',
        'Junko_Tabei',
        "Elle fut la première femme à atteindre le sommet de l'Everest le 16 mai 1975.",
      ),
      wd('Q234491', 'Junko Tabei', 'Dates de naissance et de décès.'),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'person-marta',
    kind: 'person',
    domain: 'sport',
    title: 'Marta',
    hook: 'Six fois meilleure footballeuse de l’année',
    subtitle: 'Footballeuse brésilienne',
    period: { label: 'née en 1986', sortYear: 1986 },
    summary:
      'Footballeuse internationale brésilienne, attaquante, Marta Vieira da Silva a été sacrée six fois meilleure footballeuse de l’année par la FIFA. Elle est considérée comme la meilleure joueuse de tous les temps.',
    links: [],
    sources: [
      wp(
        'Marta (football)',
        'Marta_(football)',
        "Elle a été sacrée six fois meilleure footballeuse de l'année par la FIFA en 2006, 2007, 2008, 2009, 2010 et 2018. Elle est considérée comme la meilleure joueuse de tous les temps.",
      ),
      wd('Q228616', 'Marta', 'Date de naissance.'),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
];
