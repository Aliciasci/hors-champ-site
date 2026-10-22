import type { CollectionConfig } from 'payload';

import { loggedIn, publishedOrTeam, publishers } from '../access';

/**
 * Thématiques de l'onglet « Elles ». Une femme n'y figure que si sa fiche le justifie : la raison
 * affichée reprend le contenu sourcé de la fiche.
 */
export const Thematiques: CollectionConfig = {
  slug: 'thematiques',
  labels: { singular: 'Thématique', plural: 'Thématiques' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'order', 'updatedAt'],
    group: 'Contenus',
  },
  versions: { drafts: true, maxPerDoc: 30 },
  defaultSort: 'order',
  access: { read: publishedOrTeam, create: publishers, update: loggedIn, delete: publishers },
  fields: [
    { name: 'id', label: 'Identifiant', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'shortLabel', label: 'Libellé court (filtres)', type: 'text', required: true },
        { name: 'order', label: 'Ordre', type: 'number', required: true, defaultValue: 100 },
      ],
    },
    { name: 'title', label: 'Titre', type: 'text', required: true },
    { name: 'subtitle', label: 'Sous-titre', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea', required: true },
    { name: 'caution', label: 'Précaution éditoriale', type: 'textarea' },
    {
      name: 'members',
      label: 'Femmes',
      type: 'array',
      labels: { singular: 'Femme', plural: 'Femmes' },
      fields: [
        {
          name: 'person',
          label: 'Fiche',
          type: 'relationship',
          relationTo: 'fiches',
          required: true,
          filterOptions: { kind: { equals: 'person' } },
        },
        {
          name: 'reason',
          label: 'Pourquoi elle figure ici',
          type: 'textarea',
          required: true,
          minLength: 16,
        },
      ],
    },
  ],
};
