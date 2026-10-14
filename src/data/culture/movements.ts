import type { CultureEntity } from '@/types';

import { wikipedia } from './sources';

/** Mouvements artistiques auxquels Wikidata rattache les artistes de la collection. */
export const movements: CultureEntity[] = [
  {
    id: 'movement-manierisme',
    kind: 'movement',
    domain: 'arts',
    title: 'Maniérisme',
    subtitle: 'Mouvement artistique',
    period: { label: 'vers 1520 – début du XVIIᵉ siècle', sortYear: 1520 },
    summary:
      'Mouvement artistique qui s’étend d’environ 1520 aux premières années du XVIIᵉ siècle. Il ne se limite pas à l’Italie et se propage en Europe.',
    links: [],
    sources: [
      wikipedia(
        'Maniérisme',
        'Maniérisme',
        "Le maniérisme est un mouvement artistique qui s'étend entre 1520 environ (mort du peintre Raphaël) et les premières années du XVIIe siècle.",
      ),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'movement-caravagisme',
    kind: 'movement',
    domain: 'arts',
    title: 'Caravagisme',
    subtitle: 'Courant pictural',
    period: { label: 'première moitié du XVIIᵉ siècle', sortYear: 1600 },
    summary:
      'Courant pictural de la première moitié du XVIIᵉ siècle, apparu à la suite de l’œuvre du Caravage à la fin du XVIᵉ siècle.',
    links: [],
    sources: [
      wikipedia(
        'Caravagisme',
        'Caravagisme',
        'Le caravagisme, ou école caravagesque, est un courant pictural de la première moitié du XVIIe siècle.',
      ),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'movement-realisme',
    kind: 'movement',
    domain: 'arts',
    title: 'Réalisme',
    subtitle: 'Mouvement artistique',
    period: { label: 'milieu du XIXᵉ siècle', sortYear: 1850 },
    summary:
      'Mouvement apparu en France et en Grande-Bretagne au milieu du XIXᵉ siècle. Il se caractérise par une quête du réel, une représentation brute de la vie quotidienne et l’exploration de thèmes sociétaux.',
    links: [],
    sources: [
      wikipedia(
        'Réalisme (peinture)',
        'Réalisme_(peinture)',
        "Le réalisme est un mouvement artistique apparu en France et en Grande-Bretagne au milieu du XIXe siècle, qui, affirmant sa différence d'avec le romantisme, se caractérise par une quête du réel, une représentation brute de la vie quotidienne et l'exploration de thèmes sociétaux.",
      ),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'movement-impressionnisme',
    kind: 'movement',
    domain: 'arts',
    title: 'Impressionnisme',
    subtitle: 'Mouvement pictural',
    period: { label: 'à partir des années 1860', sortYear: 1860 },
    summary:
      'Mouvement pictural apparu en France dans les années 1860, en opposition à l’art académique. Il cherche à représenter le caractère éphémère de la lumière et ses effets sur les couleurs et les formes.',
    links: [],
    sources: [
      wikipedia(
        'Impressionnisme',
        'Impressionnisme',
        "L'impressionnisme est un mouvement pictural apparu en France dans les années 1860 en opposition à l'art académique et visant à représenter le caractère éphémère de la lumière et ses effets sur les couleurs et les formes.",
      ),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'movement-postimpressionnisme',
    kind: 'movement',
    domain: 'arts',
    title: 'Postimpressionnisme',
    subtitle: 'Période de l’histoire de l’art',
    period: { label: 'fin des années 1880 – 1910', sortYear: 1886 },
    summary:
      'Plutôt qu’un courant, une période de l’art moderne, de la fin des années 1880 à 1910 par convention, où l’impressionnisme laisse place à de nombreux nouveaux styles.',
    links: [],
    sources: [
      wikipedia(
        'Postimpressionnisme',
        'Postimpressionnisme',
        "Le postimpressionnisme, ou post-impressionnisme, caractérise une période de l'histoire de l'art moderne et de la peinture en particulier, entre la fin des années 1880 et, par convention, l'année 1910.",
      ),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
];
