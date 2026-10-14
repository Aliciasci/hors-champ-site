import { img } from '@/data/images';
import type { Artwork, Source } from '@/types';

/**
 * Ouverture de la une : la photographie du cinquième conseil Solvay (1927). Le cadre part serré
 * sur les hommes, s'élargit, puis la lumière se pose sur la seule femme, Marie Curie.
 */
export const OPENING_PHOTO: Artwork = {
  image: img('people/solvay-1927.jpg'),
  alt: 'Photographie de groupe du cinquième conseil Solvay, à Bruxelles en 1927 : vingt-neuf personnes en costume sombre, dont une seule femme, Marie Curie, assise au premier rang.',
  title: 'Cinquième conseil Solvay',
  artist: 'Benjamin Couprie',
  date: '1927',
  license: 'Domaine public',
  sourceUrl: 'https://commons.wikimedia.org/wiki/File:Solvay_conference_1927.jpg',
};

/** Positions sur la photo, en pourcentage de sa largeur et de sa hauteur. */
export const OPENING_FOCUS = {
  /** Le cadre serré du début : des hommes seulement. */
  men: { x: 62, y: 60 },
  /** Marie Curie, assise au premier rang. */
  curie: { x: 30.4, y: 58 },
};

export const OPENING_PERSON_ID = 'person-marie-curie';

export const OPENING_SOURCES: Source[] = [
  {
    id: 'wikipedia-congres_solvay-1927',
    title: 'Congrès Solvay',
    publisher: 'Wikipédia',
    url: 'https://fr.wikipedia.org/wiki/Congr%C3%A8s_Solvay',
    sourceType: 'encyclopedia',
    accessedAt: '2026-10-14',
    relevantExcerpt:
      'Le Conseil le plus connu fut probablement le cinquième Conseil international Solvay, en octobre 1927, dont le thème intitulé « Électrons et Photons » portait principalement sur la mécanique quantique : dix-sept des vingt-neuf personnalités présentes à ce congrès (soit plus de la moitié) étaient ou allaient devenir lauréates du prix Nobel.',
  },
  {
    id: 'wikipedia-congres_solvay-curie',
    title: 'Congrès Solvay',
    publisher: 'Wikipédia',
    url: 'https://fr.wikipedia.org/wiki/Congr%C3%A8s_Solvay',
    sourceType: 'encyclopedia',
    accessedAt: '2026-10-14',
    relevantExcerpt:
      'Pendant longtemps, Marie Curie fut la seule femme à avoir participé à un congrès Solvay.',
  },
];
