import type { CollectionConfig } from 'payload';

import { publishers } from '../access';
import { MOTIF_OPTIONS } from '../options';

/** Les six thèmes des contrechamps et des idées. */
export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Catégorie', plural: 'Catégories' },
  admin: { useAsTitle: 'title', group: 'Réglages' },
  access: { read: () => true, create: publishers, update: publishers, delete: publishers },
  fields: [
    { name: 'id', label: 'Identifiant', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'title', label: 'Titre', type: 'text', required: true },
        { name: 'shortTitle', label: 'Titre court', type: 'text', required: true },
      ],
    },
    { name: 'description', label: 'Description', type: 'textarea', required: true },
    { name: 'artwork', label: 'Œuvre', type: 'upload', relationTo: 'media' },
    {
      name: 'motif',
      label: 'Motif de repli',
      type: 'select',
      required: true,
      options: MOTIF_OPTIONS,
    },
  ],
};
