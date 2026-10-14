import type { Category } from '@/types';

import { categoryArtworks } from './artworks';

export const categories: Category[] = [
  {
    id: 'doubles-standards',
    title: 'Doubles standards',
    shortTitle: 'Doubles standards',
    description: 'Quand un même comportement est jugé différemment selon le genre de la personne.',
    artwork: categoryArtworks['doubles-standards'],
    motif: 'split',
  },
  {
    id: 'sexisme-quotidien',
    title: 'Sexisme au quotidien',
    shortTitle: 'Quotidien',
    description: 'Les situations ordinaires — au travail, en famille, dans la rue — où il se loge.',
    artwork: categoryArtworks['sexisme-quotidien'],
    motif: 'circles',
  },
  {
    id: 'medias-publicite',
    title: 'Médias et publicité',
    shortTitle: 'Médias & pub',
    description: 'Lire une image, un titre, une campagne : ce qui est montré, et comment.',
    artwork: categoryArtworks['medias-publicite'],
    motif: 'frame',
  },
  {
    id: 'stereotypes',
    title: 'Stéréotypes',
    shortTitle: 'Stéréotypes',
    description: 'Les idées toutes faites sur ce que seraient « les femmes » et « les hommes ».',
    artwork: categoryArtworks['stereotypes'],
    motif: 'stripes',
  },
  {
    id: 'raisonnement',
    title: 'Raisonnement et arguments',
    shortTitle: 'Arguments',
    description: 'Repérer les raccourcis, les sophismes et les conclusions trop rapides.',
    artwork: categoryArtworks['raisonnement'],
    motif: 'arrows',
  },
  {
    id: 'histoire-culture',
    title: 'Histoire et culture',
    shortTitle: 'Histoire',
    description: 'Le contexte qui éclaire les débats d’aujourd’hui.',
    artwork: categoryArtworks['histoire-culture'],
    motif: 'arch',
  },
];
