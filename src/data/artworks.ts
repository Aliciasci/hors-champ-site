import { img } from '@/data/images';
import type { Artwork, CategoryId } from '@/types';

/**
 * Œuvres illustrant les catégories : uniquement des tableaux de peintres femmes,
 * lus comme des prises de position féministes. Tous dans le domaine public (ou CC0),
 * vérifié le 2026-10-12 via l'API de Wikimedia Commons (page liée dans `sourceUrl`).
 * Institutions : fiches Commons / Wikidata. Titres en français (traduction quand l'original
 * est dans une autre langue). Fichiers redimensionnés à 900 px ; cadre retiré pour Bonheur.
 */
export const categoryArtworks: Record<CategoryId, Artwork> = {
  'doubles-standards': {
    image: img('artworks/doubles-standards.jpg'),
    alt: 'Peinture : un homme barbu, pinceau à la main, semble achever le portrait d’une jeune femme en robe rouge, posé sur un chevalet.',
    title: 'Bernardino Campi peignant Sofonisba Anguissola',
    artist: 'Sofonisba Anguissola',
    date: 'vers 1559',
    holder: 'Pinacothèque nationale de Sienne',
    license: 'Domaine public',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Sofonisba_Anguissola_-_Bernardino_Campi_Painting_Sofonisba_Anguissola_-_WGA00696.jpg',
    focus: { top: '25%' },
  },
  'sexisme-quotidien': {
    image: img('artworks/sexisme-quotidien.jpg'),
    alt: 'Peinture : dans une boutique d’art, une jeune femme en noir présente un tableau à un marchand sceptique, tandis que deux hommes en haut-de-forme la dévisagent.',
    title: 'Nameless and Friendless (Sans nom et sans appui)',
    artist: 'Emily Mary Osborn',
    date: '1857',
    holder: 'Tate Britain, Londres',
    license: 'Domaine public',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Emily_Mary_Osborn_-_Nameless_and_Friendless._%22The_rich_man%27s_wealth_is_his_strong_city,_etc.%22_-_Proverbs,_x,_15_-_Google_Art_Project.jpg',
    focus: { top: '35%', left: '50%' },
  },
  'medias-publicite': {
    image: img('artworks/medias-publicite.jpg'),
    alt: 'Peinture : une femme en caraco rose et pantalon rayé, cigarette aux lèvres, allongée sur un lit aux draps bleus, à côté de deux livres.',
    title: 'La Chambre bleue',
    artist: 'Suzanne Valadon',
    date: '1923',
    holder: 'Centre Pompidou – Musée national d’art moderne, Paris',
    license: 'Domaine public',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:The_Blue_Room_by_Suzanne_Valadon.jpg',
    focus: { top: '30%', left: '70%' },
  },
  stereotypes: {
    image: img('artworks/stereotypes.jpg'),
    alt: 'Peinture : des palefreniers mènent au galop une foule de chevaux de trait, gris, blancs et bruns, sous un ciel d’orage.',
    title: 'Le Marché aux chevaux',
    artist: 'Rosa Bonheur',
    date: '1852-1855',
    holder: 'Metropolitan Museum of Art, New York',
    license: 'CC0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:The_Horse_Fair_MET_DT44.jpg',
    focus: { top: '50%', left: '45%' },
  },
  raisonnement: {
    image: img('artworks/raisonnement.jpg'),
    alt: 'Peinture : une femme peintre, palette dans une main, lève l’autre bras pour peindre sur une toile, le regard concentré.',
    title: 'Autoportrait en allégorie de la peinture',
    artist: 'Artemisia Gentileschi',
    date: 'vers 1638-1639',
    holder: 'Royal Collection, Royaume-Uni',
    license: 'Domaine public',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Self-portrait_as_the_Allegory_of_Painting_(La_Pittura)_-_Artemisia_Gentileschi.jpg',
    focus: { top: '25%', left: '55%' },
  },
  'histoire-culture': {
    image: img('artworks/histoire-culture.jpg'),
    alt: 'Peinture : dans un jardin, une jeune femme debout tend le bras pour cueillir un fruit, tandis qu’une autre, assise, la regarde.',
    title: 'Jeunes femmes cueillant des fruits',
    artist: 'Mary Cassatt',
    date: '1891',
    holder: 'Carnegie Museum of Art, Pittsburgh',
    license: 'Domaine public',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Mary_Cassatt%E2%80%94Young_Women_Picking_Fruit%E2%80%941891.jpg',
    focus: { top: '15%' },
  },
};
