import { APIError, type CollectionConfig, type Field } from 'payload';

import { validateCultureEntity } from '@/features/culture/validateCulture';

import { canPublish, loggedIn, publishedOrTeam, publishers } from '../access';
import { ficheToEntity, type FicheDoc } from '../ficheMapping';
import {
  CATEGORY_OPTIONS,
  CONTRIBUTION_OPTIONS,
  DOMAIN_OPTIONS,
  EDITORIAL_STATUS_OPTIONS,
  KIND_OPTIONS,
  RELATION_OPTIONS,
  RIGHT_CATEGORY_OPTIONS,
  SOURCE_TYPE_OPTIONS,
} from '../options';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const isoDate = (value: unknown) =>
  value === null || value === undefined || value === '' || ISO_DATE.test(String(value))
    ? true
    : 'Date au format AAAA-MM-JJ.';

type Kind = FicheDoc['kind'];
const when =
  (...kinds: Kind[]) =>
  (data: Partial<FicheDoc>) =>
    kinds.includes(data?.kind as Kind);

/** Sources : chaque fait d'une fiche s'appuie sur l'une d'elles (extrait exact, ou note). */
const sources: Field = {
  name: 'sources',
  label: 'Sources',
  type: 'array',
  labels: { singular: 'Source', plural: 'Sources' },
  admin: {
    initCollapsed: true,
    description:
      'Chaque fait du résumé doit venir d’une source : un extrait exact, ou une note qui explique ce qu’elle établit.',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'sourceId',
          label: 'Identifiant',
          type: 'text',
          required: true,
          admin: {
            width: '40%',
            description: 'Unique dans la fiche, ex. wikipedia-marie_curie-intro',
          },
        },
        {
          name: 'sourceType',
          label: 'Type',
          type: 'select',
          required: true,
          options: SOURCE_TYPE_OPTIONS,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'title', label: 'Titre', type: 'text', required: true },
        { name: 'publisher', label: 'Éditeur', type: 'text', required: true },
      ],
    },
    { name: 'url', label: 'Adresse', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        {
          name: 'accessedAt',
          label: 'Consultée le',
          type: 'text',
          required: true,
          validate: isoDate,
        },
        { name: 'publishedAt', label: 'Publiée le', type: 'text', validate: isoDate },
      ],
    },
    { name: 'relevantExcerpt', label: 'Extrait exact', type: 'textarea' },
    { name: 'note', label: 'Note', type: 'textarea' },
  ],
};

/**
 * Fiches du catalogue : femmes, œuvres, inventions, conquêtes, lois, événements, idées…
 * L'identifiant (« person-marie-curie ») est celui des adresses du site et de l'app mobile.
 */
