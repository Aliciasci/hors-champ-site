import type { CultureEntity } from '@/types';

import { wikipedia } from './sources';

/**
 * Événements. Chacun est appuyé par une phrase citée mot pour mot (Wikipédia, consulté le
 * 2026-10-12). Statut `draft` : non relu par l'équipe éditoriale.
 */
export const events: CultureEntity[] = [
  {
    id: 'event-1559-cour-espagne',
    kind: 'event',
    domain: 'arts',
    title: 'Sofonisba Anguissola à la cour d’Espagne',
    subtitle: 'Cour de Philippe II',
    period: { label: '1559 – 1573', sortYear: 1559 },
    summary:
      'Spécialisée dans le portrait, Sofonisba Anguissola arrive en 1559 à la cour d’Espagne de Philippe II et devient dame d’honneur de la reine Élisabeth de France.',
    links: [{ targetId: 'movement-manierisme', relation: 'context' }],
    sources: [
      wikipedia(
        'Sofonisba Anguissola',
        'Sofonisba_Anguissola',
        "Spécialisée dans les portraits, elle arrive en 1559 à la cour d'Espagne de Philippe II et devient dame d'honneur de la reine née Élisabeth de France (1545-1568).",
        'cour',
      ),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'event-1616-academie-du-dessin',
    kind: 'event',
    domain: 'arts',
    title: 'Artemisia Gentileschi entre à l’Académie du dessin',
    subtitle: 'Florence',
    period: { label: '1616', sortYear: 1616 },
    summary:
      'En 1616, Artemisia Gentileschi est acceptée à l’Académie du dessin, membre de la guilde des peintres : elle est la première femme à obtenir ce privilège.',
    links: [{ targetId: 'movement-caravagisme', relation: 'context' }],
    sources: [
      wikipedia(
        'Artemisia Gentileschi',
        'Artemisia_Gentileschi',
        "Première femme à jouir d'un tel privilège, elle est acceptée à l'Académie du dessin en 1616 en tant que membre de la guilde des peintres.",
        'academie',
      ),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'event-1800-permission-travestissement',
    kind: 'event',
    domain: 'arts',
    title: 'La « permission de travestissement »',
    subtitle: 'Ordonnance de novembre 1800',
    period: { label: '1800', sortYear: 1800 },
    summary:
      'Depuis une ordonnance de novembre 1800, une femme doit demander une « permission de travestissement », renouvelable tous les six mois auprès de la préfecture de Paris, pour porter des pantalons. Rosa Bonheur y est soumise pour fréquenter les foires aux bestiaux, voyager ou monter à cheval.',
    links: [{ targetId: 'idea-doubles-standards', relation: 'context' }],
    sources: [
      wikipedia(
        'Rosa Bonheur',
        'Rosa_Bonheur',
        'Comme toutes les femmes de son temps depuis une ordonnance datant de novembre 1800, Rosa Bonheur devait demander une permission de travestissement, renouvelable tous les six mois auprès de la préfecture de Paris, pour pouvoir porter des pantalons, notamment dans le but de fréquenter les foires aux bestiaux, de voyager ou de monter à cheval.',
        'travestissement',
      ),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'event-1853-salon-marche-aux-chevaux',
    kind: 'event',
    domain: 'arts',
    title: 'Le Marché aux chevaux au Salon',
    subtitle: 'Salon de 1853',
    period: { label: '1853', sortYear: 1853 },
    summary:
      'Rosa Bonheur présente au Salon de 1853 Le Marché aux chevaux, un tableau de 2,44 × 5 mètres, qui lui apporte une grande notoriété.',
    links: [{ targetId: 'work-le-marche-aux-chevaux', relation: 'context' }],
    sources: [
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
    id: 'event-1865-legion-honneur',
    kind: 'event',
    domain: 'arts',
    title: 'Rosa Bonheur reçoit la Légion d’honneur',
    subtitle: 'Chevalier, puis officier en 1894',
    period: { label: '1865', sortYear: 1865 },
    summary:
      'En 1865, l’impératrice remet à Rosa Bonheur les insignes de chevalier de la Légion d’honneur. En 1894, elle devient la première femme promue officier dans cet ordre.',
    links: [],
    sources: [
      wikipedia(
        'Rosa Bonheur',
        'Rosa_Bonheur',
        "L'impératrice revient à By l'année suivante, le 10 juin 1865, pour lui remettre, elle-même, les insignes de chevalier dans l'ordre de la Légion d'honneur — faisant ainsi de Rosa Bonheur la première artiste et la neuvième femme à recevoir cette distinction",
        'legion-honneur',
      ),
      wikipedia(
        'Rosa Bonheur',
        'Rosa_Bonheur',
        "Elle est aussi la première femme promue officier dans cet ordre, en avril 1894 — soit, selon les termes également en usage dans la presse de l'époque, la première officière de la Légion d'honneur.",
        'officiere',
      ),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'event-1879-exposition-impressionnistes',
    kind: 'event',
    domain: 'arts',
    title: 'Quatrième exposition des impressionnistes',
    subtitle: 'Paris',
    period: { label: '1879', sortYear: 1879 },
    summary:
      'Après le refus de son tableau par le Salon en 1877, Mary Cassatt est encouragée par Degas à exposer à la quatrième exposition des peintres impressionnistes, en 1879.',
    links: [{ targetId: 'movement-impressionnisme', relation: 'context' }],
    sources: [
      wikipedia(
        'Mary Cassatt',
        'Mary_Cassatt',
        "Lorsqu'en 1877, son dernier tableau est refusé par le Salon, Degas l'encourage à exposer à la quatrième exposition des peintres impressionnistes en 1879.",
        'exposition-1879',
      ),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'event-1894-salon-societe-nationale',
    kind: 'event',
    domain: 'arts',
    title: 'Suzanne Valadon expose au Salon',
    subtitle: 'Société nationale des beaux-arts',
    period: { label: '1894', sortYear: 1894 },
    summary:
      'En 1894, Suzanne Valadon présente cinq dessins au Salon de la Société nationale des beaux-arts, l’un des rares Salons parisiens ouverts aux artistes femmes.',
    links: [],
    sources: [
      wikipedia(
        'Suzanne Valadon',
        'Suzanne_Valadon',
        "Puis toujours en 1894 au Salon de la Société nationale des beaux-arts, l'un des rares Salons parisiens ouvert aux artistes femmes (avec cinq dessins).",
        'salon-1894',
      ),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
  {
    id: 'event-1915-soutien-suffragettes',
    kind: 'event',
    domain: 'arts',
    title: 'Mary Cassatt soutient les suffragettes',
    subtitle: 'Ventes de tableaux',
    period: { label: '1915', sortYear: 1915 },
    summary:
      'En 1915, Mary Cassatt soutient par des ventes de tableaux le mouvement des suffragettes de son amie Louisine Havemeyer.',
    links: [],
    sources: [
      wikipedia(
        'Mary Cassatt',
        'Mary_Cassatt',
        'Elle a également soutenu le mouvement des suffragettes de son amie Louisine Havemeyer par des ventes de tableaux en 1915.',
        'suffragettes',
      ),
    ],
    editorialStatus: 'draft',
    reviewedAt: null,
  },
];
