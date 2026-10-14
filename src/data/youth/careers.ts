import type { Career, Leveled } from '@/types';

import { careerImages } from './careerImages';
import { Y } from './sources';

const draft = { editorialStatus: 'draft' as const, reviewedAt: null };

/** Repère d'orientation, non sourcé par nature : il renvoie vers un accompagnement réel. */
const ASK: Leveled = {
  '6-10': 'Il existe souvent plusieurs chemins. Tu peux en parler avec ta famille ou à l’école.',
  '11-14':
    'Les voies changent avec le temps et selon les pays : au collège, la ou le professeur principal et les psychologues de l’Éducation nationale peuvent t’aider à les explorer.',
};

/**
 * Fiches métiers. « Et si tu devenais… » (`unusual: false`) et « Des métiers auxquels on ne
 * pense pas » (`unusual: true`). Les voies d'accès citent une source quand elle existe ; sinon,
 * le parcours d'une femme est donné comme un exemple, jamais comme la seule voie.
 */
export const careers: Career[] = [
  {
    id: 'metier-astronome',
    kind: 'career',
    image: careerImages.astronome,
    title: 'Astronome',
    unusual: false,
    doors: ['comprendre'],
    hook: {
      '6-10': 'Comprendre les étoiles et les galaxies.',
      '11-14':
        'Étudier l’Univers, des étoiles aux galaxies, avec des télescopes et des ordinateurs.',
    },
    daily: {
      '6-10':
        'Les astronomes regardent peu dans un télescope : ils observent quelques semaines par an, puis ils étudient les images et les mesures sur ordinateur.',
      '11-14':
        'Contrairement à l’image du savant collé à sa lunette, une astronome observe généralement quelques semaines par an ; le reste du temps, elle analyse des données. Certains télescopes se pilotent même à distance, depuis un bureau.',
    },
    problems: {
      '6-10': 'Comment naissent les galaxies ? De quoi est fait l’Univers ?',
      '11-14':
        'Comment les galaxies se forment-elles et évoluent-elles ? De quoi l’Univers est-il composé ? Pour y répondre, on combine observations et simulations numériques.',
    },
    skills: ['Curiosité', 'Physique et mathématiques', 'Programmation', 'Patience'],
    paths: [
      {
        text: {
          '6-10': 'Les astronomes de métier font de longues études de physique.',
          '11-14':
            'Les astronomes professionnels ont généralement un doctorat en physique ou en astronomie et travaillent souvent comme chercheuses ou chercheurs à l’université.',
        },
        sourceId: Y.astronomeDoctorat.id,
      },
      {
        text: {
          '6-10': 'On peut aussi observer le ciel en amateur, dans un club d’astronomie.',
          '11-14':
            'L’astronomie se pratique aussi en amateur : il existe des clubs dans la plupart des villes.',
        },
        sourceId: Y.astronomeAmateurs.id,
      },
      { text: ASK },
    ],
    portraitId: 'portrait-francoise-combes',
    cultureLinks: [
      {
        targetId: 'person-katherine-johnson',
        explanation: {
          '6-10': 'Katherine Johnson faisait des calculs pour les voyages dans l’espace.',
          '11-14':
            'Les métiers de l’espace sont variés : Katherine Johnson calculait des trajectoires de vols spatiaux, une astronome étudie les astres eux-mêmes.',
        },
        sourceId: Y.astronomeObservation.id,
      },
    ],
    sources: [
      Y.astronomeDoctorat,
      Y.astronomeObservation,
      Y.astronomeAmateurs,
      Y.combesTravaux,
      Y.combesTelescopes,
    ],
    ...draft,
  },
  {
    id: 'metier-conceptrice-jeux',
    kind: 'career',
    image: careerImages.jeux,
    title: 'Conceptrice de jeux vidéo',
    unusual: false,
    doors: ['inventer', 'creer'],
    activityId: 'activite-enigme',
    hook: {
      '6-10': 'Inventer les règles et l’histoire d’un jeu.',
      '11-14': 'Imaginer un jeu : ses règles, son monde, ce que l’on y ressent en jouant.',
    },
    daily: {
      '6-10':
        'Elle invente les règles du jeu, les objets, les défis, et vérifie que c’est amusant.',
      '11-14':
        'La conceptrice de jeux (game designer) définit le concept, le gameplay, les règles et les propriétés des objets. Selon les studios, ce rôle est distinct de celui des programmeuses et des graphistes, ou cumulé avec lui.',
    },
    problems: {
      '6-10': 'Comment rendre un jeu ni trop facile, ni trop difficile ?',
      '11-14':
        'Comment rendre un défi juste, une histoire prenante, une règle claire ? Comment faire pour que chacune et chacun puisse jouer ?',
    },
    skills: ['Imagination', 'Logique', 'Écriture', 'Travail en équipe'],
    paths: [
      {
        text: {
          '6-10':
            'Certaines viennent de la programmation ou du dessin, d’autres d’écoles de jeux vidéo.',
          '11-14':
            'À l’origine, beaucoup de concepteurs de jeux étaient d’anciens programmeurs ou graphistes ; aujourd’hui, ils viennent davantage d’écoles spécialisées. Des connaissances en programmation ou en art sont très utiles.',
        },
        sourceId: Y.concepteurVoies.id,
      },
      { text: ASK },
    ],
    portraitId: 'portrait-roberta-williams',
    cultureLinks: [
      {
        targetId: 'person-ada-lovelace',
        explanation: {
          '6-10':
            'Un jeu vidéo est un programme. Ada Lovelace a écrit le premier programme publié.',
          '11-14':
            'Un jeu vidéo repose sur des programmes ; Ada Lovelace est l’autrice du premier programme informatique publié, au XIXᵉ siècle.',
        },
        sourceId: Y.concepteurDefinition.id,
      },
    ],
    sources: [Y.concepteurDefinition, Y.concepteurSeparation, Y.concepteurVoies, Y.williamsIntro],
    ...draft,
  },
  {
    id: 'metier-virologue',
    kind: 'career',
    image: careerImages.virologie,
    title: 'Chercheuse en virologie',
    unusual: false,
    doors: ['comprendre', 'resoudre'],
    hook: {
      '6-10': 'Comprendre les virus pour mieux soigner.',
      '11-14': 'Étudier les virus, comprendre comment ils infectent, et aider à lutter contre eux.',
    },
    daily: {
      '6-10':
        'Les virus sont si petits qu’on ne les voit pas avec un microscope ordinaire. Au laboratoire, on fait des expériences pour les repérer.',
      '11-14':
        'La virologie étudie les virus, leur structure et la manière dont ils infectent. Comme la plupart sont invisibles au microscope optique, on les détecte par des expériences de laboratoire et des mesures.',
    },
    problems: {
      '6-10': 'Comment un virus rend-il malade ? Comment le repérer ?',
      '11-14':
        'Comment un virus infecte-t-il un organisme ? Comment le détecter, et préparer des diagnostics ou des traitements ?',
    },
    skills: ['Rigueur', 'Biologie et chimie', 'Travail en équipe', 'Persévérance'],
    paths: [
      {
        text: {
          '6-10': 'Françoise Barré-Sinoussi a étudié la biologie à l’université, après le bac.',
          '11-14':
            'Un exemple de parcours, pas le seul : Françoise Barré-Sinoussi a étudié la biologie à l’université après le bac, puis fait de la recherche à l’Institut Pasteur.',
        },
        sourceId: Y.fbsEtudes.id,
      },
      { text: ASK },
    ],
    portraitId: 'portrait-francoise-barre-sinoussi',
    cultureLinks: [],
    sources: [Y.viroDefinition, Y.viroTaille, Y.fbsEtudes, Y.fbsEquipe],
    ...draft,
  },
  {
    id: 'metier-oceanographe',
    kind: 'career',
    image: careerImages.oceanographe,
    title: 'Océanographe',
    unusual: false,
    doors: ['nature', 'comprendre'],
    hook: {
      '6-10': 'Explorer les océans, encore très mal connus.',
      '11-14': 'Étudier les mers et les océans : courants, êtres vivants, climat.',
    },
    daily: {
      '6-10':
        'On étudie les courants, les animaux et les plantes de la mer, et le lien entre l’océan et le climat. On plonge, on mesure, on observe.',
      '11-14':
        'Les océanographes étudient les courants, les écosystèmes marins, les fonds et les liens entre océans et climat. Le travail mêle sorties en mer, plongées, données de satellites et analyses en laboratoire.',
    },
    problems: {
      '6-10': 'Les fonds marins sont presque inconnus : que s’y passe-t-il ?',
      '11-14':
        'Moins de 0,001 % des fonds marins profonds ont été observés directement. Comment l’océan réagit-il au changement climatique ? Comment protéger les récifs ?',
    },
    skills: [
      'Observation',
      'Sciences de la Terre et du vivant',
      'Goût du terrain',
      'Esprit d’équipe',
    ],
    paths: [
      {
        text: {
          '6-10': 'Sylvia Earle a fait de longues études sur les algues de la mer.',
          '11-14':
            'Un exemple de parcours, pas le seul : Sylvia Earle a fait des études universitaires jusqu’au doctorat, sur les algues marines.',
        },
        sourceId: Y.earleEtudes.id,
      },
      { text: ASK },
    ],
    portraitId: 'portrait-sylvia-earle',
    cultureLinks: [],
    sources: [Y.oceanoDefinition, Y.oceanoInconnu, Y.oceanoSatellite, Y.earleEtudes, Y.earleCoraux],
    ...draft,
  },
  {
    id: 'metier-volcanologue',
    kind: 'career',
    image: careerImages.volcanologue,
    title: 'Volcanologue',
    unusual: true,
    doors: ['nature', 'comprendre'],
    hook: {
      '6-10': 'Étudier les volcans pour protéger les gens.',
      '11-14': 'Comprendre les volcans et aider à prévoir les éruptions.',
    },
    daily: {
      '6-10':
        'Des appareils écoutent les petits tremblements sous le volcan. Les volcanologues étudient ces mesures pour savoir s’il va se réveiller.',
      '11-14':
        'Les volcanologues peuvent être géologues, chimistes, sismologues… Les sismographes détectent les microséismes qui annoncent la mise sous pression du magma. Le métier implique souvent de travailler avec les autorités chargées de la prévention.',
    },
    problems: {
      '6-10': 'Quand un volcan va-t-il entrer en éruption ? Comment prévenir les habitants ?',
      '11-14':
        'Comment prévoir une éruption à partir des mesures ? Comment aider les autorités à décider d’une évacuation ?',
    },
    skills: ['Sciences de la Terre', 'Physique et chimie', 'Calme et prudence', 'Communication'],
    paths: [
      {
        text: {
          '6-10': 'En France, on fait de longues études à l’université.',
          '11-14':
            'En France, on devient volcanologue après de longues études universitaires : un master, puis trois années de doctorat.',
        },
        sourceId: Y.volcanologueEtudes.id,
      },
      { text: ASK },
    ],
    portraitId: 'portrait-katia-krafft',
    cultureLinks: [],
    sources: [
      Y.volcanologueDefinition,
      Y.volcanologuePrevision,
      Y.volcanologueEtudes,
      Y.volcanoSismo,
    ],
    ...draft,
  },
  {
    id: 'metier-paleontologue',
    kind: 'career',
    image: careerImages.paleontologue,
    title: 'Paléontologue',
    unusual: true,
    doors: ['nature', 'comprendre', 'histoires'],
    hook: {
      '6-10': 'Retrouver la vie d’il y a des millions d’années grâce aux fossiles.',
      '11-14': 'La science des fossiles : reconstituer le vivant disparu et son évolution.',
    },
    daily: {
      '6-10':
        'On cherche des fossiles, on les étudie, et on compare avec les animaux d’aujourd’hui pour comprendre ceux d’autrefois.',
      '11-14':
        'Entre géologie et biologie, la paléontologie étudie les fossiles. Les paléontologues observent souvent les êtres vivants actuels pour comprendre ceux du passé : c’est le principe de l’actualisme.',
    },
    problems: {
      '6-10': 'À quoi ressemblaient les animaux disparus ? Comment vivaient-ils ?',
      '11-14':
        'Comment les espèces apparaissent-elles et disparaissent-elles ? Que nous apprennent les fossiles sur les climats et les milieux du passé ?',
    },
    skills: ['Observation', 'Biologie et géologie', 'Minutie', 'Patience'],
    paths: [
      {
        text: {
          '6-10':
            'Attention : ramasser des fossiles n’importe où peut abîmer des sites précieux. Les fouilles se font avec des spécialistes.',
          '11-14':
            'La « chasse aux fossiles » en amateur est parfois pratiquée illégalement, au détriment des données scientifiques : on fouille avec des équipes et dans le respect des règles.',
        },
        sourceId: Y.paleoAmateurs.id,
      },
      { text: ASK },
    ],
    portraitId: 'portrait-mary-anning',
    cultureLinks: [],
    sources: [Y.paleoDefinition, Y.paleoActualisme, Y.paleoAmateurs, Y.anningIntro],
    ...draft,
  },
];
