import type { CollectionConfig } from 'payload';

import { adminField, admins, ROLES } from '../access';

/** Comptes de l'équipe éditoriale. Le site public n'a ni compte ni cookie pour les visiteurs. */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Compte', plural: 'Équipe' },
  auth: true,
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'email', 'role'], group: 'Réglages' },
  access: {
    // Le premier compte se crée depuis l'écran d'accueil de l'admin ; ensuite, les admins seuls.
    create: admins,
    delete: admins,
    read: ({ req }) => (req.user ? true : false),
    update: ({ req, id }) => (req.user?.role === 'admin' ? true : req.user?.id === id),
  },
  fields: [
    { name: 'name', label: 'Nom', type: 'text', required: true },
    {
      name: 'role',
      label: 'Rôle',
      type: 'select',
      options: [...ROLES],
      required: true,
      defaultValue: 'redaction',
      saveToJWT: true,
      access: { update: adminField },
      admin: {
        description:
          'Rédaction : brouillons. Relecture : valide et publie. Administration : tout, y compris les comptes.',
      },
    },
  ],
};