export const Fiches: CollectionConfig = {
  slug: 'fiches',
  labels: { singular: 'Fiche', plural: 'Fiches' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'kind', 'domain', 'editorialStatus', 'updatedAt'],
    listSearchableFields: ['title', 'id', 'hook'],
    group: 'Contenus',
    description:
      'Une fiche invalide (source manquante, accroche vide…) ne peut pas être enregistrée : le message dit ce qui manque.',
  },
  versions: { drafts: true, maxPerDoc: 50 },
  access: {
    read: publishedOrTeam,
    create: loggedIn,
    update: loggedIn,
    delete: publishers,
  },
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        // La rédaction prépare des brouillons ; publier revient à la relecture. (Sans compte : un
        // script du serveur, comme l'import, qui passe par l'API locale.)
        if (data._status === 'published' && req.user && !canPublish(req)) {
          throw new APIError(
            'Seule la relecture peut publier. Enregistrez un brouillon et passez la fiche « En relecture ».',
            403,
          );
        }
        // Un brouillon peut être incomplet ; une fiche publiée suit les règles du site.
        if (data._status !== 'published') return data;
        const result = validateCultureEntity(ficheToEntity(data as FicheDoc));
        if (!result.ok) {
          throw new APIError(`Fiche incomplète : ${result.issue.errors.join(' ; ')}.`, 400);
        }
        return data;
      },
    ],
  },
  fields: [
    {
      name: 'id',
      label: 'Identifiant',
      type: 'text',
      required: true,
      admin: {
        description:
          'Commence par le type : person-…, work-…, right-… Il sert d’adresse (/culture/…) : ne le changez plus une fois publié.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Fiche',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'kind',
                  label: 'Type',
                  type: 'select',
                  required: true,
                  options: KIND_OPTIONS,
                },
                {
                  name: 'domain',
                  label: 'Domaine',
                  type: 'select',
                  options: DOMAIN_OPTIONS,
                  admin: { condition: (data) => data?.kind !== 'idea' },
                },
                {
                  name: 'categoryId',
                  label: 'Catégorie',
                  type: 'select',
                  options: CATEGORY_OPTIONS,
                  admin: { condition: when('idea') },
                },
              ],
            },
            { name: 'title', label: 'Titre', type: 'text', required: true },
            {
              name: 'hook',
              label: 'Accroche',
              type: 'text',
              maxLength: 75,
              admin: {
                description:
                  'Ce qu’elle a fait, en une phrase courte (75 caractères au plus), tirée du résumé sourcé.',
              },
            },
            { name: 'subtitle', label: 'Sous-titre', type: 'text' },
            {
              name: 'period',
              label: 'Période',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'label',
                      label: 'Affichée',
                      type: 'text',
                      admin: { description: 'ex. « 1867 – 1934 »' },
                    },
                    { name: 'sortYear', label: 'Année de classement', type: 'number' },
                    { name: 'endYear', label: 'Année de fin (décès)', type: 'number' },
                  ],
                },
              ],
            },
            { name: 'summary', label: 'Résumé', type: 'textarea', required: true },
            { name: 'image', label: 'Image', type: 'upload', relationTo: 'media' },
            {
              name: 'gallery',
              label: 'Galerie (œuvres d’une artiste)',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              admin: {
                condition: when('person'),
                description:
                  'Seulement des œuvres du domaine public (artiste morte depuis plus de 70 ans), reproduction en domaine public ou CC0.',
              },
            },
          ],
        },
        {
          label: 'Sources',
          fields: [sources],
        },
        {
          label: 'Liens',
          fields: [
            {
              name: 'links',
              label: 'Liens vers d’autres fiches',
              type: 'array',
              labels: { singular: 'Lien', plural: 'Liens' },
              admin: { initCollapsed: true },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'target',
                      label: 'Fiche liée',
                      type: 'relationship',
                      relationTo: 'fiches',
                      required: true,
                    },
                    {
                      name: 'relation',
                      label: 'Nature',
                      type: 'select',
                      required: true,
                      options: RELATION_OPTIONS,
                    },
                  ],
                },
                {
                  type: 'row',
                  admin: { condition: (_, sibling) => sibling?.relation === 'contributed' },
                  fields: [
                    {
                      name: 'contribution',
                      label: 'Contribution',
                      type: 'select',
                      options: CONTRIBUTION_OPTIONS,
                    },
                    { name: 'sourceId', label: 'Source (identifiant)', type: 'text' },
                    { name: 'year', label: 'Année', type: 'number' },
                  ],
                },
                {
                  name: 'detail',
                  label: 'Contribution précise',
                  type: 'textarea',
                  admin: { condition: (_, sibling) => sibling?.relation === 'contributed' },
                },
              ],
            },
          ],
        },
        {
          label: 'Conquête',
          admin: { condition: when('right') },
          fields: [
            {
              name: 'right',
              type: 'group',
              label: false,
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'category',
                      label: 'Famille',
                      type: 'select',
                      options: RIGHT_CATEGORY_OPTIONS,
                    },
                    { name: 'country', label: 'Pays', type: 'text' },
                  ],
                },
                { name: 'before', label: 'La situation avant', type: 'textarea' },
                {
                  name: 'steps',
                  label: 'Étapes du combat',
                  type: 'array',
                  labels: { singular: 'Étape', plural: 'Étapes' },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'date',
                          label: 'Date affichée',
                          type: 'text',
                          required: true,
                          admin: { width: '30%' },
                        },
                        { name: 'text', label: 'Texte', type: 'textarea', required: true },
                      ],
                    },
                  ],
                },
                { name: 'outcome', label: 'Ce qui a été obtenu', type: 'textarea' },
                {
                  name: 'limits',
                  label: 'Résistances et limites',
                  type: 'array',
                  fields: [{ name: 'text', label: 'Texte', type: 'textarea', required: true }],
                },
                {
                  name: 'later',
                  label: 'Évolutions ultérieures',
                  type: 'array',
                  fields: [
                    { name: 'text', label: 'Texte', type: 'textarea', required: true },
                    {
                      name: 'involves',
                      label: 'Fiches impliquées',
                      type: 'relationship',
                      relationTo: 'fiches',
                      hasMany: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Loi',
          admin: { condition: when('law') },
          fields: [
            {
              name: 'law',
              type: 'group',
              label: false,
              fields: [
                { name: 'institution', label: 'Institution qui l’a adoptée', type: 'text' },
                { name: 'reference', label: 'Référence officielle', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'Portrait',
          admin: { condition: when('person') },
          fields: [
            {
              name: 'person',
              type: 'group',
              label: false,
              admin: {
                description:
                  'Pour la carte « Elles » et « Ce jour-là ». Dates précises au jour seulement, recoupées avec la notice Wikidata.',
              },
              fields: [
                { name: 'wikidata', label: 'Notice Wikidata (Q…)', type: 'text' },
                {
                  name: 'countries',
                  label: 'Pays (codes ISO à trois lettres)',
                  type: 'text',
                  hasMany: true,
                  admin: { description: 'Dans l’ordre de la notice, ex. POL puis FRA.' },
                },
                { name: 'historical', label: 'État historique de la notice', type: 'text' },
                {
                  type: 'row',
                  fields: [
                    { name: 'born', label: 'Née le', type: 'text', validate: isoDate },
                    { name: 'died', label: 'Morte le', type: 'text', validate: isoDate },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Article long',
          fields: [
            {
              name: 'article',
              type: 'group',
              label: false,
              fields: [
                {
                  name: 'paragraphs',
                  label: 'Paragraphes',
                  type: 'array',
                  fields: [
                    { name: 'heading', label: 'Intertitre', type: 'text' },
                    { name: 'text', label: 'Texte', type: 'textarea', required: true },
                    {
                      name: 'sourceIds',
                      label: 'Sources (identifiants)',
                      type: 'text',
                      hasMany: true,
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'preparedWith', label: 'Préparé avec', type: 'text' },
                    { name: 'acceptedAt', label: 'Validé le', type: 'text', validate: isoDate },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'editorialStatus',
      label: 'Statut éditorial',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: EDITORIAL_STATUS_OPTIONS,
      admin: { position: 'sidebar' },
    },
    {
      name: 'reviewedAt',
      label: 'Relue le',
      type: 'text',
      validate: isoDate,
      admin: { position: 'sidebar', description: 'Obligatoire pour une fiche « Vérifiée ».' },
    },
  ],
};
