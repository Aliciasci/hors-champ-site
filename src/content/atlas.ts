import { img } from '@/data/images';
import type { Artwork } from '@/types';

/** Thème Atlas : la photographie d'archives du collage de la page du monde. */
export const ATLAS_WORLD_PHOTO: Artwork = {
  image: img('people/suffragettes-1910.jpg'),
  alt: 'Photographie en noir et blanc : trois suffragettes en manteau et chapeau blanc posent sur un toit de New York, l’une tient une lance, l’autre un drapeau américain, la troisième porte une sacoche « Votes for women ».',
  title: 'Suffragettes avec un drapeau',
  artist: 'Bain News Service',
  date: '1910',
  holder: 'Bibliothèque du Congrès',
  license: 'Domaine public',
  sourceUrl: 'https://commons.wikimedia.org/wiki/File:Suffragettes_with_flag_LCCN2014690979.jpg',
  focus: { top: '30%' },
};
