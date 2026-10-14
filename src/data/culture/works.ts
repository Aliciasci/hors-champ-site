import type { Artwork, CultureEntity } from '@/types';

import { categoryArtworks } from '../artworks';
import { commons, wikipedia } from './sources';

/** Sous-titre d'une œuvre : son institution de conservation (la date est dans `period`). */
function workSubtitle(artwork: Artwork): string {
  return artwork.holder ?? 'Collection non précisée';
}

/**
 * Œuvres. Les descriptions s'en tiennent à ce que montre le tableau ; les faits
 * historiques sont appuyés par une source citée. Statut `draft` : non relu.
 */
export const works: CultureEntity[] = [
  {
    id: 'work-bernardino-campi-peignant-sofonisba',
    kind: 'work',
    domain: 'arts',
    title: categoryArtworks['doubles-standards'].title,
    subtitle: workSubtitle(categoryArtworks['doubles-standards']),
    period: { label: categoryArtworks['doubles-standards'].date, sortYear: 1559 },
    summary:
      'Sofonisba Anguissola y peint Bernardino Campi, le peintre auprès duquel elle a étudié, en train d’achever son portrait à elle sur un chevalet.',
    image: categoryArtworks['doubles-standards'],
    links: [{ targetId: 'idea-doubles-standards', relation: 'illustrates' }],
    sources: [
      commons(
        categoryArtworks['doubles-standards'].sourceUrl,
        categoryArtworks['doubles-standards'].title,
      ),
      wikipedia(
        'Sofonisba Anguissola',
        'Sofonisba_Anguissola',
        'Entre 1546 et 1549, il fait étudier la jeune Sofonisba et sa sœur Elena auprès du peintre lombard Bernardino Campi, alors connu pour ses portraits et ses tableaux religieux.',
        'formation',
      ),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'work-nameless-and-friendless',
    kind: 'work',
    domain: 'arts',
    title: categoryArtworks['sexisme-quotidien'].title,
    subtitle: workSubtitle(categoryArtworks['sexisme-quotidien']),
    period: { label: categoryArtworks['sexisme-quotidien'].date, sortYear: 1857 },
    summary:
      'Dans une boutique d’art, une jeune femme vêtue de noir présente un tableau à un marchand, tandis que deux hommes en haut-de-forme la regardent.',
    image: categoryArtworks['sexisme-quotidien'],
    links: [{ targetId: 'idea-sexisme-quotidien', relation: 'illustrates' }],
    sources: [
      commons(
        categoryArtworks['sexisme-quotidien'].sourceUrl,
        categoryArtworks['sexisme-quotidien'].title,
      ),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'work-la-chambre-bleue',
    kind: 'work',
    domain: 'arts',
    title: categoryArtworks['medias-publicite'].title,
    subtitle: workSubtitle(categoryArtworks['medias-publicite']),
    period: { label: categoryArtworks['medias-publicite'].date, sortYear: 1923 },
    summary:
      'Une femme en caraco et pantalon rayé, cigarette aux lèvres, est allongée sur un lit aux draps bleus, à côté de deux livres.',
    image: categoryArtworks['medias-publicite'],
    links: [{ targetId: 'idea-medias-publicite', relation: 'illustrates' }],
    sources: [
      commons(
        categoryArtworks['medias-publicite'].sourceUrl,
        categoryArtworks['medias-publicite'].title,
      ),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'work-le-marche-aux-chevaux',
    kind: 'work',
    domain: 'arts',
    title: categoryArtworks.stereotypes.title,
    subtitle: workSubtitle(categoryArtworks.stereotypes),
    period: { label: categoryArtworks.stereotypes.date, sortYear: 1852 },
    summary:
      'Un tableau de très grande taille (2,44 × 5 m) présenté au Salon de 1853, qui fait la notoriété de Rosa Bonheur. Des palefreniers y mènent une foule de chevaux de trait.',
    image: categoryArtworks.stereotypes,
    links: [{ targetId: 'idea-stereotypes', relation: 'illustrates' }],
    sources: [
      commons(categoryArtworks.stereotypes.sourceUrl, categoryArtworks.stereotypes.title),
      wikipedia(
        'Rosa Bonheur',
        'Rosa_Bonheur',
        'Avec son tableau de très grande taille Le Marché aux chevaux (2,44 × 5 m), présenté au Salon de 1853, Rosa Bonheur acquiert une grande notoriété.',
        'marche-aux-chevaux',
      ),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'work-autoportrait-allegorie-peinture',
    kind: 'work',
    domain: 'arts',
    title: categoryArtworks.raisonnement.title,
    subtitle: workSubtitle(categoryArtworks.raisonnement),
    period: { label: categoryArtworks.raisonnement.date, sortYear: 1638 },
    summary:
      'L’artiste se représente palette en main, le bras levé vers la toile, absorbée par son travail.',
    image: categoryArtworks.raisonnement,
    links: [{ targetId: 'idea-raisonnement', relation: 'illustrates' }],
    sources: [
      commons(categoryArtworks.raisonnement.sourceUrl, categoryArtworks.raisonnement.title),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'work-jeunes-femmes-cueillant-des-fruits',
    kind: 'work',
    domain: 'arts',
    title: categoryArtworks['histoire-culture'].title,
    subtitle: workSubtitle(categoryArtworks['histoire-culture']),
    period: { label: categoryArtworks['histoire-culture'].date, sortYear: 1891 },
    summary:
      'Dans un jardin, une jeune femme debout tend le bras vers un fruit, tandis qu’une autre, assise, la regarde.',
    image: categoryArtworks['histoire-culture'],
    links: [{ targetId: 'idea-histoire-culture', relation: 'illustrates' }],
    sources: [
      commons(
        categoryArtworks['histoire-culture'].sourceUrl,
        categoryArtworks['histoire-culture'].title,
      ),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
];
