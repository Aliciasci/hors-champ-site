import type { CultureEntity } from '@/types';

import { inventionImages } from '../inventionImages';
import { portraits } from '../portraits';
import { wikidata, wikipedia } from './sources';

/**
 * Femmes de science, leurs inventions et découvertes. Chaque résumé reprend des faits présents
 * dans les extraits cités (Wikipédia, consulté le 2026-10-12) ; dates recoupées avec Wikidata.
 * Statut `draft` : textes non relus par l'équipe éditoriale.
 */

const MATILDA = 'idea-effet-matilda';

export const scientists: CultureEntity[] = [
  {
    id: 'person-ada-lovelace',
    kind: 'person',
    domain: 'sciences',
    title: 'Ada Lovelace',
    hook: 'Autrice du premier programme informatique publié',
    subtitle: 'Mathématicienne britannique',
    period: { label: '1815 – 1852', sortYear: 1815 },
    summary:
      'Pionnière de la science informatique, Ada Lovelace est principalement connue pour avoir conçu et décrit le premier programme informatique publié, lors de son travail sur la machine analytique de Charles Babbage.',
    image: portraits['ada-lovelace'],
    links: [{ targetId: 'science-premier-programme', relation: 'created' }],
    sources: [
      wikipedia(
        'Ada Lovelace',
        'Ada_Lovelace',
        'Ada Lovelace, de son nom complet Augusta Ada King, comtesse de Lovelace, née Augusta Ada Byron le 10 décembre 1815 à Londres et morte le 27 novembre 1852 à Marylebone dans la même ville, est une pionnière de la science informatique.',
        'identite',
      ),
      wikipedia(
        'Ada Lovelace',
        'Ada_Lovelace',
        "Elle est principalement connue pour avoir conçu et décrit le premier programme informatique publié, lors de son travail sur un ancêtre de l'ordinateur : la machine analytique de Charles Babbage.",
      ),
      wikidata('Q7259', 'Ada Lovelace', 'Dates de naissance et de mort.'),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'person-marie-curie',
    kind: 'person',
    domain: 'sciences',
    title: 'Marie Curie',
    hook: 'Deux prix Nobel : un cas unique chez les femmes',
    subtitle: 'Physicienne et chimiste polonaise et française',
    period: { label: '1867 – 1934', sortYear: 1867 },
    summary:
      'Marie Curie est la première femme à avoir reçu le prix Nobel et la seule femme à en avoir reçu deux. En France, elle est la première femme à enseigner à la Sorbonne.',
    image: portraits['marie-curie'],
    links: [
      { targetId: 'science-polonium-radium', relation: 'created' },
      { targetId: 'event-1903-nobel-curie', relation: 'took-part' },
    ],
    sources: [
      wikipedia(
        'Marie Curie',
        'Marie_Curie',
        "Scientifique d'exception, elle est la première femme à avoir reçu le prix Nobel et la seule femme à en avoir reçu deux.",
      ),
      wikipedia(
        'Marie Curie',
        'Marie_Curie',
        'En France, Marie Curie est la première femme à enseigner à la Sorbonne, et la première femme honorée pour ses propres mérites à reposer au Panthéon.',
        'sorbonne',
      ),
      wikidata('Q7186', 'Marie Curie', 'Dates de naissance et de mort.'),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'person-emmy-noether',
    kind: 'person',
    domain: 'sciences',
    title: 'Emmy Noether',
    hook: 'Anneaux, corps, algèbres : des théories qu’elle a révolutionnées',
    subtitle: 'Mathématicienne allemande',
    period: { label: '1882 – 1935', sortYear: 1882 },
    summary:
      'Spécialiste d’algèbre abstraite et de physique théorique, Emmy Noether a révolutionné les théories des anneaux, des corps et des algèbres.',
    image: portraits['emmy-noether'],
    links: [
      { targetId: 'science-theoreme-de-noether', relation: 'created' },
      { targetId: 'event-1915-gottingen-noether', relation: 'took-part' },
    ],
    sources: [
      wikipedia(
        'Emmy Noether',
        'Emmy_Noether',
        "Amalie Emmy Noether (23 mars 1882 – 14 avril 1935) est une mathématicienne allemande spécialiste d'algèbre abstraite et de physique théorique.",
      ),
      wikipedia(
        'Emmy Noether',
        'Emmy_Noether',
        'elle a révolutionné les théories des anneaux, des corps et des algèbres.',
        'algebre',
      ),
      wikidata('Q7099', 'Emmy Noether', 'Dates de naissance et de mort.'),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'person-lise-meitner',
    kind: 'person',
    domain: 'sciences',
    title: 'Lise Meitner',
    hook: 'Au cœur de la découverte de la fission, oubliée par le Nobel',
    subtitle: 'Physicienne autrichienne, naturalisée suédoise',
    period: { label: '1878 – 1968', sortYear: 1878 },
    summary:
      'Renommée pour ses travaux sur la radioactivité et la physique nucléaire, Lise Meitner joue un rôle majeur dans la découverte de la fission nucléaire. Elle est souvent citée comme l’un des cas les plus flagrants de scientifique injustement ignorée par le comité du prix Nobel.',
    image: portraits['lise-meitner'],
    links: [
      { targetId: 'science-fission-nucleaire', relation: 'created' },
      { targetId: 'event-1944-nobel-sans-meitner', relation: 'took-part' },
      { targetId: MATILDA, relation: 'context' },
    ],
    sources: [
      wikipedia(
        'Lise Meitner',
        'Lise_Meitner',
        "Elle joua notamment un rôle majeur dans la découverte de la fission nucléaire, dont elle fournit avec son neveu Otto Frisch la première explication théorique. Lise Meitner est souvent citée comme l'un des cas les plus flagrants de scientifique injustement ignorée par le comité attribuant le prix Nobel.",
      ),
      wikidata('Q56189', 'Lise Meitner', 'Dates de naissance et de mort.'),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'person-hedy-lamarr',
    kind: 'person',
    domain: 'sciences',
    title: 'Hedy Lamarr',
    hook: 'Star de cinéma et co-inventrice d’un codage des transmissions',
    subtitle: 'Actrice et inventrice autrichienne, naturalisée américaine',
    period: { label: '1914 – 2000', sortYear: 1914 },
    summary:
      'Actrice et productrice de cinéma, Hedy Lamarr contribue en autodidacte à la science des télécommunications : elle invente avec le compositeur George Antheil un moyen de coder des transmissions.',
    links: [
      { targetId: 'science-saut-de-frequence', relation: 'created' },
      { targetId: MATILDA, relation: 'context' },
    ],
    sources: [
      wikipedia(
        'Hedy Lamarr',
        'Hedy_Lamarr',
        'Hedwig Kiesler, dite Hedy Lamarr, est une actrice, productrice de cinéma et inventrice autrichienne, naturalisée américaine',
        'identite',
      ),
      wikipedia(
        'Hedy Lamarr',
        'Hedy_Lamarr',
        "Outre sa carrière au cinéma, elle contribua de manière autodidacte à la science des télécommunications en inventant avec le compositeur George Antheil, pianiste et inventeur comme elle, un moyen de coder des transmissions (faisant partie des méthodes d'étalement de spectre par saut de fréquence), souhaitant participer ainsi à l'effort de guerre des États-Unis.",
      ),
      wikidata('Q49034', 'Hedy Lamarr', 'Dates de naissance et de mort.'),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'person-grace-hopper',
    kind: 'person',
    domain: 'sciences',
    title: 'Grace Hopper',
    hook: 'Conceptrice du premier compilateur et du langage Cobol',
    subtitle: 'Informaticienne et mathématicienne américaine',
    period: { label: '1906 – 1992', sortYear: 1906 },
    summary:
      'Informaticienne, mathématicienne et contre-amirale de la marine américaine, Grace Hopper est la conceptrice du premier compilateur et du langage Cobol.',
    image: portraits['grace-hopper'],
    links: [
      { targetId: 'science-compilateur-cobol', relation: 'created' },
      { targetId: MATILDA, relation: 'context' },
    ],
    sources: [
      wikipedia(
        'Grace Hopper',
        'Grace_Hopper',
        'Grace Murray Hopper est une informaticienne, mathématicienne et Rear admiral (lower half) de la marine américaine',
        'identite',
      ),
      wikipedia(
        'Grace Hopper',
        'Grace_Hopper',
        'Elle est la conceptrice du premier compilateur en 1951 (A-0 System) et du langage Cobol en 1959.',
      ),
      wikidata('Q11641', 'Grace Hopper', 'Dates de naissance et de mort.'),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'person-rosalind-franklin',
    kind: 'person',
    domain: 'sciences',
    title: 'Rosalind Franklin',
    hook: 'Un rôle clé dans la découverte de la structure de l’ADN',
    subtitle: 'Physicochimiste britannique',
    period: { label: '1920 – 1958', sortYear: 1920 },
    summary:
      'Pionnière de la biologie moléculaire, Rosalind Franklin joue un rôle important dans la découverte de la structure hélicoïdale de l’ADN, et un rôle majeur dans celle du virus de la mosaïque du tabac.',
    links: [
      { targetId: 'science-cliche-51', relation: 'created' },
      { targetId: MATILDA, relation: 'context' },
    ],
    sources: [
      wikipedia(
        'Rosalind Franklin',
        'Rosalind_Franklin',
        "Pionnière de la biologie moléculaire, elle joue un rôle important dans la découverte de la structure hélicoïdale de l'acide désoxyribonucléique (ADN) avec James Dewey Watson, Francis Crick et Maurice Wilkins. Elle joue également un rôle majeur dans la découverte du virus de la mosaïque du tabac.",
      ),
      wikidata('Q7474', 'Rosalind Franklin', 'Dates de naissance et de mort.'),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'person-katherine-johnson',
    kind: 'person',
    domain: 'sciences',
    title: 'Katherine Johnson',
    hook: 'Ses calculs vérifiaient les trajectoires des vols spatiaux',
    subtitle: 'Mathématicienne, physicienne et ingénieure spatiale américaine',
    period: { label: '1918 – 2020', sortYear: 1918 },
    summary:
      'Réputée pour la fiabilité de ses calculs en navigation astronomique, Katherine Johnson fait partie des « ordinateurs humains » de la NASA, ces mathématiciennes qui calculent et vérifient les trajectoires de nombreux vols spatiaux.',
    image: portraits['katherine-johnson'],
    links: [
      { targetId: 'science-trajectoire-friendship-7', relation: 'created' },
      { targetId: 'event-2015-medaille-liberte-johnson', relation: 'took-part' },
    ],
    sources: [
      wikipedia(
        'Katherine Johnson',
        'Katherine_Johnson',
        'Durant cette période, elle fait partie des « ordinateurs humains » de la NASA, des mathématiciennes qui calculent et vérifient les trajectoires',
        'ordinateurs-humains',
      ),
      wikipedia(
        'Katherine Johnson',
        'Katherine_Johnson',
        "Réputée pour la fiabilité de ses calculs en navigation astronomique, elle conduit des travaux techniques à la NASA qui s'étalent sur des décennies.",
      ),
      wikidata('Q11740', 'Katherine Johnson', 'Dates de naissance et de mort.'),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
];

export const discoveries: CultureEntity[] = [
  {
    id: 'science-premier-programme',
    kind: 'science',
    domain: 'sciences',
    title: 'Le premier programme informatique publié',
    subtitle: 'Note G sur la machine analytique',
    period: { label: '1842 – 1843', sortYear: 1843 },
    summary:
      'Dans les notes qu’elle ajoute à sa traduction d’un article sur la machine analytique de Babbage, Ada Lovelace décrit un algorithme détaillé pour calculer les nombres de Bernoulli. On ne sait pas exactement dans quelle mesure elle l’a programmé seule, car elle travaillait en relation étroite avec Babbage.',
    image: inventionImages['premier-programme'],
    links: [],
    sources: [
      wikipedia(
        'Ada Lovelace',
        'Ada_Lovelace',
        'Elle ajoute à cet article sept notes, labellisées de A à G',
        'notes',
      ),
      wikipedia(
        'Ada Lovelace',
        'Ada_Lovelace',
        "La note G s'appuie sur un véritable algorithme très détaillé pour calculer les nombres de Bernoulli avec la machine.",
        'note-g',
      ),
      wikipedia(
        'Ada Lovelace',
        'Ada_Lovelace',
        'On ne sait pas exactement dans quelle mesure Ada Lovelace a programmé elle-même cet algorithme, ayant été en relation constante et étroite avec Babbage.',
        'nuance',
      ),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'science-polonium-radium',
    kind: 'science',
    domain: 'sciences',
    title: 'La découverte du polonium et du radium',
    subtitle: 'Deux nouveaux éléments chimiques',
    period: { label: '1898', sortYear: 1898 },
    summary:
      'En 1898, Marie et Pierre Curie découvrent deux nouveaux éléments, le polonium et le radium. Ces travaux valent à Marie Curie le prix Nobel de chimie en 1911.',
    image: inventionImages['polonium-radium'],
    links: [],
    sources: [
      wikipedia(
        'Marie Curie',
        'Marie_Curie',
        "Cette idée se révèle fructueuse puisqu'elle permet aux époux Curie de découvrir en 1898 deux nouveaux éléments, le polonium et le radium.",
        'elements',
      ),
      wikipedia(
        'Marie Curie',
        'Marie_Curie',
        'En 1911, elle obtient le prix Nobel de chimie pour ses travaux sur le polonium et le radium.',
        'nobel-1911',
      ),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'science-theoreme-de-noether',
    kind: 'science',
    domain: 'sciences',
    title: 'Le théorème de Noether',
    subtitle: 'Symétries et lois de conservation',
    period: { label: '1915 – 1918', sortYear: 1915 },
    summary:
      'Démontré en 1915 et publié en 1918, le théorème de Noether explique le lien fondamental entre la symétrie et les lois de conservation. Il est considéré comme aussi important que la théorie de la relativité.',
    image: inventionImages['theoreme-de-noether'],
    links: [],
    sources: [
      wikipedia(
        'Emmy Noether',
        'Emmy_Noether',
        'En physique, le théorème de Noether explique le lien fondamental entre la symétrie et les lois de conservation et est considéré comme aussi important que la théorie de la relativité.',
        'theoreme',
      ),
      wikipedia(
        'Emmy Noether',
        'Emmy_Noether',
        "avec le premier théorème de Noether, qu'elle démontra en 1915, mais ne publia qu'en 1918.",
        'dates',
      ),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'science-fission-nucleaire',
    kind: 'science',
    domain: 'sciences',
    title: 'L’explication de la fission nucléaire',
    subtitle: 'Avec Otto Frisch',
    period: { label: '1939', sortYear: 1939 },
    summary:
      'En février 1939, Lise Meitner et son neveu Otto Frisch apportent la première explication théorique de la fission nucléaire, en s’appuyant sur le modèle de la goutte liquide de Niels Bohr.',
    image: inventionImages['fission-nucleaire'],
    links: [],
    sources: [
      wikipedia(
        'Lise Meitner',
        'Lise_Meitner',
        'La première explication théorique de ce phénomène est apportée par Lise Meitner et son neveu Otto Frisch en février 1939, en employant le modèle de la goutte liquide de Niels Bohr pour décrire le noyau atomique.',
        'fission',
      ),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'science-saut-de-frequence',
    kind: 'science',
    domain: 'sciences',
    title: 'Le « système secret de communication »',
    subtitle: 'Saut de fréquence, avec George Antheil',
    period: { label: '1941', sortYear: 1941 },
    summary:
      'Hedy Lamarr et George Antheil font breveter en 1941 un moyen de coder des transmissions, qui fait partie des méthodes d’étalement de spectre par saut de fréquence. Selon l’article cité, ce principe est aujourd’hui utilisé dans les téléphones portables et les réseaux sans fil.',
    image: inventionImages['saut-de-frequence'],
    links: [],
    sources: [
      wikipedia(
        'Hedy Lamarr',
        'Hedy_Lamarr',
        "un moyen de coder des transmissions (faisant partie des méthodes d'étalement de spectre par saut de fréquence)",
        'spectre',
      ),
      wikipedia(
        'Hedy Lamarr',
        'Hedy_Lamarr',
        "Une invention dont elle est co-autrice fait l'objet d'un brevet, en 1941.",
        'brevet',
      ),
      wikipedia(
        'Hedy Lamarr',
        'Hedy_Lamarr',
        'Ce principe est actuellement utilisé dans les téléphones portables et les réseaux sans fil.',
        'usage',
      ),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'science-compilateur-cobol',
    kind: 'science',
    domain: 'sciences',
    title: 'Le premier compilateur et le langage Cobol',
    subtitle: 'A-0 System, puis Cobol',
    period: { label: '1951 – 1959', sortYear: 1951 },
    summary:
      'Grace Hopper conçoit en 1951 le premier compilateur, l’A-0 System, puis le langage de programmation Cobol en 1959.',
    image: inventionImages['compilateur-cobol'],
    links: [],
    sources: [
      wikipedia(
        'Grace Hopper',
        'Grace_Hopper',
        'Elle est la conceptrice du premier compilateur en 1951 (A-0 System) et du langage Cobol en 1959.',
      ),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'science-cliche-51',
    kind: 'science',
    domain: 'sciences',
    title: 'Le cliché 51',
    subtitle: 'Diffraction de rayons X de l’ADN',
    period: { label: '1952', sortYear: 1952 },
    summary:
      'En mai 1952, Rosalind Franklin réalise les clichés 49 et 51 de la forme B de l’ADN, dont elle déduit une forme hélicoïdale. Le cliché 51 et son analyse font l’objet de son article publié dans Nature en avril 1953.',
    image: inventionImages['cliche-51'],
    links: [],
    sources: [
      wikipedia(
        'Rosalind Franklin',
        'Rosalind_Franklin',
        'En mai 1952, elle réalise des clichés de la forme B (clichés 49 et 51) dont elle déduit une forme hélicoïdale (sans préciser le nombre de brins), une périodicité de 34 Å et 10 couches de bases par tour.',
        'cliche',
      ),
      wikipedia(
        'Rosalind Franklin',
        'Rosalind_Franklin',
        "Le cliché 51 et son analyse feront l'objet de son article publié dans Nature en avril 1953.",
        'nature',
      ),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'science-trajectoire-friendship-7',
    kind: 'science',
    domain: 'sciences',
    title: 'Les calculs de trajectoire de Friendship 7',
    subtitle: 'Premier vol orbital américain',
    period: { label: '1962', sortYear: 1962 },
    summary:
      'En 1962, Katherine Johnson vérifie à la main les calculs de trajectoire informatisés de Mercury-Atlas 6 (Friendship 7), la première mission américaine envoyant un homme en orbite autour de la Terre. L’astronaute John Glenn demande expressément que cette vérification soit faite par elle.',
    image: inventionImages['trajectoire-friendship-7'],
    links: [],
    sources: [
      wikipedia(
        'Katherine Johnson',
        'Katherine_Johnson',
        'En 1962, elle vérifie à la main les calculs de trajectoire informatisés de la première mission américaine envoyant un homme en orbite autour de la Terre : Mercury-Atlas 6 (Friendship 7).',
        'friendship-7',
      ),
      wikipedia(
        'Katherine Johnson',
        'Katherine_Johnson',
        'John Glenn, qui connaît sa réputation et a une confiance limitée dans les premiers programmes de suivi de trajectoire, demande expressément que cette vérification manuelle soit faite par Katherine Johnson',
        'glenn',
      ),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
];

export const scienceEvents: CultureEntity[] = [
  {
    id: 'event-1903-nobel-curie',
    kind: 'event',
    domain: 'sciences',
    title: 'Le premier prix Nobel décerné à une femme',
    subtitle: 'Prix Nobel de physique',
    period: { label: '1903', sortYear: 1903 },
    summary:
      'En 1903, Marie et Pierre Curie partagent avec Henri Becquerel le prix Nobel de physique pour leurs recherches sur les radiations. Marie Curie est la première femme à recevoir un prix Nobel.',
    links: [],
    sources: [
      wikipedia(
        'Marie Curie',
        'Marie_Curie',
        "Scientifique d'exception, elle est la première femme à avoir reçu le prix Nobel et la seule femme à en avoir reçu deux.",
        'premiere-femme',
      ),
      wikipedia(
        'Marie Curie',
        'Marie_Curie',
        'En 1903, les époux Curie partagent avec Henri Becquerel le prix Nobel de physique pour leurs recherches sur les radiations (radioactivité, rayonnement corpusculaire naturel).',
        'nobel-1903',
      ),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'event-1915-gottingen-noether',
    kind: 'event',
    domain: 'sciences',
    title: 'Emmy Noether enseigne sous le nom de Hilbert',
    subtitle: 'Université de Göttingen',
    period: { label: '1915 – 1919', sortYear: 1915 },
    summary:
      'Invitée en 1915 à l’université de Göttingen, Emmy Noether doit pendant quatre ans donner ses cours sous le nom de David Hilbert : la faculté de philosophie refuse qu’une femme soit nommée professeur. Elle obtient son habilitation en 1919.',
    links: [{ targetId: 'idea-doubles-standards', relation: 'context' }],
    sources: [
      wikipedia(
        'Emmy Noether',
        'Emmy_Noether',
        "En 1915, elle est invitée par David Hilbert et Felix Klein à rejoindre le très renommé département de mathématiques de l'université de Göttingen.",
        'gottingen',
      ),
      wikipedia(
        'Emmy Noether',
        'Emmy_Noether',
        "Cependant, en raison de l'opposition de la faculté de philosophie — qui refuse qu'une femme soit nommée professeur — elle doit pendant quatre ans donner des cours sous le nom de Hilbert.",
        'hilbert',
      ),
      wikipedia(
        'Emmy Noether',
        'Emmy_Noether',
        'Son habilitation est obtenue en 1919.',
        'habilitation',
      ),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'event-1944-nobel-sans-meitner',
    kind: 'event',
    domain: 'sciences',
    title: 'Le prix Nobel 1944, sans Lise Meitner',
    subtitle: 'Prix Nobel attribué à Otto Hahn',
    period: { label: '1944', sortYear: 1944 },
    summary:
      'Otto Hahn reçoit le prix Nobel en 1944. Lise Meitner, qui avait fourni avec Otto Frisch la première explication théorique de la fission nucléaire, est ignorée par le comité.',
    links: [{ targetId: MATILDA, relation: 'context' }],
    sources: [
      wikipedia(
        'Lise Meitner',
        'Lise_Meitner',
        'Elle joua notamment un rôle majeur dans la découverte de la fission nucléaire, dont elle fournit avec son neveu Otto Frisch la première explication théorique.',
        'role',
      ),
      wikipedia(
        'Effet Matilda',
        'Effet_Matilda',
        'Lise Meitner (1878-1968), physicienne autrichienne injustement ignorée au prix Nobel pour ses découvertes sur la fission nucléaire, alors que son collègue Otto Hahn le reçut en 1944.',
        'meitner',
      ),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'event-2015-medaille-liberte-johnson',
    kind: 'event',
    domain: 'sciences',
    title: 'Katherine Johnson reçoit la médaille présidentielle de la Liberté',
    subtitle: 'Puis la médaille d’or du Congrès en 2019',
    period: { label: '2015', sortYear: 2015 },
    summary:
      'En 2015, Katherine Johnson reçoit la médaille présidentielle de la Liberté. En 2019, le Congrès des États-Unis lui décerne sa médaille d’or.',
    links: [],
    sources: [
      wikipedia(
        'Katherine Johnson',
        'Katherine_Johnson',
        "En 2015, elle reçoit la médaille présidentielle de la Liberté et, en 2019, le Congrès des États-Unis lui décerne la médaille d'or du Congrès.",
        'medailles',
      ),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
];

/** L'effet Matilda relie les scientifiques que l'article cité nomme explicitement. */
export const matildaIdea: CultureEntity = {
  id: MATILDA,
  kind: 'idea',
  title: 'L’effet Matilda',
  subtitle: 'Invisibilisation des femmes de science',
  summary:
    'Le déni ou la minimisation récurrente de la contribution des femmes à la recherche scientifique, dont le travail est souvent attribué à leurs collègues masculins. Décrit par Matilda Joslyn Gage dès 1870, le phénomène est nommé ainsi en 1993 par l’historienne des sciences Margaret W. Rossiter.',
  categoryId: 'sexisme-quotidien',
  links: [],
  sources: [
    wikipedia(
      'Effet Matilda',
      'Effet_Matilda',
      'Lise Meitner (1878-1968), physicienne autrichienne injustement ignorée au prix Nobel pour ses découvertes sur la fission nucléaire, alors que son collègue Otto Hahn le reçut en 1944.',
      'meitner',
    ),
    wikipedia(
      'Effet Matilda',
      'Effet_Matilda',
      'Ce phénomène a été décrit pour la première fois par la suffragette et abolitionniste Matilda Joslyn Gage (1826-1898) dans son essai Woman as Inventor (publié pour la première fois sous forme de tract en 1870 puis dans la North American Review en 1883).',
      'gage',
    ),
    wikipedia(
      'Effet Matilda',
      'Effet_Matilda',
      'L’effet Matilda est le déni, la spoliation ou la minimisation récurrente et systémique de la contribution des femmes à la recherche scientifique, dont le travail est souvent attribué à leurs collègues masculins.',
    ),
    wikipedia(
      'Effet Matilda',
      'Effet_Matilda',
      "Nommé en son honneur, le terme « effet Matilda » est inventé en 1993 par l'historienne des sciences Margaret W. Rossiter.",
      'rossiter',
    ),
    wikipedia(
      'Effet Matilda',
      'Effet_Matilda',
      'Hedy Lamarr (1914-2000) dépose avec George Antheil un brevet de système de communication secrète en 1941.',
      'lamarr',
    ),
    wikipedia(
      'Effet Matilda',
      'Effet_Matilda',
      'Rosalind Franklin (1920-1958), physico-chimiste britannique, obtient la première photographie d’ADN par diffraction de rayons X (appelé le cliché 51).',
      'franklin',
    ),
    wikipedia(
      'Effet Matilda',
      'Effet_Matilda',
      "Grace Hopper (1906-1992), travaille pendant la Seconde Guerre mondiale sur un compilateur pour le Harvard Mark I, ordinateur dont l'architecture matérielle a été définie par John von Neumann.",
      'hopper',
    ),
  ],
  editorialStatus: 'draft',
  reviewedAt: null,
};
