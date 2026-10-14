import type { CultureEntity } from '@/types';

import { categoryArtworks } from '../artworks';
import { wikidata, wikipedia } from './sources';

/**
 * Femmes artistes. Chaque résumé reprend des faits présents dans les extraits cités
 * (Wikipédia, consulté le 2026-10-12) ; dates et mouvements recoupés avec Wikidata.
 * Statut `draft` : textes non relus par l'équipe éditoriale.
 */
export const people: CultureEntity[] = [
  {
    id: 'person-sofonisba-anguissola',
    kind: 'person',
    domain: 'arts',
    title: 'Sofonisba Anguissola',
    hook: 'Portraitiste à la cour d’Espagne de Philippe II',
    subtitle: 'Peintre italienne',
    period: { label: 'vers 1532 – 1625', sortYear: 1532 },
    summary:
      'Née à Crémone vers 1532 et morte à Palerme en 1625, Sofonisba Anguissola est une peintre maniériste spécialisée dans le portrait. Elle étudie auprès du peintre Bernardino Campi, puis rejoint en 1559 la cour d’Espagne de Philippe II.',
    image: categoryArtworks['doubles-standards'],
    links: [
      { targetId: 'work-bernardino-campi-peignant-sofonisba', relation: 'created' },
      { targetId: 'movement-manierisme', relation: 'member-of' },
      { targetId: 'event-1559-cour-espagne', relation: 'took-part' },
    ],
    sources: [
      wikipedia(
        'Sofonisba Anguissola',
        'Sofonisba_Anguissola',
        'Sofonisba Anguissola, née à Crémone vers 1532 et morte à Palerme en 1625, est une artiste peintre italienne maniériste.',
      ),
      wikipedia(
        'Sofonisba Anguissola',
        'Sofonisba_Anguissola',
        'Entre 1546 et 1549, il fait étudier la jeune Sofonisba et sa sœur Elena auprès du peintre lombard Bernardino Campi, alors connu pour ses portraits et ses tableaux religieux.',
        'formation',
      ),
      wikidata(
        'Q236038',
        'Sofonisba Anguissola',
        'Lieux de naissance et de mort ; mouvement : maniérisme.',
      ),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'person-emily-mary-osborn',
    kind: 'person',
    domain: 'arts',
    title: 'Emily Mary Osborn',
    hook: 'Exposée à la Royal Academy dès 1851',
    subtitle: 'Peintre britannique',
    period: { label: '1828 – 1925', sortYear: 1828 },
    summary:
      'Peintre britannique née à Kentish Town en 1828, Emily Mary Osborn expose à Londres, notamment à la Royal Academy, à partir de 1851. Elle est membre de la Society of Lady Artists.',
    image: categoryArtworks['sexisme-quotidien'],
    links: [{ targetId: 'work-nameless-and-friendless', relation: 'created' }],
    sources: [
      wikipedia(
        'Emily Mary Osborn',
        'Emily_Mary_Osborn',
        "Emily Mary Osborn, née à Kentish Town, baptisée le 19 mars 1828 et morte le 14 avril 1925 à St John's Wood, est une peintre britannique.",
      ),
      wikipedia(
        'Emily Mary Osborn',
        'Emily_Mary_Osborn',
        'Elle expose à Londres, notamment à la Royal Academy, à partir de 1851.',
        'biographie',
      ),
      wikidata('Q5372282', 'Emily Mary Osborn', 'Dates et lieux de naissance et de mort.'),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'person-suzanne-valadon',
    kind: 'person',
    domain: 'arts',
    title: 'Suzanne Valadon',
    hook: 'De modèle des peintres à peintre elle-même',
    subtitle: 'Peintre et graveuse française',
    period: { label: '1865 – 1938', sortYear: 1865 },
    summary:
      'Suzanne Valadon entre dans le monde de la peinture comme modèle, avant de devenir elle-même peintre et graveuse. Parmi ses thèmes de prédilection figurent la nudité masculine et féminine, les portraits et les autoportraits.',
    image: categoryArtworks['medias-publicite'],
    links: [
      { targetId: 'work-la-chambre-bleue', relation: 'created' },
      { targetId: 'movement-postimpressionnisme', relation: 'member-of' },
      { targetId: 'event-1894-salon-societe-nationale', relation: 'took-part' },
    ],
    sources: [
      wikipedia(
        'Suzanne Valadon',
        'Suzanne_Valadon',
        'Elle entre dans le monde de la peinture non comme une autodidacte ou une élève des Beaux-Arts, mais comme modèle, puis devient artiste-peintre. Parmi ses thèmes de prédilection figurent la nudité masculine et féminine, et les portraits et autoportraits.',
      ),
      wikidata(
        'Q156889',
        'Suzanne Valadon',
        'Dates et lieux de naissance et de mort ; mouvement : postimpressionnisme.',
      ),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'person-rosa-bonheur',
    kind: 'person',
    domain: 'arts',
    title: 'Rosa Bonheur',
    hook: 'Peintre des animaux, célèbre de la France aux États-Unis',
    subtitle: 'Peintre et sculptrice française',
    period: { label: '1822 – 1899', sortYear: 1822 },
    summary:
      'Peintre et sculptrice spécialisée dans la représentation animalière, Rosa Bonheur connaît de son vivant une renommée considérable, en France comme aux États-Unis.',
    image: categoryArtworks.stereotypes,
    links: [
      { targetId: 'work-le-marche-aux-chevaux', relation: 'created' },
      { targetId: 'movement-realisme', relation: 'member-of' },
      { targetId: 'event-1800-permission-travestissement', relation: 'took-part' },
      { targetId: 'event-1853-salon-marche-aux-chevaux', relation: 'took-part' },
      { targetId: 'event-1865-legion-honneur', relation: 'took-part' },
    ],
    sources: [
      wikipedia(
        'Rosa Bonheur',
        'Rosa_Bonheur',
        'Marie-Rosalie Bonheur dite Rosa Bonheur, née le 16 mars 1822 à Bordeaux et morte le 25 mai 1899 à Thomery, est une artiste peintre et sculptrice française, spécialisée dans la représentation animalière. Adulée, décorée, elle connut une renommée incomparable de son vivant ; ses œuvres furent célébrées aux États-Unis et en France.',
      ),
      wikidata(
        'Q241732',
        'Rosa Bonheur',
        'Dates et lieux de naissance et de mort ; mouvement : réalisme.',
      ),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'person-artemisia-gentileschi',
    kind: 'person',
    domain: 'arts',
    title: 'Artemisia Gentileschi',
    hook: 'Parmi les premières à peindre des sujets historiques et religieux',
    subtitle: 'Peintre italienne',
    period: { label: '1593 – vers 1656', sortYear: 1593 },
    summary:
      'Peintre de l’école caravagesque, Artemisia Gentileschi s’impose par son art « à une époque où les femmes peintres ne sont pas facilement acceptées ». Elle est l’une des premières femmes à peindre des sujets historiques et religieux.',
    image: categoryArtworks.raisonnement,
    links: [
      { targetId: 'work-autoportrait-allegorie-peinture', relation: 'created' },
      { targetId: 'movement-caravagisme', relation: 'member-of' },
      { targetId: 'event-1616-academie-du-dessin', relation: 'took-part' },
    ],
    sources: [
      wikipedia(
        'Artemisia Gentileschi',
        'Artemisia_Gentileschi',
        "Remarquablement douée et aujourd'hui considérée comme l'une des premières peintres baroques, l'une des plus accomplies de sa génération, elle s'impose par son art à une époque où les femmes peintres ne sont pas facilement acceptées. Elle est également l'une des premières femmes à peindre des sujets historiques et religieux.",
      ),
      wikipedia(
        'Artemisia Gentileschi',
        'Artemisia_Gentileschi',
        "Artemisia Gentileschi, née le 8 juillet 1593 à Rome et morte à Naples vers 1656, est une artiste peintre italienne de l'école caravagesque.",
        'dates',
      ),
      wikidata(
        'Q212657',
        'Artemisia Gentileschi',
        'Mouvement : caravagisme. La date de mort y est indiquée comme 1653 ; Wikipédia retient « vers 1656 ».',
      ),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'person-mary-cassatt',
    kind: 'person',
    domain: 'arts',
    title: 'Mary Cassatt',
    hook: 'Passeuse de l’impressionnisme auprès des collectionneurs américains',
    subtitle: 'Peintre et graveuse américaine',
    period: { label: '1844 – 1926', sortYear: 1844 },
    summary:
      'Installée principalement en France à partir des années 1870, Mary Cassatt est l’une des rares femmes artistes associées à l’impressionnisme, dont elle contribue à faire connaître les œuvres auprès des collectionneurs américains.',
    image: categoryArtworks['histoire-culture'],
    links: [
      { targetId: 'work-jeunes-femmes-cueillant-des-fruits', relation: 'created' },
      { targetId: 'movement-impressionnisme', relation: 'member-of' },
      { targetId: 'event-1879-exposition-impressionnistes', relation: 'took-part' },
      { targetId: 'event-1915-soutien-suffragettes', relation: 'took-part' },
    ],
    sources: [
      wikipedia(
        'Mary Cassatt',
        'Mary_Cassatt',
        "Installée principalement en France à partir des années 1870, elle est l'une des rares femmes artistes associées à l'impressionnisme et participe à plusieurs de ses expositions.",
      ),
      wikipedia(
        'Mary Cassatt',
        'Mary_Cassatt',
        "Actrice importante des échanges artistiques entre la France et les États-Unis, Cassatt contribue aussi à faire connaître l'impressionnisme auprès des collectionneurs américains.",
        'collectionneurs',
      ),
      wikidata(
        'Q173223',
        'Mary Cassatt',
        'Dates de naissance et de mort ; mouvement : impressionnisme.',
      ),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
];
