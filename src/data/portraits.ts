import { img } from '@/data/images';
import type { Artwork } from '@/types';

/**
 * Portraits des scientifiques, tous dans le domaine public (licence vérifiée le 2026-10-12
 * sur Wikimedia Commons, page liée dans `sourceUrl`). Pas de portrait pour Hedy Lamarr
 * (domaine public aux États-Unis seulement) ni pour Rosalind Franklin (CC BY-SA).
 * Fichiers redimensionnés à 900 px.
 *
 * Contemporaines (licence vérifiée le 2026-10-14) : photographies officielles d'agences fédérales
 * américaines, dans le domaine public. Pas de portrait libre et utilisable pour Wangari Maathai,
 * Tu Youyou, Zaha Hadid, Katalin Karikó, Emmanuelle Charpentier ni Agnès Varda.
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
  'ruth-bader-ginsburg': {
    image: img('people/ruth-bader-ginsburg.jpg'),
    alt: 'Photographie officielle en couleurs : Ruth Bader Ginsburg assise, lunettes, robe de juge noire et col de dentelle blanche.',
    title: 'Portrait officiel de Ruth Bader Ginsburg',
    artist: 'Cour suprême des États-Unis',
    date: '2016',
    license: 'Domaine public',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Ruth_Bader_Ginsburg_2016_portrait_cropped.jpg',
    focus: { top: '15%' },
  },
  'toni-morrison': {
    image: img('people/toni-morrison.jpg'),
    alt: 'Photographie en couleurs : Toni Morrison riant aux éclats, foulard clair dans les cheveux, pendant une conférence.',
    title: 'Toni Morrison lors d’une conférence à West Point',
    artist: 'Académie militaire de West Point',
    date: '2013',
    license: 'Domaine public',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:ToniMorrison_WestPointLecture_2013_(cropped).jpg',
    focus: { top: '25%' },
  },
  'ellen-johnson-sirleaf': {
    image: img('people/ellen-johnson-sirleaf.jpg'),
    alt: 'Photographie en couleurs : Ellen Johnson Sirleaf, turban et étole brune, parle derrière un pupitre à Monrovia.',
    title: 'Ellen Johnson Sirleaf s’adressant aux diplômés des forces armées du Liberia',
    artist: 'Elizabeth Merriam (US Navy)',
    date: '2008',
    license: 'Domaine public',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Ellen_Johnson-Sirleaf_detail_080327-N-0193M-039.jpg',
    focus: { top: '20%' },
  },
  'malala-yousafzai': {
    image: img('people/malala-yousafzai.jpg'),
    alt: 'Photographie en couleurs : Malala Yousafzai de trois quarts, voile bleu sur les cheveux, devant une porte en bois.',
    title: 'Malala Yousafzai au département d’État américain (recadrage)',
    artist: 'Département d’État des États-Unis',
    date: '2021',
    license: 'Domaine public',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Malala_Yousafzai_-_2021_(51728088292)_(cropped).jpg',
    focus: { top: '25%', left: '55%' },
  },
  'mae-jemison': {
    image: img('people/mae-jemison.jpg'),
    alt: 'Photographie officielle en couleurs : Mae Jemison souriante, en combinaison orange d’astronaute, col de casque autour du cou.',
    title: 'Portrait officiel de Mae Jemison',
    artist: 'NASA',
    date: '1992',
    license: 'Domaine public',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Mae_Carol_Jemison_(cropped_2).jpg',
    focus: { top: '20%' },
  },
  'jane-goodall': {
    image: img('people/jane-goodall.jpg'),
    alt: 'Photographie en couleurs : Jane Goodall, cheveux blancs attachés, pull à col roulé et étole verte, devant des fleurs.',
    title: 'Jane Goodall au département d’État américain',
    artist: 'Département d’État des États-Unis',
    date: '2015',
    license: 'Domaine public',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Jane_Goodall_2015.jpg',
    focus: { top: '25%' },
  },
} satisfies Record<string, Artwork>;
