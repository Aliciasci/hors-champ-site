import type { CollectionConfig } from 'payload';

import { publishers } from '../access';

/** Journées internationales, à date fixe : l'accueil les annonce quelques jours avant. */
export const Journees: CollectionConfig = {
  slug: 'journees',
  labels: { singular: 'Journée internationale', plural: 'Journées internationales' },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'month', 'day', 'lead'], group: 'Accueil' },
  access: { read: () => true, create: publishers, update: publishers, delete: publishers },
  fields: [
    { name: 'name', label: 'Nom', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'day', label: 'Jour', type: 'number', required: true, min: 1, max: 31 },
        { name: 'month', label: 'Mois', type: 'number', required: true, min: 1, max: 12 },
        {
          name: 'lead',
          label: 'Annoncée combien de jours avant',
          type: 'number',
          required: true,
          defaultValue: 14,
          min: 0,
          max: 60,
        },
      ],
    },
    { name: 'pitch', label: 'Ce que la page propose', type: 'text', required: true },
    {
      name: 'href',
      label: 'Lien (page du site)',
      type: 'text',
      required: true,
      admin: { description: 'ex. /feminicides' },
    },
  ],
};
