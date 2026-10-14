import { img } from '@/data/images';
import type { Artwork } from '@/types';

/**
 * Portraits des scientifiques, tous dans le domaine public (licence vérifiée le 2026-10-12
 * sur Wikimedia Commons, page liée dans `sourceUrl`). Pas de portrait pour Hedy Lamarr
 * (domaine public aux États-Unis seulement) ni pour Rosalind Franklin (CC BY-SA).
 * Fichiers redimensionnés à 900 px.
 */
export const portraits = {
  'ada-lovelace': {
    image: img('people/ada-lovelace.jpg'),
    alt: 'Portrait peint en pied : une jeune femme en robe de satin blanc et étole rouge, un diadème dans les cheveux, debout au pied d’un escalier.',
    title: 'Portrait d’Ada Lovelace',
    artist: 'Margaret Sarah Carpenter',
    date: '1836',
    license: 'Domaine public',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Ada_Lovelace.jpg',
    focus: { top: '10%' },
  },
  'marie-curie': {
    image: img('people/marie-curie.jpg'),
    alt: 'Photographie en noir et blanc : portrait de Marie Curie, cheveux relevés, de face.',
    title: 'Portrait de Marie Curie',
    artist: 'Auteur inconnu',
    date: 'vers 1900',
    license: 'Domaine public',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Marie_Curie_(1900)_(cropped).jpg',
    focus: { top: '20%' },
  },
  'emmy-noether': {
    image: img('people/emmy-noether.jpg'),
    alt: 'Photographie ancienne : Emmy Noether debout, chemisier rayé et nœud sombre au col, une main posée sur le dossier d’une chaise.',
    title: 'Portrait d’Emmy Noether',
    artist: 'Auteur inconnu',
    date: 'avant 1910',
    license: 'Domaine public',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Noether.jpg',
    focus: { top: '12%' },
  },
  'lise-meitner': {
    image: img('people/lise-meitner.jpg'),
    alt: 'Photographie en noir et blanc : Lise Meitner, souriante, devant une table de conférence où sont posés des modèles moléculaires.',
    title: 'Lise Meitner donnant une conférence à l’université catholique de Washington',
    artist: 'Smithsonian Institution',
    date: '1946',
    license: 'Domaine public',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Lise_Meitner_(1878-1968),_lecturing_at_Catholic_University,_Washington,_D.C.,_1946.jpg',
    focus: { top: '15%' },
  },
  'grace-hopper': {
    image: img('people/grace-hopper.jpg'),
    alt: 'Photographie officielle en couleurs : Grace Hopper en uniforme de la marine américaine, bras croisés, devant un drapeau des États-Unis.',
    title: 'Portrait officiel du commodore Grace M. Hopper',
    artist: 'James S. Davis (US Navy)',
    date: '1984',
    license: 'Domaine public',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Commodore_Grace_M._Hopper,_USN_(covered).jpg',
    focus: { top: '20%', left: '60%' },
  },
  'katherine-johnson': {
    image: img('people/katherine-johnson.jpg'),
    alt: 'Photographie en noir et blanc : portrait de Katherine Johnson, lunettes et veste de velours, souriante.',
    title: 'Portrait de Katherine Johnson',
    artist: 'NASA',
    date: '1983',
    license: 'Domaine public',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Katherine_Johnson_1983.jpg',
    focus: { top: '25%' },
  },
} satisfies Record<string, Artwork>;
