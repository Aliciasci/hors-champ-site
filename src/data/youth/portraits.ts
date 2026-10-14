import { img } from '@/data/images';
import type { YouthPortrait } from '@/types';

import { Y } from './sources';

const draft = { editorialStatus: 'draft' as const, reviewedAt: null };

/**
 * « Elles aussi, elles ont commencé quelque part ». Chaque élément de parcours (curiosité,
 * apprentissages, difficultés, aides) est tiré des sources citées ; une rubrique non documentée
 * est omise plutôt qu'inventée. Les réalisations collectives sont présentées comme telles.
 */
export const youthPortraits: YouthPortrait[] = [
  {
    id: 'portrait-mary-anning',
    kind: 'portrait',
    title: 'Mary Anning',
    period: '1799 – 1847',
    field: 'Paléontologue',
    doors: ['nature', 'histoires', 'comprendre'],
    image: {
      image: img('youth/mary-anning.jpg'),
      alt: 'Portrait peint : Mary Anning en long manteau vert et bonnet, un marteau à la main et un panier à l’épaule, au pied d’une falaise ; son chien dort à ses pieds, la mer au loin.',
      title: 'Portrait de Mary Anning avec son chien Tray',
      artist: 'Attribué à « Mr. Grey »',
      date: 'avant 1842',
      holder: 'Natural History Museum, Londres',
      license: 'Domaine public',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Mary_Anning_painting.jpg',
      focus: { top: '10%' },
    },
    curiosity: {
      '6-10': 'Son père vendait des fossiles aux touristes. Il lui a appris à les chercher.',
      '11-14':
        'Son père, ébéniste, vendait des fossiles aux touristes pour arrondir ses fins de mois. Il initie Mary et son frère Joseph à cette activité.',
    },
    learning: {
      '6-10':
        'Elle a sans doute quitté l’école jeune. Une amie, Elizabeth Philpot, l’a encouragée à lire et à apprendre la géologie.',
      '11-14':
        'La famille, endettée, vit de la charité et Mary semble arrêter l’école. Elle apprend en autodidacte, encouragée par son amie Elizabeth Philpot, de vingt ans son aînée, à lire et à s’instruire en géologie.',
    },
    difficulties: {
      '6-10':
        'Les savants de l’époque la laissaient à l’écart, parce qu’elle était une femme et qu’elle était pauvre.',
      '11-14':
        'Sa condition de femme issue de la classe ouvrière la laisse en marge de la communauté scientifique. La Société géologique de Londres, interdite aux femmes, ne l’a jamais admise comme membre.',
    },
    achievements: {
      '6-10':
        'À 13 ans, avec son frère, elle trouve le squelette d’un ichtyosaure, un reptile marin disparu. Plus tard, elle découvre le premier squelette de plésiosaure.',
      '11-14':
        'À treize ans, elle met au jour, avec son frère, le reste d’un squelette d’ichtyosaure. En 1821, elle découvre le premier squelette de plésiosaure : une découverte majeure de la paléontologie des vertébrés.',
    },
    helpers: {
      '6-10': 'Son père, son frère Joseph et son amie Elizabeth Philpot.',
      '11-14':
        'Son père, qui l’initie ; son frère Joseph, qui fouille avec elle ; Elizabeth Philpot, qui l’encourage à apprendre.',
    },
    takeaway: {
      '6-10': 'On peut devenir une grande chercheuse en apprenant par soi-même, sur le terrain.',
      '11-14':
        'Son parcours montre qu’on peut apprendre par la pratique et l’observation. Il montre aussi que les portes des institutions lui étaient fermées : son talent n’a pas suffi à les ouvrir.',
    },
    careerIds: ['metier-paleontologue'],
    cultureLinks: [],
    sources: [
      Y.anningIntro,
      Y.anningEbeniste,
      Y.anningPere,
      Y.anningEcole,
      Y.anningPhilpot,
      Y.anningIchtyo,
      Y.anningTreize,
      Y.anningPlesio,
      Y.anningMarge,
      Y.anningSociete,
    ],
    ...draft,
  },
  {
    id: 'portrait-katia-krafft',
    kind: 'portrait',
    title: 'Katia Krafft',
    period: '1942 – 1991',
    field: 'Volcanologue et photographe',
    doors: ['nature', 'creer', 'histoires'],
    curiosity: {
      '6-10': 'Petite, elle avait un caractère bien à elle, et même un peu turbulent !',
      '11-14':
        'Enfant, elle a un caractère affirmé, parfois turbulent. Avec son mari Maurice, elle économise pour se payer un premier voyage au Stromboli, un volcan d’Italie, et photographier ses éruptions.',
    },
    learning: {
      '6-10': 'Elle a été institutrice, puis professeure de mathématiques, avant les volcans.',
      '11-14':
        'Elle devient institutrice puis professeure de mathématiques, après des études de physique et de géochimie à l’université de Strasbourg. Ce n’est pas un parcours en ligne droite vers les volcans.',
    },
    achievements: {
      '6-10':
        'Pendant 25 ans, elle a photographié les volcans du monde entier avec Maurice. Leurs films aident les gens à se protéger des éruptions.',
      '11-14':
        'Pendant vingt-cinq ans, elle parcourt le monde avec Maurice Krafft : lui filme, elle photographie. Chimiste et physicienne, elle décrit finement les éruptions. Leurs films et leurs missions de sensibilisation ont contribué à sauver des milliers de vies.',
    },
    helpers: {
      '6-10': 'Elle a tout fait en équipe avec Maurice, son mari.',
      '11-14': 'Toute son œuvre s’est faite en duo avec Maurice Krafft, géologue.',
    },
    difficulties: {
      '6-10': 'Approcher les volcans est un travail dangereux.',
      '11-14':
        'Leur travail était dangereux : Katia et Maurice Krafft sont morts en 1991 sur le mont Unzen, au Japon, lors d’une éruption.',
    },
    takeaway: {
      '6-10':
        'On peut changer de métier et aimer plusieurs choses : les maths, la photo, les volcans.',
      '11-14':
        'Enseignante avant d’être volcanologue, photographe autant que scientifique : son parcours montre qu’on peut combiner plusieurs passions et changer de voie.',
    },
    careerIds: ['metier-volcanologue'],
    cultureLinks: [],
    sources: [
      Y.krafftIntro,
      Y.krafftEnfance,
      Y.krafftEtudes,
      Y.krafftStromboli,
      Y.krafftPhoto,
      Y.krafftChimiste,
      Y.krafftVies,
      Y.krafftUnzen,
    ],
    ...draft,
  },
  {
    id: 'portrait-sylvia-earle',
    kind: 'portrait',
    title: 'Sylvia Earle',
    period: 'née en 1935',
    field: 'Océanographe et exploratrice',
    doors: ['nature', 'comprendre', 'histoires'],
    curiosity: {
      '6-10': 'Ses parents adoraient le plein air. Ils l’ont encouragée à explorer la nature.',
      '11-14':
        'Ses parents, passionnés de sports de plein air, l’encouragent à explorer la nature dès son plus jeune âge.',
    },
    learning: {
      '6-10': 'Elle a fait de longues études sur les algues de la mer.',
      '11-14':
        'Elle fait de longues études universitaires, jusqu’à un doctorat consacré aux algues (la phycologie), obtenu en 1966.',
    },
    helpers: {
      '6-10': 'Elle a appris aux côtés d’une autre chercheuse, Eugenie Clark.',
      '11-14':
        'Pendant sa thèse, elle rencontre la chercheuse Eugenie Clark et l’aide à créer une collection de référence pour son laboratoire.',
    },
    achievements: {
      '6-10':
        'Elle a vécu deux semaines sous la mer, dans une maison sous-marine, avec une équipe de femmes. Elle a aussi plongé à 381 mètres !',
      '11-14':
        'En 1970, elle dirige la première mission entièrement féminine du projet Tektite II, un habitat sous-marin : elle y étudie l’effet de la pollution sur les coraux. En 1979, elle établit le record féminin de plongée profonde (381 m). Elle cofonde ensuite une entreprise qui conçoit des sous-marins de recherche.',
    },
    takeaway: {
      '6-10': 'Explorer, c’est aussi observer, mesurer et comprendre ce qu’on voit.',
      '11-14':
        'Chercheuse, exploratrice et cheffe d’entreprise : son parcours montre que la science peut mener à des métiers très différents.',
    },
    careerIds: ['metier-oceanographe'],
    cultureLinks: [],
    sources: [
      Y.earleIntro,
      Y.earleParents,
      Y.earleEtudes,
      Y.earleClark,
      Y.earleTektite,
      Y.earleCoraux,
      Y.earleRecord,
      Y.earleEntreprise,
      Y.earleDeepRover,
    ],
    ...draft,
  },
  {
    id: 'portrait-francoise-barre-sinoussi',
    kind: 'portrait',
    title: 'Françoise Barré-Sinoussi',
    period: 'née en 1947',
    field: 'Virologue',
    doors: ['comprendre', 'resoudre', 'histoires'],
    curiosity: {
      '6-10': 'Sa maman lui a donné très tôt le goût de la médecine.',
      '11-14':
        'Sa mère, qui avait fait très peu d’études, lui transmet très tôt le goût du médical, une discipline qui la fascinait.',
    },
    learning: {
      '6-10': 'Après le bac, elle a étudié la biologie à l’université.',
      '11-14':
        'Après le baccalauréat en 1966, elle étudie la biologie à l’université de Paris : chimie-biologie, puis maîtrise de biochimie, puis recherche à l’Institut Pasteur.',
    },
    achievements: {
      '6-10':
        'Avec son équipe, elle a participé à la découverte du virus du sida. Elle a reçu le prix Nobel de médecine.',
      '11-14':
        'Au sein d’une équipe de l’Institut Pasteur, elle analyse avec Jean-Claude Chermann les cultures de cellules qui permettent de détecter le virus du sida (VIH). Cette découverte lui vaut le prix Nobel de médecine en 2008, partagé avec Luc Montagnier.',
    },
    takeaway: {
      '6-10': 'Les grandes découvertes se font souvent en équipe.',
      '11-14':
        'Une découverte scientifique est presque toujours collective : médecins, chercheuses et chercheurs y ont chacun joué un rôle précis.',
    },
    careerIds: ['metier-virologue'],
    cultureLinks: [
      {
        targetId: 'person-marie-curie',
        explanation: {
          '6-10': 'Comme Marie Curie avant elle, elle a reçu un prix Nobel.',
          '11-14':
            'Comme Marie Curie un siècle plus tôt, elle a reçu un prix Nobel pour des travaux scientifiques. Deux époques, deux domaines différents.',
        },
        sourceId: Y.fbsNobel.id,
      },
    ],
    sources: [Y.fbsIntro, Y.fbsMere, Y.fbsEtudes, Y.fbsPasteur, Y.fbsEquipe, Y.fbsNobel],
    ...draft,
  },
  {
    id: 'portrait-francoise-combes',
    kind: 'portrait',
    title: 'Françoise Combes',
    period: 'née en 1952',
    field: 'Astrophysicienne',
    doors: ['comprendre', 'histoires'],
    curiosity: {
      '6-10': 'Elle a grandi dans plusieurs pays et s’est passionnée pour la physique.',
      '11-14':
        'Elle grandit entre la Nouvelle-Calédonie, Tahiti et l’Algérie, et se passionne pour la physique. L’astronomie vient plus tard.',
    },
    learning: {
      '6-10': 'Elle a beaucoup étudié la physique, puis elle a choisi les étoiles et les galaxies.',
      '11-14':
        'Après deux années de classes préparatoires, elle entre à l’École normale supérieure de jeunes filles et étudie la physique. Elle se passionne ensuite pour l’astronomie et consacre sa thèse aux galaxies.',
    },
    achievements: {
      '6-10':
        'Elle étudie comment les galaxies naissent et changent. Elle est la première femme astronome élue à l’Académie des sciences.',
      '11-14':
        'Elle étudie la formation et l’évolution des galaxies, en combinant observations et simulations sur ordinateur. En 2004, elle devient la première femme astronome élue à l’Académie des sciences.',
    },
    takeaway: {
      '6-10': 'On peut découvrir sa passion en chemin, pas forcément dès l’enfance.',
      '11-14':
        'Sa passion pour l’astronomie est venue après la physique : on peut changer de cap au cours de ses études.',
    },
    careerIds: ['metier-astronome'],
    cultureLinks: [
      {
        targetId: 'person-katherine-johnson',
        explanation: {
          '6-10':
            'Katherine Johnson calculait le trajet des fusées. Françoise Combes étudie les galaxies. Deux façons de travailler sur l’espace.',
          '11-14':
            'Katherine Johnson calculait des trajectoires de vols spatiaux ; Françoise Combes étudie les galaxies par l’observation et la simulation. Deux métiers différents, tous deux tournés vers l’espace.',
        },
        sourceId: Y.combesTravaux.id,
      },
    ],
    sources: [
      Y.combesIntro,
      Y.combesEnfance,
      Y.combesEtudes,
      Y.combesAstro,
      Y.combesTravaux,
      Y.combesAcademie,
    ],
    ...draft,
  },
  {
    id: 'portrait-roberta-williams',
    kind: 'portrait',
    title: 'Roberta Williams',
    period: 'née en 1953',
    field: 'Conceptrice de jeux vidéo',
    doors: ['inventer', 'creer', 'histoires'],
    curiosity: {
      '6-10': 'Enfant timide, elle inventait des histoires d’aventure pour sa famille.',
      '11-14':
        'Enfant timide à l’imagination vive, elle invente des histoires d’aventure et de contes de fées pour divertir sa famille.',
    },
    learning: {
      '6-10': 'Elle a appris l’informatique au travail, en programmant.',
      '11-14':
        'Après le lycée, elle travaille dans l’administration, puis comme opératrice informatique et programmeuse en COBOL. Elle se passionne pour l’informatique en découvrant les jeux d’aventure textuels.',
    },
    achievements: {
      '6-10':
        'Avec son mari Ken, elle a créé Mystery House, le premier jeu d’aventure avec des images.',
      '11-14':
        'Elle imagine l’histoire et dessine les images de Mystery House, le premier jeu d’aventure graphique ; Ken Williams le programme. Le jeu se vend à dix mille exemplaires : elle emballe elle-même les disquettes et donne des indices aux joueurs par téléphone.',
    },
    helpers: {
      '6-10': 'Elle a travaillé en duo avec son mari, Ken.',
      '11-14':
        'Elle s’appuie sur les compétences techniques de Ken Williams, qui programme le jeu, tandis qu’elle apporte la narration.',
    },
    takeaway: {
      '6-10': 'Aimer raconter des histoires peut mener à inventer des jeux.',
      '11-14':
        'Raconter des histoires est une vraie compétence technique : dans un jeu vidéo, la narration compte autant que le code.',
    },
    careerIds: ['metier-conceptrice-jeux'],
    cultureLinks: [
      {
        targetId: 'person-grace-hopper',
        explanation: {
          '6-10': 'Roberta a programmé en COBOL, un langage inventé par Grace Hopper.',
          '11-14':
            'Roberta Williams a travaillé comme programmeuse en COBOL, le langage informatique dont Grace Hopper est la conceptrice.',
        },
        sourceId: Y.williamsCobol.id,
      },
    ],
    sources: [
      Y.williamsIntro,
      Y.williamsEnfance,
      Y.williamsLycee,
      Y.williamsOperatrice,
      Y.williamsCobol,
      Y.williamsTextuel,
      Y.williamsDuo,
      Y.williamsDessins,
      Y.williamsZiploc,
    ],
    ...draft,
  },
];
