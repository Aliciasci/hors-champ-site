import { img } from '@/data/images';
import type { Artwork } from '@/types';

/**
 * Images des fiches métier, vérifiées le 2026-10-12 sur Wikimedia Commons : domaine public
 * (archives d'institutions publiques), sauf l'Apple II (CC BY 2.0, photographe crédité).
 */
export const careerImages = {
  astronome: {
    image: img('youth/metier-astronome-harvard.jpg'),
    alt: 'Photographie ancienne en noir et blanc : une dizaine de femmes travaillent dans un bureau, penchées sur des plaques photographiques du ciel et des registres.',
    title: 'Les « calculatrices » de l’observatoire de Harvard',
    artist: 'Harvard College Observatory',
    date: 'vers 1891',
    license: 'Domaine public',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Astronomer_Edward_Charles_Pickering%27s_Harvard_computers.jpg',
    focus: { top: '40%' },
  },
  jeux: {
    image: img('youth/metier-jeux-apple-ii.jpg'),
    alt: 'Photographie en couleurs : un ordinateur Apple II beige, avec son clavier et un écran qui affiche du texte vert, exposé dans un musée.',
    title: 'Un Apple II Plus au Museum of the Moving Image, New York',
    artist: 'Marcin Wichary',
    date: '2007',
    license: 'CC BY 2.0',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Apple_II_Plus,_Museum_of_the_Moving_Image.jpg',
    focus: { top: '40%' },
  },
  virologie: {
    image: img('youth/metier-virologie-vih.jpg'),
    alt: 'Image de microscope électronique colorisée : de minuscules particules vertes de virus à la surface d’une cellule bleue et rose.',
    title: 'Le VIH vu au microscope électronique à balayage',
    artist: 'C. Goldsmith, CDC',
    date: '1984',
    license: 'Domaine public',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:HIV-budding-Color.jpg',
    focus: { top: '40%' },
  },
  oceanographe: {
    image: img('youth/metier-oceanographe-tektite.jpg'),
    alt: 'Photographie en couleurs : des femmes en tenue de plongée, autour d’un appareil respiratoire posé sur une table, devant un tableau couvert de schémas.',
    title: 'L’équipe féminine de Tektite II, menée par Sylvia Earle, à l’entraînement',
    artist: 'National Undersea Research Program, NOAA',
    date: '1970',
    license: 'Domaine public',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Sylvia_Earle-nur09015.jpg',
    focus: { top: '50%' },
  },
  volcanologue: {
    image: img('youth/metier-volcanologue-lave.jpg'),
    alt: 'Photographie en couleurs : sur une coulée de lave noire, une personne en combinaison et gants prélève avec un marteau de la lave orange encore en fusion ; un seau d’eau est posé à côté.',
    title: 'Prélèvement de lave sur le Kīlauea, Hawaï',
    artist: 'Observatoire volcanologique d’Hawaï, USGS',
    date: '26 juin 2009',
    license: 'Domaine public',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Sampling_lava_with_hammer_and_bucket.jpg',
    focus: { top: '50%' },
  },
  paleontologue: {
    image: img('youth/metier-paleontologue-plesiosaure.jpg'),
    alt: 'Lettre manuscrite ancienne : en haut, le croquis à l’encre du squelette d’un plésiosaure, au long cou ; en dessous, quelques lignes d’écriture.',
    title: 'Lettre de Mary Anning sur la découverte du plésiosaure, avec son croquis',
    artist: 'Mary Anning',
    date: '26 décembre 1823',
    holder: 'Wellcome Collection',
    license: 'Domaine public',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Mary_Anning_Plesiosaurus.jpg',
    focus: { top: '15%' },
  },
} satisfies Record<string, Artwork>;
