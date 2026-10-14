import { img } from '@/data/images';
import type { Artwork } from '@/types';

/**
 * Portraits et documents d'archives de « Derrière chaque droit ». Licences vérifiées le
 * 2026-10-12 sur Wikimedia Commons. Pas d'image libre et sûre pour Simone de Beauvoir,
 * Gisèle Halimi, Yvette Roudy, Brigitte Gros (CC BY-SA) ni Louise Weiss (licence du
 * Parlement européen) : leurs fiches affichent un emblème.
 */
export const rightsImages = {
  'olympe-de-gouges': {
    image: img('rights/olympe-de-gouges.jpg'),
    alt: 'Portrait peint : une femme aux cheveux poudrés, en robe claire, regarde vers la gauche.',
    title: 'Portrait d’Olympe de Gouges',
    artist: 'Alexander Kucharsky',
    date: 'fin du XVIIIᵉ siècle',
    license: 'Domaine public',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Marie-Olympe-de-Gouges.jpg',
    focus: { top: '15%' },
  },
  'declaration-1791': {
    image: img('rights/declaration-1791.jpg'),
    alt: 'Page imprimée ancienne : « Déclaration des droits de la femme et de la citoyenne, à décréter par l’Assemblée nationale », suivie du préambule.',
    title: 'Déclaration des droits de la femme et de la citoyenne, première page',
    artist: 'Olympe de Gouges',
    date: '1791',
    license: 'Domaine public',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:DDFC.jpg',
    focus: { top: '0%' },
  },
  'hubertine-auclert': {
    image: img('rights/hubertine-auclert.jpg'),
    alt: 'Photographie en noir et blanc : Hubertine Auclert assise à un bureau couvert de papiers, dans une pièce aux étagères chargées.',
    title: 'Madame Hubertine Auclert',
    artist: 'Agence Rol',
    date: '1910',
    license: 'Domaine public',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Agence_Rol_-_1910_-_Madame_Hubertine_Auclert.jpg',
    focus: { top: '30%', left: '40%' },
  },
  'cecile-brunschvicg': {
    image: img('rights/cecile-brunschvicg.jpg'),
    alt: 'Photographie en noir et blanc : portrait de Cécile Brunschvicg, assise, un collier sur sa robe.',
    title: 'Portrait de Cécile Brunschvicg',
    artist: 'Henri Manuel',
    date: 'entre 1926 et 1936',
    license: 'Domaine public',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:C%C3%A9cile_Brunschvicg_(cropped).jpg',
    focus: { top: '15%' },
  },
  'julie-victoire-daubie': {
    image: img('rights/julie-victoire-daubie.jpg'),
    alt: 'Photographie ancienne en pied : Julie-Victoire Daubié debout, en robe longue, une main posée sur une table.',
    title: 'Portrait de Julie-Victoire Daubié',
    artist: 'Pierre Petit',
    date: '1861',
    license: 'Domaine public',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:J.V_Daubi%C3%A9.jpg',
    focus: { top: '10%' },
  },
  'simone-veil': {
    image: img('rights/simone-veil.jpg'),
    alt: 'Photographie en couleurs : portrait de Simone Veil, cheveux relevés, le regard tourné vers la droite.',
    title: 'Simone Veil au gymnase Japy, Paris',
    artist: 'Marie-Lan Nguyen',
    date: '27 février 2008',
    license: 'CC BY 3.0',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Simone_Veil,_gymnase_Japy_2008_02_27_n3_ret.jpg',
    focus: { top: '15%' },
  },
} satisfies Record<string, Artwork>;
