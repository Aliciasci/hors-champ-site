import type { CultureEntity } from '@/types';

import { portraits } from '../portraits';
import { wikidata, wikipedia } from './sources';

/** Date de consultation des sources de ce fichier. */
const ACCESSED = '2026-10-22';

const wp = (article: string, path: string, excerpt: string, key = 'intro') =>
  wikipedia(article, path, excerpt, key, ACCESSED);
const wd = (qid: string, label: string, note: string) => wikidata(qid, label, note, ACCESSED);

/**
 * Femmes qui marquent le XXIe siècle : climat, sciences, économie, littérature, cinéma, musique.
 * Chaque résumé reprend des faits présents dans les extraits cités (Wikipédia en français,
 * consulté le 2026-10-22) ; dates recoupées avec Wikidata. Statut `draft` : textes non relus par
 * l'équipe éditoriale.
 */
export const twentyFirstCentury: CultureEntity[] = [
  {
    id: 'person-greta-thunberg',
    kind: 'person',
    domain: 'droits',
    title: 'Greta Thunberg',
    hook: 'À quinze ans, une grève scolaire pour le climat devenue mondiale',
    subtitle: 'Militante écologiste suédoise',
    period: { label: 'née en 2003', sortYear: 2003 },
    summary:
      'Militante suédoise engagée contre le réchauffement climatique, Greta Thunberg manifeste durant l’été 2018 devant le Parlement suédois, à 15 ans, contre l’inaction face au changement climatique. En novembre 2018, elle lance la grève scolaire pour le climat, un mouvement qui se propage dans le monde entier.',
    links: [],
    sources: [
      wp(
        'Greta Thunberg',
        'Greta_Thunberg',
        "Elle manifeste durant l'été 2018 devant le Parlement suédois, à l'âge de 15 ans, contre l'inaction face au changement climatique.",
      ),
      wp(
        'Greta Thunberg',
        'Greta_Thunberg',
        'En novembre 2018, elle lance la grève scolaire pour le climat (Skolstrejk för klimatet)',
        'greve',
      ),
      wp(
        'Greta Thunberg',
        'Greta_Thunberg',
        'Le mouvement se propage dans le monde entier',
        'monde',
      ),
      wd('Q56434717', 'Greta Thunberg', 'Date de naissance.'),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'person-jennifer-doudna',
    kind: 'person',
    domain: 'sciences',
    title: 'Jennifer Doudna',
    hook: 'Avec Emmanuelle Charpentier, Nobel de chimie 2020',
    subtitle: 'Biochimiste américaine',
    period: { label: 'née en 1964', sortYear: 1964 },
    summary:
      'Professeure américaine de biochimie et de biologie moléculaire à l’université de Californie à Berkeley, spécialiste de l’ARN, Jennifer Doudna reçoit le prix Nobel de chimie 2020 conjointement avec Emmanuelle Charpentier.',
    links: [],
    sources: [
      wp(
        'Jennifer Doudna',
        'Jennifer_Doudna',
        "est une professeure américaine de biochimie et de biologie moléculaire à l'université de Californie à Berkeley.",
      ),
      wp(
        'Jennifer Doudna',
        'Jennifer_Doudna',
        'Elle reçoit le prix Nobel de chimie 2020 conjointement avec Emmanuelle Charpentier.',
        'nobel',
      ),
      wd('Q56068', 'Jennifer Doudna', 'Date de naissance.'),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'person-maryam-mirzakhani',
    kind: 'person',
    domain: 'sciences',
    title: 'Maryam Mirzakhani',
    hook: 'La médaille Fields, décernée pour la première fois à une femme',
    subtitle: 'Mathématicienne iranienne',
    period: { label: '1977 – 2017', sortYear: 1977, endYear: 2017 },
    summary:
      'Mathématicienne iranienne, professeure à l’université Stanford, Maryam Mirzakhani est connue pour ses travaux en topologie et en géométrie. Le 13 août 2014, elle devient la première femme, et la première personne de nationalité iranienne, lauréate de la médaille Fields.',
    links: [],
    sources: [
      wp(
        'Maryam Mirzakhani',
        'Maryam_Mirzakhani',
        'connue pour ses travaux en topologie et en géométrie (notamment en géométrie des surfaces de Riemann) et la première femme et aussi première personne de nationalité iranienne lauréate de la médaille Fields (13 août 2014).',
      ),
      wd('Q1771279', 'Maryam Mirzakhani', 'Dates de naissance et de décès.'),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'person-andrea-ghez',
    kind: 'person',
    domain: 'sciences',
    title: 'Andrea Ghez',
    hook: 'Un objet supermassif au cœur de notre galaxie, et un Nobel de physique',
    subtitle: 'Astronome américaine',
    period: { label: 'née en 1965', sortYear: 1965 },
    summary:
      'Astronome américaine, professeure à l’Université de Californie à Los Angeles, Andrea Ghez reçoit en 2020 le prix Nobel de physique, avec Reinhard Genzel et Roger Penrose, pour « la découverte d’un objet compact supermassif au centre de notre galaxie ».',
    links: [],
    sources: [
      wp(
        'Andrea M. Ghez',
        'Andrea_M._Ghez',
        "est une astronome et universitaire américaine, professeure au département de physique et d'astronomie de l'Université de Californie à Los Angeles (UCLA).",
      ),
      wp(
        'Andrea M. Ghez',
        'Andrea_M._Ghez',
        "En 2020, elle reçoit le prix Nobel de physique, conjointement avec Reinhard Genzel et Roger Penrose, pour « la découverte d'un objet compact supermassif au centre de notre galaxie »",
        'nobel',
      ),
      wd('Q493956', 'Andrea Ghez', 'Date de naissance.'),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'person-claudia-goldin',
    kind: 'person',
    domain: 'sciences',
    title: 'Claudia Goldin',
    hook: 'Nobel d’économie pour ses recherches sur les femmes au travail',
    subtitle: 'Économiste américaine',
    period: { label: 'née en 1946', sortYear: 1946 },
    summary:
      'Économiste américaine, professeure à l’université Harvard, Claudia Goldin est connue pour ses travaux sur la main-d’œuvre féminine et l’inégalité de salaire entre les hommes et les femmes. Elle est lauréate en 2023 du prix dit Nobel d’économie pour ses recherches empiriques sur la situation des femmes sur le marché du travail.',
    links: [],
    sources: [
      wp(
        'Claudia Goldin',
        'Claudia_Goldin',
        "principalement connue pour ses travaux sur la main-d'œuvre féminine, l'économie du travail, les inégalités de revenus, l'éducation, l'enseignement supérieur et l'inégalité de salaire entre les hommes et les femmes.",
      ),
      wp(
        'Claudia Goldin',
        'Claudia_Goldin',
        "Elle est lauréate en 2023 du prix dit Nobel d'économie pour ses recherches empiriques sur la situation des femmes sur le marché du travail.",
        'nobel',
      ),
      wd('Q1097475', 'Claudia Goldin', 'Date de naissance.'),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'person-fei-fei-li',
    kind: 'person',
    domain: 'sciences',
    title: 'Fei-Fei Li',
    hook: 'ImageNet, pour apprendre aux machines à voir',
    subtitle: 'Informaticienne américaine',
    period: { label: 'née en 1976', sortYear: 1976 },
    summary:
      'Informaticienne américaine spécialiste de la vision artificielle, professeure à l’université Stanford, Fei-Fei Li est la principale instigatrice de la base d’images ImageNet. En 2017, elle cofonde AI4ALL, pour augmenter la diversité et l’inclusion dans le domaine de l’intelligence artificielle.',
    links: [],
    sources: [
      wp(
        'Fei-Fei Li',
        'Fei-Fei_Li',
        'est une informaticienne et chercheuse américaine spécialiste de la vision artificielle.',
      ),
      wp(
        'Fei-Fei Li',
        'Fei-Fei_Li',
        "Elle est la principale instigatrice de la base d'images ImageNet.",
        'imagenet',
      ),
      wp(
        'Fei-Fei Li',
        'Fei-Fei_Li',
        "En 2017, elle co-fonde AI4ALL (Intelligence artificielle pour tous), pour augmenter la diversité et l'inclusion dans le domaine de l'IA.",
        'ai4all',
      ),
      wd('Q18686107', 'Fei-Fei Li', 'Date de naissance.'),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'person-chimamanda-ngozi-adichie',
    kind: 'person',
    domain: 'arts',
    title: 'Chimamanda Ngozi Adichie',
    hook: 'Romancière et voix féministe venue du Nigeria',
    subtitle: 'Écrivaine nigériane',
    period: { label: 'née en 1977', sortYear: 1977 },
    summary:
      'Écrivaine nigériane, Chimamanda Ngozi Adichie publie des romans et des essais qui rencontrent un important succès critique à partir de 2003. Elle est également connue en tant que militante féministe.',
    links: [],
    sources: [
      wp(
        'Chimamanda Ngozi Adichie',
        'Chimamanda_Ngozi_Adichie',
        'Elle y publie des ouvrages, romans et essais, qui rencontrent un important succès critique à partir de 2003',
      ),
      wp(
        'Chimamanda Ngozi Adichie',
        'Chimamanda_Ngozi_Adichie',
        'Elle est également connue en tant que militante féministe.',
        'feministe',
      ),
      wd('Q230141', 'Chimamanda Ngozi Adichie', 'Date de naissance.'),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'person-kathryn-bigelow',
    kind: 'person',
    domain: 'arts',
    title: 'Kathryn Bigelow',
    hook: 'Oscar du meilleur réalisateur : la première femme à le recevoir',
    subtitle: 'Réalisatrice américaine',
    period: { label: 'née en 1951', sortYear: 1951 },
    summary:
      'Réalisatrice, scénariste et productrice américaine, Kathryn Bigelow signe notamment Point Break, Démineurs et Zero Dark Thirty. En 2010, elle devient la première femme cinéaste à recevoir l’Oscar du meilleur réalisateur, pour Démineurs.',
    links: [],
    sources: [
      wp(
        'Kathryn Bigelow',
        'Kathryn_Bigelow',
        'Elle est notamment connue pour avoir réalisé les films Point Break (1991), Strange Days (1995), Démineurs (2008) et Zero Dark Thirty (2012).',
      ),
      wp(
        'Kathryn Bigelow',
        'Kathryn_Bigelow',
        "En 2010, elle devient la première femme cinéaste à recevoir l'Oscar du meilleur réalisateur, pour son film Démineurs.",
        'oscar',
      ),
      wd('Q34816', 'Kathryn Bigelow', 'Date de naissance.'),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'person-beyonce',
    kind: 'person',
    domain: 'arts',
    title: 'Beyoncé',
    hook: 'L’une des figures musicales les plus influentes du XXIe siècle',
    subtitle: 'Chanteuse et autrice-compositrice américaine',
    period: { label: 'née en 1981', sortYear: 1981 },
    summary:
      'Chanteuse, autrice-compositrice-interprète, danseuse et productrice américaine, Beyoncé est reconnue pour ses capacités vocales, sa réinvention artistique et ses performances scéniques. Elle est largement considérée comme l’une des figures culturelles et musicales les plus influentes du XXIe siècle.',
    links: [],
    sources: [
      wp(
        'Beyoncé',
        'Beyoncé',
        "Reconnue pour ses capacités vocales, sa réinvention artistique et ses performances scéniques, Beyoncé est largement considérée comme l'une des figures culturelles et musicales les plus influentes du XXIe siècle.",
      ),
      wd('Q36153', 'Beyoncé', 'Date de naissance.'),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'person-han-kang',
    kind: 'person',
    domain: 'arts',
    title: 'Han Kang',
    hook: 'Nobel de littérature 2024, une prose face aux traumatismes de l’histoire',
    subtitle: 'Romancière sud-coréenne',
    period: { label: 'née en 1970', sortYear: 1970 },
    summary:
      'Romancière sud-coréenne, Han Kang reçoit le prix Nobel de littérature en 2024 « pour la profondeur de sa prose poétique qui s’oppose aux traumatismes de l’histoire et révèle la fragilité de la vie humaine ». Ses héroïnes sont souvent des femmes dont la confrontation avec la société révèle la vulnérabilité et aussi la révolte, comme dans La Végétarienne.',
    links: [],
    sources: [
      wp(
        'Han Kang',
        'Han_Kang',
        "Elle reçoit le prix Nobel de littérature en 2024 « pour la profondeur de sa prose poétique qui s'oppose aux traumatismes de l'histoire et révèle la fragilité de la vie humaine ».",
      ),
      wp(
        'Han Kang',
        'Han_Kang',
        "Les protagonistes de ses romans sont souvent des femmes dont la confrontation avec l'entourage ou avec la société révèle la vulnérabilité et aussi la révolte, comme dans La Végétarienne (2007)",
        'heroines',
      ),
      wd('Q5646626', 'Han Kang', 'Date de naissance.'),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'person-ngozi-okonjo-iweala',
    kind: 'person',
    domain: 'droits',
    title: 'Ngozi Okonjo-Iweala',
    hook: 'Des Finances du Nigeria à la tête de l’Organisation mondiale du commerce',
    subtitle: 'Femme politique et économiste nigériane',
    period: { label: 'née en 1954', sortYear: 1954 },
    summary:
      'Ministre des Finances du Nigeria de 2003 à 2006 et de 2011 à 2015, Ngozi Okonjo-Iweala s’attelle à réduire la corruption et la dette publique. En 2021, elle devient directrice générale de l’Organisation mondiale du commerce.',
    image: portraits['ngozi-okonjo-iweala'],
    links: [],
    sources: [
      wp(
        'Ngozi Okonjo-Iweala',
        'Ngozi_Okonjo-Iweala',
        "Ministre des Finances du Nigeria de 2003 à 2006 et de 2011 à 2015, elle s'attelle à réduire la corruption et la dette publique.",
      ),
      wp(
        'Ngozi Okonjo-Iweala',
        'Ngozi_Okonjo-Iweala',
        "En 2021, elle devient directrice générale de l'Organisation mondiale du commerce.",
        'omc',
      ),
      wd('Q289350', 'Ngozi Okonjo-Iweala', 'Date de naissance.'),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
];
