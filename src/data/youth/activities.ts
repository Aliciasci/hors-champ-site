import type { Activity } from '@/types';

import { categoryArtworks } from '../artworks';
import { Y, YE } from './sources';

const draft = { editorialStatus: 'draft' as const, reviewedAt: null };

/**
 * « À toi d'essayer ». Les situations sont des exemples pédagogiques (prénoms, énigmes et
 * besoins inventés) ; les explications sur les disciplines, elles, sont sourcées. Aucune
 * activité ne demande d'achat, de compte ni de partage, et aucune ne note l'enfant : les
 * retours sont des pistes de réflexion.
 */
export const activities: Activity[] = [
  {
    id: 'activite-enigme',
    kind: 'activity',
    activityKind: 'riddle',
    title: 'L’énigme des trois animaux',
    doors: ['resoudre', 'inventer'],
    minutes: 3,
    materials: [],
    intro: {
      '6-10': 'Lis bien les indices. Chaque indice enlève des possibilités.',
      '11-14':
        'Une petite énigme de logique : chaque indice élimine des possibilités. C’est la façon de raisonner des programmes… et des créatrices de jeux d’énigmes.',
    },
    question: {
      '6-10':
        'Léa, Sam et Inès ont chacune un animal : un chat, un chien, un poisson. Sam a le poisson. Léa n’a pas le chien. Qui a le chat ?',
      '11-14':
        'Trois amies — Léa, Sam et Inès — ont chacune un animal différent : un chat, un chien ou un poisson. Indice 1 : Sam a le poisson. Indice 2 : Léa n’a pas le chien. Qui a le chat ?',
    },
    choices: [
      {
        id: 'lea',
        label: 'Léa',
        feedback: {
          '6-10': 'Oui ! Sam a le poisson, Léa n’a pas le chien : il reste le chat pour Léa.',
          '11-14':
            'Exactement : le poisson est pris par Sam, le chien est exclu pour Léa ; il ne lui reste que le chat. Et donc Inès a le chien.',
        },
      },
      {
        id: 'sam',
        label: 'Sam',
        feedback: {
          '6-10': 'Regarde l’indice 1 : Sam a déjà le poisson.',
          '11-14': 'Relis l’indice 1 : Sam a le poisson, et chaque amie n’a qu’un animal.',
        },
      },
      {
        id: 'ines',
        label: 'Inès',
        feedback: {
          '6-10': 'Essaie : si Inès avait le chat, Léa aurait le chien. Mais l’indice 2 dit non !',
          '11-14':
            'Teste l’hypothèse : si Inès avait le chat, il resterait le chien pour Léa — ce que l’indice 2 interdit.',
        },
      },
    ],
    explanation: {
      '6-10':
        'Tu as éliminé les possibilités une par une. C’est ce qu’on appelle raisonner avec logique.',
      '11-14':
        'Tu as procédé par élimination et vérifié tes hypothèses : c’est le cœur de la logique, et de beaucoup de programmes.',
    },
    discipline: {
      '6-10':
        'Les créatrices de jeux inventent des règles et des énigmes comme celle-ci. Les ordinateurs, eux, suivent des étapes logiques : des algorithmes.',
      '11-14':
        'Une conceptrice de jeux conçoit les règles d’un jeu ; un robot ou un programme exécute des algorithmes. Dans les deux cas, on raisonne étape par étape.',
    },
    careerIds: ['metier-conceptrice-jeux'],
    sources: [Y.concepteurDefinition, Y.robotProgramme],
    ...draft,
  },
  {
    id: 'activite-observer',
    kind: 'activity',
    activityKind: 'observe',
    title: 'Les détails d’un autoportrait',
    doors: ['creer', 'histoires'],
    minutes: 5,
    materials: [],
    image: categoryArtworks.raisonnement,
    intro: {
      '6-10':
        'Ce tableau a été peint par Artemisia Gentileschi il y a presque 400 ans. Touche chaque détail quand tu l’as trouvé.',
      '11-14':
        'Artemisia Gentileschi a peint ce tableau vers 1638-1639. Il représente « la Peinture » sous les traits d’une femme. Repère chaque détail, puis touche-le dans la liste.',
    },
    details: [
      {
        id: 'pinceau',
        label: { '6-10': 'Un pinceau et une palette', '11-14': 'Un pinceau et une palette' },
        explanation: {
          '6-10': 'Elle tient un pinceau dans une main et la palette de couleurs dans l’autre.',
          '11-14':
            'Le pinceau dans une main, la palette dans l’autre : c’est exactement ainsi qu’un livre célèbre de l’époque, l’Iconologia de Cesare Ripa, disait de représenter la Peinture.',
        },
      },
      {
        id: 'masque',
        label: {
          '6-10': 'Un petit masque en pendentif',
          '11-14': 'Un pendentif en forme de masque',
        },
        explanation: {
          '6-10': 'Au bout de la chaîne en or, il y a un petit masque.',
          '11-14':
            'La chaîne d’or se termine par un pendentif en forme de masque, un autre attribut de la Peinture décrit par Ripa.',
        },
      },
      {
        id: 'cheveux',
        label: { '6-10': 'Des cheveux en bataille', '11-14': 'Des mèches de cheveux en désordre' },
        explanation: {
          '6-10': 'Ses cheveux ne sont pas bien coiffés : elle est en plein travail !',
          '11-14':
            'Les mèches en désordre font partie des détails de texture qui rendent la scène réaliste.',
        },
      },
      {
        id: 'mains',
        label: {
          '6-10': 'Des mains tachées de peinture',
          '11-14': 'Des mains et une manche tachées',
        },
        explanation: {
          '6-10': 'Ses mains sont sales : la peinture, ça tache.',
          '11-14':
            'Les mains salies et la peinture qui craquelle près du poignet montrent une artiste au travail, pas une pose figée.',
        },
      },
      {
        id: 'lumiere',
        label: {
          '6-10': 'La lumière vient de la gauche',
          '11-14': 'Une lumière venue de la gauche',
        },
        explanation: {
          '6-10': 'Son visage et son bras sont éclairés, son dos est dans l’ombre.',
          '11-14':
            'La lumière arrive de la gauche, sans que l’on voie d’où : le contraste net entre lumière et ombre est une technique de l’époque baroque, le clair-obscur.',
        },
      },
    ],
    explanation: {
      '6-10':
        'Observer, c’est prendre son temps. Chaque détail raconte quelque chose sur l’artiste et son époque.',
      '11-14':
        'Prendre le temps de détailler une œuvre permet de comprendre ce qu’elle dit. Ici, l’artiste se présente comme la Peinture elle-même. Une précision : que ce soit bien son autoportrait est discuté par certains historiens de l’art.',
    },
    discipline: {
      '6-10':
        'Des historiennes de l’art étudient les tableaux, et des restauratrices les soignent : celui-ci a été nettoyé en 1972 pour retrouver son aspect d’origine.',
      '11-14':
        'Historiennes de l’art, conservatrices, restauratrices : en 1972, un nettoyage de ce tableau a retiré des couches de peinture ajoutées plus tard, pour lui rendre son état ancien.',
    },
    careerIds: [],
    sources: [
      YE.pitturaRipa,
      YE.pitturaMasque,
      YE.pitturaCheveux,
      YE.pitturaLumiere,
      YE.pitturaNettoyage,
      YE.pitturaDebat,
    ],
    ...draft,
  },
  {
    id: 'activite-robot',
    kind: 'activity',
    activityKind: 'design',
    title: 'Imagine un robot utile',
    doors: ['inventer', 'resoudre'],
    minutes: 5,
    materials: [],
    intro: {
      '6-10':
        'Un robot sent ce qui l’entoure, réfléchit, puis agit. Choisis à quoi servira le tien.',
      '11-14':
        'Un robot, c’est des capteurs pour percevoir, un programme pour décider, des actionneurs pour agir. Conçois le tien, étape par étape.',
    },
    design: [
      {
        id: 'besoin',
        summary: 'Son rôle',
        prompt: {
          '6-10': 'À quoi servira ton robot ?',
          '11-14': 'Quel besoin concret veux-tu résoudre ?',
        },
        options: [
          { id: 'plantes', label: 'Arroser les plantes quand la terre est sèche' },
          { id: 'plage', label: 'Ramasser les déchets sur une plage' },
          { id: 'cles', label: 'Aider à retrouver des objets égarés' },
        ],
      },
      {
        id: 'capteur',
        summary: 'Ce qu’il perçoit',
        prompt: {
          '6-10': 'Comment va-t-il sentir le monde ?',
          '11-14': 'Quel capteur lui donnes-tu ?',
        },
        options: [
          { id: 'humidite', label: 'Un capteur d’humidité' },
          { id: 'camera', label: 'Une caméra' },
          { id: 'distance', label: 'Un capteur de distance' },
        ],
      },
      {
        id: 'action',
        summary: 'Ce qu’il fait',
        prompt: { '6-10': 'Comment va-t-il agir ?', '11-14': 'Quel actionneur le fait agir ?' },
        options: [
          { id: 'pompe', label: 'Une petite pompe à eau' },
          { id: 'pince', label: 'Une pince sur des roues' },
          { id: 'son', label: 'Un haut-parleur qui sonne' },
        ],
      },
    ],
    explanation: {
      '6-10':
        'Ton robot a des « sens » (les capteurs), un programme qui décide, et des « muscles » (les actionneurs). Il n’y a pas une seule bonne réponse : chaque choix donne un robot différent.',
      '11-14':
        'Un robot possède des capteurs, un système logique et des actionneurs. Il fonctionne grâce à un programme qui tourne en continu ; il peut même réagir directement : « si un obstacle est détecté, alors arrêt des moteurs ». À toi d’imaginer les règles du tien.',
    },
    discipline: {
      '6-10':
        'Les ingénieures en robotique inventent des robots pour aider dans la vie de tous les jours.',
      '11-14':
        'C’est le travail des ingénieures et ingénieurs en robotique : partir d’un besoin, choisir capteurs et actionneurs, écrire le programme, tester.',
    },
    careerIds: [],
    sources: [Y.robotDefinition, Y.robotReflexe, Y.robotProgramme],
    ...draft,
  },
  {
    id: 'activite-pont',
    kind: 'activity',
    activityKind: 'build',
    title: 'Le pont en papier',
    doors: ['resoudre', 'inventer'],
    minutes: 15,
    materials: [
      'Deux feuilles de papier',
      'Deux piles de livres de même hauteur',
      'Des petits objets légers : pièces, gommes ou bouchons',
    ],
    safety: [
      'Pas besoin de ciseaux ni de colle.',
      'Utilise des objets légers, et des piles de livres stables, posées sur une table.',
      'Demande à un adulte avant d’emprunter des livres ou des pièces.',
    ],
    intro: {
      '6-10':
        'Construis un pont en papier entre deux piles de livres. Combien d’objets tiendra-t-il ?',
      '11-14':
        'Une même feuille de papier peut-elle porter plus de poids selon sa forme ? Fais l’expérience, en comparant deux ponts.',
    },
    question: {
      '6-10': 'Avant de commencer : à ton avis, quel pont portera le plus ?',
      '11-14': 'Ta prédiction, avant l’essai : quel pont portera le plus d’objets ?',
    },
    choices: [
      {
        id: 'plat',
        label: 'La feuille posée à plat',
        feedback: {
          '6-10': 'C’est noté ! Fais l’essai pour vérifier.',
          '11-14':
            'Prédiction notée. Une prédiction n’est ni bonne ni mauvaise : l’essai tranchera.',
        },
      },
      {
        id: 'accordeon',
        label: 'La feuille pliée en accordéon',
        feedback: {
          '6-10': 'C’est noté ! Fais l’essai pour vérifier.',
          '11-14':
            'Prédiction notée. Une prédiction n’est ni bonne ni mauvaise : l’essai tranchera.',
        },
      },
      {
        id: 'pareil',
        label: 'Les deux pareil',
        feedback: {
          '6-10': 'C’est noté ! Fais l’essai pour vérifier.',
          '11-14':
            'Prédiction notée. Une prédiction n’est ni bonne ni mauvaise : l’essai tranchera.',
        },
      },
    ],
    steps: [
      {
        '6-10': 'Pose la première feuille à plat entre les deux piles de livres.',
        '11-14':
          'Écarte les piles d’environ 15 cm et pose la première feuille à plat, comme un tablier de pont.',
      },
      {
        '6-10':
          'Pose les objets un par un au milieu. Compte combien tiennent avant que le pont plie.',
        '11-14':
          'Pose les objets un à un au centre et note combien le pont en porte avant de s’affaisser.',
      },
      {
        '6-10':
          'Plie la deuxième feuille en accordéon, comme un éventail. Pose-la entre les livres.',
        '11-14':
          'Plie la seconde feuille en accordéon (des plis réguliers d’environ 1 cm), puis place-la entre les piles.',
      },
      {
        '6-10': 'Recommence à poser les objets. Compare !',
        '11-14': 'Recommence la même mesure, au même endroit, puis compare les deux résultats.',
      },
    ],
    explanation: {
      '6-10':
        'Plier le papier le rend plus solide, sans ajouter de papier. Les ingénieures utilisent cette idée : la forme compte autant que la matière.',
      '11-14':
        'Les plis donnent au papier plus de hauteur et de rigidité, sans ajouter de matière. Les ingénieurs ont fait de même avec les ponts : pour franchir de grandes distances, on augmente la rigidité des poutres en assemblant des barres en triangles — les poutres en treillis.',
    },
    discipline: {
      '6-10':
        'C’est un premier pas dans le métier d’ingénieure qui conçoit des ponts et des bâtiments.',
      '11-14':
        'Ingénieures en structures, architectes, charpentières : leur travail consiste à trouver des formes qui tiennent, avec le moins de matière possible.',
    },
    careerIds: [],
    sources: [Y.treillis, Y.treillisInertie],
    ...draft,
  },
];
