import { img } from '@/data/images';
import type { Artwork } from '@/types';

import { portraits } from './portraits';

/**
 * Images des inventions et découvertes : la trace concrète de chaque travail
 * (document, brevet, photo d'époque). Licences vérifiées le 2026-10-12 sur Wikimedia Commons.
 * Fichiers redimensionnés à 900 px (sans agrandissement).
 */
export const inventionImages = {
  'premier-programme': {
    image: img('inventions/premier-programme.jpg'),
    alt: 'Gravure ancienne : un grand tableau à colonnes, intitulé « Diagram for the computation by the Engine of the Numbers of Bernoulli. See Note G », listant les opérations et les variables de la machine.',
    title: 'Tableau de calcul des nombres de Bernoulli (note G)',
    artist: 'Ada Lovelace',
    date: '1842',
    license: 'Domaine public',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Diagram_for_the_computation_of_Bernoulli_numbers.jpg',
  },
  'polonium-radium': {
    image: img('inventions/polonium-radium.jpg'),
    alt: 'Photographie en noir et blanc : Pierre Curie debout et Marie Curie assise, de part et d’autre d’un appareil de mesure dans leur laboratoire.',
    title: 'Marie et Pierre Curie dans leur laboratoire',
    artist: 'Photographe inconnu',
    date: 'vers 1904',
    license: 'Domaine public',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Pierre_and_Marie_Curie.jpg',
    focus: { top: '30%', left: '60%' },
  },
  'theoreme-de-noether': {
    image: img('inventions/theoreme-de-noether.jpg'),
    alt: 'Page imprimée en allemand : titre « Invariante Variationsprobleme », par Emmy Noether à Göttingen, présenté par F. Klein le 26 juillet 1918.',
    title: 'Première page de « Invariante Variationsprobleme »',
    artist: 'Emmy Noether',
    date: '1918',
    license: 'Domaine public',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Noether_theorem_1st_page.png',
    focus: { top: '0%' },
  },
  'saut-de-frequence': {
    image: img('inventions/saut-de-frequence.jpg'),
    alt: 'Planche de brevet : schémas d’une bande perforée et d’un mécanisme à pistons, intitulée « Secret Communication System », signée Hedy Kiesler Markey et George Antheil.',
    title: 'Brevet américain n° 2 292 387, planche 2',
    artist: 'Hedy Kiesler Markey (Hedy Lamarr) et George Antheil — Office américain des brevets',
    date: '1942',
    license: 'Domaine public',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Patent_Case_File_No._2,292,387,_Secret_Communication_System,_Inventors_Hedy_Kiesler_Markey_and_George_Antheil_-_DPLA_-_128f022cfd9421aa10de72958a7edf90_(page_7).jpg',
    focus: { top: '42%' },
  },
  'compilateur-cobol': {
    image: img('inventions/compilateur-cobol.jpg'),
    alt: 'Photographie en noir et blanc : Grace Hopper, assise devant le pupitre de commande de l’UNIVAC, consulte un listing entourée de trois collègues.',
    title:
      'Grace Hopper au pupitre de l’UNIVAC, avec le département de programmation automatique de Remington Rand',
    artist: 'Smithsonian Institution (négatif SI 83-14878)',
    date: 'juin 1957',
    license: 'CC BY 2.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Grace_Hopper_and_UNIVAC.jpg',
    focus: { top: '30%', left: '60%' },
  },
  'cliche-51': {
    image: img('inventions/cliche-51.jpg'),
    alt: 'Illustration en couleurs : une double hélice d’ADN, ses deux brins reliés par des barreaux colorés.',
    title: 'Illustration de la double hélice d’ADN (ce n’est pas le cliché 51)',
    artist: 'National Human Genome Research Institute',
    date: 'date inconnue',
    license: 'Domaine public',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:DNA_Double_Helix_by_NHGRI.jpg',
  },
  'trajectoire-friendship-7': {
    image: img('inventions/trajectoire-friendship-7.jpg'),
    alt: 'Photographie en couleurs : la fusée Atlas portant la capsule Friendship 7 décolle à côté de sa tour rouge, dans un nuage de fumée.',
    title: 'Décollage de Mercury-Atlas 6 (Friendship 7)',
    artist: 'NASA',
    date: '20 février 1962',
    license: 'Domaine public',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Launch_of_Friendship_7_-_GPN-2000-000686.jpg',
    focus: { top: '15%' },
  },
  /** Aucune image libre et sûre de la découverte : le portrait de Lise Meitner. */
  'fission-nucleaire': portraits['lise-meitner'],
} satisfies Record<string, Artwork>;
