import type { CultureEntity } from '@/types';

import { portraits } from '../portraits';
import { wikidata, wikipedia } from './sources';

/** Date de consultation des sources de ce fichier. */
const ACCESSED = '2026-10-14';

const wp = (article: string, path: string, excerpt: string, key = 'intro') =>
  wikipedia(article, path, excerpt, key, ACCESSED);
const wd = (qid: string, label: string, note: string) => wikidata(qid, label, note, ACCESSED);

/**
 * Femmes de notre époque, du XXe siècle à aujourd'hui. Chaque résumé reprend des faits présents
 * dans les extraits cités (Wikipédia en français, consulté le 2026-10-14) ; dates recoupées avec
 * Wikidata. Statut `draft` : textes non relus par l'équipe éditoriale.
 */
export const contemporaries: CultureEntity[] = [
  {
    id: 'person-wangari-maathai',
    kind: 'person',
    domain: 'droits',
    title: 'Wangari Maathai',
    hook: 'La femme qui plantait des arbres, première Africaine prix Nobel de la paix',
    subtitle: 'Biologiste et militante écologiste kényane',
    period: { label: '1940 – 2011', sortYear: 1940, endYear: 2011 },
    summary:
      'Biologiste et militante écologiste kényane, Wangari Maathai fonde en 1977 le Mouvement de la ceinture verte, avec les femmes des villages, contre la déforestation et l’érosion des sols. En 2004, elle devient la première femme africaine à recevoir le prix Nobel de la paix.',
    links: [],
    sources: [
      wp(
        'Wangari Muta Maathai',
        'Wangari_Muta_Maathai',
        'Le 8 octobre 2004, elle reçoit le prix Nobel de la paix pour « sa contribution en faveur du développement durable, de la démocratie et de la paix » à la suite de son engagement contre la déforestation du Kenya. Elle est la première femme africaine à recevoir cette distinction.',
      ),
      wp(
        'Wangari Muta Maathai',
        'Wangari_Muta_Maathai',
        "Wangari Maathai fonde en 1977 le Mouvement de la ceinture verte (Green Belt Movement), en réaction au phénomène de déforestation et d'érosion des sols, et en étroite collaboration avec les femmes des villages kényans.",
        'ceinture-verte',
      ),
      wd('Q46795', 'Wangari Maathai', 'Dates et lieux de naissance et de mort.'),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'person-tu-youyou',
    kind: 'person',
    domain: 'sciences',
    title: 'Tu Youyou',
    hook: 'A identifié l’artémisinine, le remède le plus efficace contre le paludisme',
    subtitle: 'Chercheuse en pharmacie chinoise',
    period: { label: 'née en 1930', sortYear: 1930 },
    summary:
      'Chercheuse en pharmacie chinoise, Tu Youyou identifie en 1972, avec son équipe, l’artémisinine, aujourd’hui considérée comme le remède le plus efficace contre le paludisme. En 2015, elle reçoit le prix Nobel de physiologie ou médecine pour ces recherches.',
    links: [],
    sources: [
      wp(
        'Tu Youyou',
        'Tu_Youyou',
        'En 2015, elle est lauréate du prix Nobel de physiologie ou médecine pour ses travaux de recherche contre le paludisme',
      ),
      wp(
        'Tu Youyou',
        'Tu_Youyou',
        "Il s'agit de la plante à l'origine de l'artémisinine (qing hao su (青蒿素)), identifiée en 1972 par Tu Youyou et son équipe.",
        'artemisinine',
      ),
      wp(
        'Tu Youyou',
        'Tu_Youyou',
        "est aujourd'hui considéré comme le remède antipaludique le plus efficace.",
        'remede',
      ),
      wd('Q462843', 'Tu Youyou', 'Date et lieu de naissance.'),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'person-toni-morrison',
    kind: 'person',
    domain: 'arts',
    title: 'Toni Morrison',
    hook: 'Première Afro-Américaine prix Nobel de littérature',
    subtitle: 'Romancière américaine',
    period: { label: '1931 – 2019', sortYear: 1931, endYear: 2019 },
    summary:
      'Romancière, essayiste et professeure de littérature américaine, Toni Morrison reçoit le prix Pulitzer en 1988, puis le prix Nobel de littérature en 1993 : elle est la huitième femme et la première Afro-Américaine à l’obtenir.',
    image: portraits['toni-morrison'],
    links: [],
    sources: [
      wp(
        'Toni Morrison',
        'Toni_Morrison',
        'Elle est lauréate du prix Pulitzer en 1988 et du prix Nobel de littérature en 1993 pour lequel elle est la huitième femme et la première Afro-Américaine à avoir reçu cette distinction.',
      ),
      wd('Q72334', 'Toni Morrison', 'Dates et lieux de naissance et de mort.'),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'person-zaha-hadid',
    kind: 'person',
    domain: 'arts',
    title: 'Zaha Hadid',
    hook: 'Le prix Pritzker d’architecture, décerné pour la première fois à une femme',
    subtitle: 'Architecte irako-britannique',
    period: { label: '1950 – 2016', sortYear: 1950, endYear: 2016 },
    summary:
      'Architecte et urbaniste irako-britannique, figure du déconstructivisme, Zaha Hadid passe des angles vifs aux courbes et conçoit notamment l’Aquatics Centre des Jeux olympiques de Londres et l’opéra de Canton. En 2004, elle est la première femme à recevoir le prix Pritzker.',
    links: [],
    sources: [
      wp(
        'Zaha Hadid',
        'Zaha_Hadid',
        "Figure importante du courant déconstructiviste, elle est l'une des femmes architectes les plus récompensées par la profession.",
      ),
      wp(
        'Zaha Hadid',
        'Zaha_Hadid',
        "Si, au début de sa carrière, ses bâtiments se caractérisent par des formes éclatées aux angles vifs, les édifices plus récents sont formés par des courbes. Ses œuvres majeures comprennent l'Aquatics Centre de Londres pour les Jeux olympiques de 2012, le Broad Art Museum (East Lansing, États-Unis), le MAXXI - Musée national des Arts du XXIe siècle de Rome et l'opéra de Canton (Chine).",
        'oeuvres',
      ),
      wp(
        'Zaha Hadid',
        'Zaha_Hadid',
        "L'année suivante, en 2004, Zaha Hadid reçoit le prix Pritzker. C'est là aussi une première puisqu'elle est la première femme à obtenir cette récompense.",
        'pritzker',
      ),
      wd('Q47780', 'Zaha Hadid', 'Dates et lieux de naissance et de mort.'),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'person-ellen-johnson-sirleaf',
    kind: 'person',
    domain: 'droits',
    title: 'Ellen Johnson Sirleaf',
    hook: 'Élue présidente du Liberia, une première pour une femme en Afrique',
    subtitle: 'Femme d’État libérienne',
    period: { label: 'née en 1938', sortYear: 1938 },
    summary:
      'Économiste formée aux États-Unis, Ellen Johnson Sirleaf préside le Liberia de 2006 à 2018. Elle est la première femme élue au suffrage universel à la tête d’un État africain, et reçoit en 2011 le prix Nobel de la paix.',
    image: portraits['ellen-johnson-sirleaf'],
    links: [],
    sources: [
      wp(
        'Ellen Johnson Sirleaf',
        'Ellen_Johnson_Sirleaf',
        "Économiste formée aux États-Unis, elle est la première femme élue au suffrage universel à la tête d'un État africain.",
      ),
      wp(
        'Ellen Johnson Sirleaf',
        'Ellen_Johnson_Sirleaf',
        'présidente de la République du 16 janvier 2006 au 22 janvier 2018.',
        'presidence',
      ),
      wp(
        'Ellen Johnson Sirleaf',
        'Ellen_Johnson_Sirleaf',
        'Elle est corécipiendaire du prix Nobel de la paix en 2011.',
        'nobel',
      ),
      wd('Q43179', 'Ellen Johnson Sirleaf', 'Date et lieu de naissance.'),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'person-malala-yousafzai',
    kind: 'person',
    domain: 'droits',
    title: 'Malala Yousafzai',
    hook: 'Plus jeune lauréate du prix Nobel de la paix, pour l’école des filles',
    subtitle: 'Militante pakistanaise des droits des femmes',
    period: { label: 'née en 1997', sortYear: 1997 },
    summary:
      'Militante pakistanaise, Malala Yousafzai défend la scolarisation des filles contre les talibans pakistanais qui veulent l’interdire. En 2012, à 15 ans, elle survit à une tentative d’assassinat. En 2014, à 17 ans, elle devient la plus jeune lauréate de l’histoire du prix Nobel de la paix.',
    image: portraits['malala-yousafzai'],
    links: [],
    sources: [
      wp(
        'Malala Yousafzai',
        'Malala_Yousafzai',
        "Elle s'oppose au Tehrik-e-Taliban Pakistan et au Tehrik-e-Nifaz-e-Shariat-e-Mohammadi qui tentent d'interdire la scolarisation des filles.",
      ),
      wp(
        'Malala Yousafzai',
        'Malala_Yousafzai',
        "Le 9 octobre 2012, âgée de 15 ans, elle est victime d'une tentative d'assassinat en rentrant chez elle",
        'attentat',
      ),
      wp(
        'Malala Yousafzai',
        'Malala_Yousafzai',
        "En 2014, âgée de dix-sept ans, elle obtient le prix Nobel de la paix avec l'Indien Kailash Satyarthi, ce qui fait d'elle la plus jeune lauréate de l'histoire de ce prix.",
        'nobel',
      ),
      wd('Q32732', 'Malala Yousafzai', 'Date et lieu de naissance.'),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'person-katalin-kariko',
    kind: 'person',
    domain: 'sciences',
    title: 'Katalin Karikó',
    hook: 'Ses recherches sur l’ARN messager ont ouvert la voie à de nouveaux vaccins',
    subtitle: 'Biochimiste hongro-américaine',
    period: { label: 'née en 1955', sortYear: 1955 },
    summary:
      'Biochimiste hongro-américaine, Katalin Karikó travaille sur l’ARN messager depuis le début des années 1990. Ses recherches ont joué un rôle déterminant dans la création de vaccins d’un nouveau type, dont celui de Pfizer-BioNTech contre le Covid-19. Elle reçoit le prix Nobel de physiologie ou médecine en 2023.',
    links: [],
    sources: [
      wp(
        'Katalin Karikó',
        'Katalin_Karikó',
        "Ses recherches sur l'ARN messager, poursuivies depuis le début des années 1990, ont joué un rôle déterminant pour permettre l'utilisation de celui-ci dans la création de vaccins d'un nouveau type, approche qui se concrétise avec la recherche contre la pandémie de Covid-19, et notamment la création du vaccin Comirnaty de Pfizer-BioNTech.",
      ),
      wp(
        'Katalin Karikó',
        'Katalin_Karikó',
        'reçoit le prix Nobel de physiologie ou médecine en 2023, conjointement avec Drew Weissman.',
        'nobel',
      ),
      wd('Q88608397', 'Katalin Karikó', 'Date et lieu de naissance.'),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'person-emmanuelle-charpentier',
    kind: 'person',
    domain: 'sciences',
    title: 'Emmanuelle Charpentier',
    hook: 'A inventé avec Jennifer Doudna la technique CRISPR-Cas9',
    subtitle: 'Microbiologiste et généticienne française',
    period: { label: 'née en 1968', sortYear: 1968 },
    summary:
      'Microbiologiste, généticienne et biochimiste française, Emmanuelle Charpentier déchiffre les mécanismes du système immunitaire bactérien CRISPR-Cas9 et en tire, avec Jennifer Doudna, une technique qui révolutionne l’ingénierie génétique. Toutes deux reçoivent le prix Nobel de chimie 2020.',
    links: [],
    sources: [
      wp(
        'Emmanuelle Charpentier',
        'Emmanuelle_Charpentier',
        'est une microbiologiste, généticienne et biochimiste française, prix Nobel de chimie 2020 avec Jennifer Doudna.',
      ),
      wp(
        'Emmanuelle Charpentier',
        'Emmanuelle_Charpentier',
        'Emmanuelle Charpentier a établi sa renommée mondiale en identifiant et en déchiffrant les mécanismes moléculaires du système immunitaire bactérien CRISPR/Cas9.',
        'crispr',
      ),
      wp(
        'Emmanuelle Charpentier',
        'Emmanuelle_Charpentier',
        "Elle a aussi inventé la technique de CRISPR/Cas9 en collaboration avec Jennifer Doudna qui a révolutionné le domaine de l'ingénierie génétique.",
        'invention',
      ),
      wd('Q17280087', 'Emmanuelle Charpentier', 'Date et lieu de naissance.'),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'person-agnes-varda',
    kind: 'person',
    domain: 'arts',
    title: 'Agnès Varda',
    hook: 'Cinéaste de Cléo de 5 à 7, signataire du manifeste des 343',
    subtitle: 'Cinéaste, photographe et plasticienne franco-belge',
    period: { label: '1928 – 2019', sortYear: 1928, endYear: 2019 },
    summary:
      'Cinéaste, photographe et plasticienne franco-belge, Agnès Varda se fait connaître avec La Pointe courte (1955) et Cléo de 5 à 7 (1962). Signataire du manifeste des 343, elle tourne en 1977 le film féministe L’une chante, l’autre pas. Son œuvre reçoit une Palme d’honneur à Cannes en 2015 et un Oscar d’honneur en 2017.',
    links: [],
    sources: [
      wp(
        'Agnès Varda',
        'Agnès_Varda',
        'Agnès Varda signe la réalisation de films notables comme La Pointe courte en 1955 et Cléo de 5 à 7 en 1962, qui la rendent célèbre.',
      ),
      wp(
        'Agnès Varda',
        'Agnès_Varda',
        "elle manifeste pour le droit à l'IVG en 1972, un an après avoir signé le manifeste des 343",
        'manifeste-343',
      ),
      wp(
        'Agnès Varda',
        'Agnès_Varda',
        "cette idée se concrétise cependant dans son film féministe et optimiste L'une chante, l'autre pas, sorti en 1977.",
        'lune-chante',
      ),
      wp(
        'Agnès Varda',
        'Agnès_Varda',
        "par une Palme d'honneur au Festival de Cannes 2015, par un Oscar d'honneur reçu en 2017",
        'distinctions',
      ),
      wd('Q229990', 'Agnès Varda', 'Dates et lieux de naissance et de mort.'),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'person-ruth-bader-ginsburg',
    kind: 'person',
    domain: 'droits',
    title: 'Ruth Bader Ginsburg',
    hook: 'A plaidé contre les discriminations sexistes jusqu’à la Cour suprême',
    subtitle: 'Juriste et juge américaine',
    period: { label: '1933 – 2020', sortYear: 1933, endYear: 2020 },
    summary:
      'Avocate et juriste américaine, Ruth Bader Ginsburg cofonde en 1972 le Women’s Rights Project, qui travaille sur plus de 300 cas de discriminations sexistes, et plaide six affaires de discrimination devant la Cour suprême entre 1973 et 1976. Elle y siège ensuite de 1993 à 2020, deuxième femme nommée à cette juridiction.',
    image: portraits['ruth-bader-ginsburg'],
    links: [],
    sources: [
      wp(
        'Ruth Bader Ginsburg',
        'Ruth_Bader_Ginsburg',
        'Membre de la Cour suprême des États-Unis de 1993 à 2020, elle est la deuxième femme nommée à la plus haute juridiction fédérale.',
      ),
      wp(
        'Ruth Bader Ginsburg',
        'Ruth_Bader_Ginsburg',
        "En 1972, Ginsburg cofonde le Women's Rights Project dans les locaux d'une association appelée Union américaine pour les libertés civiles.",
        'womens-rights-project',
      ),
      wp(
        'Ruth Bader Ginsburg',
        'Ruth_Bader_Ginsburg',
        "Le Women's Rights Project travaille sur plus de 300 cas de discriminations sexistes.",
        'discriminations',
      ),
      wp(
        'Ruth Bader Ginsburg',
        'Ruth_Bader_Ginsburg',
        'Ginsburg fait valoir six cas de discrimination devant la Cour suprême des États-Unis entre 1973 et 1976.',
        'plaidoiries',
      ),
      wd('Q11116', 'Ruth Bader Ginsburg', 'Dates et lieux de naissance et de mort.'),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'person-mae-jemison',
    kind: 'person',
    domain: 'sciences',
    title: 'Mae Jemison',
    hook: 'Première femme afro-américaine à aller dans l’espace',
    subtitle: 'Ingénieure, médecin et astronaute américaine',
    period: { label: 'née en 1956', sortYear: 1956 },
    summary:
      'Ingénieure en génie chimique et médecin, Mae Jemison rejoint la NASA en 1987. Du 12 au 20 septembre 1992, à bord de la navette Endeavour, elle devient la première femme afro-américaine à aller dans l’espace.',
    image: portraits['mae-jemison'],
    links: [],
    sources: [
      wp(
        'Mae Jemison',
        'Mae_Jemison',
        "Elle est notamment connue pour être la première femme afro-américaine à aller dans l'espace en tant que spécialiste de mission à bord de la navette spatiale Endeavour.",
      ),
      wp(
        'Mae Jemison',
        'Mae_Jemison',
        "Mae Jemison rejoint la NASA après sa sélection dans le groupe d'astronautes 12 en 1987 et est choisie pour participer à la mission STS-47, durant laquelle elle tourne autour de la Terre pendant huit jours du 12 au 20 septembre 1992.",
        'sts-47',
      ),
      wp(
        'Mae Jemison',
        'Mae_Jemison',
        "Mae Jemison est diplômée en génie chimique et en africanisme et African-American studies à l'université Stanford. Elle obtient ensuite son diplôme de médecin au Weill Medical College",
        'formation',
      ),
      wd('Q34091', 'Mae Jemison', 'Date et lieu de naissance.'),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'person-jane-goodall',
    kind: 'person',
    domain: 'sciences',
    title: 'Jane Goodall',
    hook: 'A découvert que les chimpanzés utilisent des outils',
    subtitle: 'Éthologue et primatologue britannique',
    period: { label: '1934 – 2025', sortYear: 1934, endYear: 2025 },
    summary:
      'Éthologue et primatologue britannique, Jane Goodall est la première scientifique à observer et rapporter que les chimpanzés utilisent des outils pour s’alimenter. Ses travaux transforment la compréhension des rapports entre les humains et les autres animaux. En 1977, elle fonde le Jane Goodall Institute.',
    image: portraits['jane-goodall'],
    links: [],
    sources: [
      wp(
        'Jane Goodall',
        'Jane_Goodall',
        "Elle est la première scientifique à avoir observé et rapporté que les chimpanzés utilisent des outils pour s'alimenter. Ses travaux transforment profondément la compréhension des rapports entre les êtres humains et les autres animaux.",
      ),
      wp(
        'Jane Goodall',
        'Jane_Goodall',
        "En 1977, elle fonde le Jane Goodall Institute pour la protection de la biodiversité, l'aide au développement durable et l'éducation.",
        'institut',
      ),
      wd('Q184746', 'Jane Goodall', 'Dates et lieux de naissance et de mort.'),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
];
