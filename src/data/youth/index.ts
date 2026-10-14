import type { ExploreDoor, YouthItem, YouthLife } from '@/types';

import { activities } from './activities';
import { careers } from './careers';
import { youthPortraits } from './portraits';

export { activities, careers, youthPortraits };

/** Portes d'entrée de « Qu'est-ce que tu aimerais explorer aujourd'hui ? ». */
export const EXPLORE_DOORS: { id: ExploreDoor; label: string }[] = [
  { id: 'comprendre', label: 'Comprendre le monde' },
  { id: 'inventer', label: 'Inventer quelque chose' },
  { id: 'creer', label: 'Créer une œuvre' },
  { id: 'resoudre', label: 'Résoudre un problème' },
  { id: 'nature', label: 'Explorer la nature' },
  { id: 'histoires', label: 'Découvrir des histoires vraies' },
];

/**
 * « Les vies qu'on n'imagine pas » : des collections qui mêlent métiers, portraits, activités et
 * fiches culturelles existantes. Les collections sans contenu documenté ne sont pas créées.
 */
export const youthLives: YouthLife[] = [
  {
    id: 'vie-oceans',
    title: 'Explorer les océans',
    intro: {
      '6-10': 'Plonger, observer, comprendre la vie sous la mer.',
      '11-14': 'Des fonds encore presque inconnus, à explorer et à protéger.',
    },
    itemIds: ['metier-oceanographe', 'portrait-sylvia-earle'],
  },
  {
    id: 'vie-etoiles',
    title: 'Étudier les étoiles',
    intro: {
      '6-10': 'Les galaxies, les étoiles et les voyages dans l’espace.',
      '11-14':
        'Observer l’Univers, calculer des trajectoires : plusieurs façons de travailler sur l’espace.',
    },
    itemIds: ['metier-astronome', 'portrait-francoise-combes', 'person-katherine-johnson'],
  },
  {
    id: 'vie-films-jeux',
    title: 'Créer des films et des jeux',
    intro: {
      '6-10': 'Raconter des histoires avec des images, des règles et des énigmes.',
      '11-14':
        'Filmer des volcans, concevoir des jeux d’aventure : la création prend bien des formes.',
    },
    itemIds: [
      'metier-conceptrice-jeux',
      'portrait-roberta-williams',
      'portrait-katia-krafft',
      'activite-enigme',
      'activite-observer',
    ],
  },
  {
    id: 'vie-technologies',
    title: 'Inventer des technologies',
    intro: {
      '6-10': 'Des programmes, des codes secrets, des robots.',
      '11-14': 'Programmes, langages informatiques, systèmes de communication, robots.',
    },
    itemIds: [
      'person-ada-lovelace',
      'person-grace-hopper',
      'person-hedy-lamarr',
      'activite-robot',
      'activite-pont',
    ],
  },
  {
    id: 'vie-terre',
    title: 'Comprendre la Terre et son passé',
    intro: {
      '6-10': 'Des volcans aux fossiles, lire l’histoire de notre planète.',
      '11-14':
        'Volcans, fossiles, roches : la Terre garde la trace de son passé et de ses dangers.',
    },
    itemIds: [
      'metier-volcanologue',
      'portrait-katia-krafft',
      'metier-paleontologue',
      'portrait-mary-anning',
    ],
  },
  {
    id: 'vie-lois',
    title: 'Faire évoluer les lois',
    intro: {
      '6-10': 'Des femmes qui se sont battues pour changer les règles.',
      '11-14':
        'Avocates, militantes, ministres : des femmes qui ont contribué à faire évoluer les droits.',
    },
    itemIds: ['person-gisele-halimi', 'person-simone-veil', 'right-droit-de-vote', 'right-ivg'],
  },
  {
    id: 'vie-entreprendre',
    title: 'Entreprendre et lancer un projet',
    intro: {
      '6-10': 'Créer son entreprise pour faire exister une idée.',
      '11-14': 'Fonder une entreprise de jeux vidéo, ou de sous-marins de recherche.',
    },
    itemIds: ['portrait-roberta-williams', 'portrait-sylvia-earle'],
  },
];

export const localYouthItems: YouthItem[] = [...careers, ...youthPortraits, ...activities];
