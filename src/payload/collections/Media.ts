import type { CollectionConfig } from 'payload';

import { loggedIn, publishers } from '../access';

/**
 * Images (œuvres, photographies, documents). Uniquement du domaine public ou sous licence libre,
 * avec la page qui atteste la licence : les mêmes règles que les illustrations du dépôt.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Image', plural: 'Images' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['filename', 'title', 'license'],
    group: 'Contenus',
  },
  access: {
    read: () => true,
    create: loggedIn,
    update: loggedIn,
    delete: publishers,
  },
  upload: {
    staticDir: process.env.MEDIA_DIR || 'media',
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'vignette', width: 320 },
      { name: 'moyenne', width: 900 },
      { name: 'grande', width: 1600 },
    ],
    adminThumbnail: 'vignette',
    formatOptions: { format: 'webp', options: { quality: 82 } },
  },
  fields: [
    {
      name: 'alt',
      label: 'Description (lecteurs d’écran)',
      type: 'textarea',
      required: true,
      admin: { description: 'Ce que montre l’image, de façon factuelle.' },
    },
    { name: 'title', label: 'Titre de l’œuvre ou de la photo', type: 'text', required: true },
    { name: 'artist', label: 'Autrice, auteur ou détenteur', type: 'text', required: true },
    { name: 'date', label: 'Date', type: 'text', required: true },
    { name: 'holder', label: 'Musée ou collection', type: 'text' },
    {
      name: 'license',
      label: 'Licence',
      type: 'select',
      required: true,
      options: ['Domaine public', 'CC0', 'CC BY 2.0', 'CC BY 3.0'],
      admin: {
        description: 'Les licences CC BY-SA sont exclues, comme sur le reste du site.',
      },
    },
    {
      name: 'sourceUrl',
      label: 'Page qui atteste la licence',
      type: 'text',
      required: true,
      admin: { description: 'Wikimedia Commons, site du musée…' },
    },
    {
      type: 'row',
      fields: [
        { name: 'focusTop', label: 'Cadrage vertical (ex. 20%)', type: 'text' },
        { name: 'focusLeft', label: 'Cadrage horizontal (ex. 50%)', type: 'text' },
      ],
    },
  ],
};
