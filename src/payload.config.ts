import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { buildConfig } from 'payload';
import { fr } from '@payloadcms/translations/languages/fr';
import sharp from 'sharp';

import { Categories } from './payload/collections/Categories';
import { Fiches } from './payload/collections/Fiches';
import { Journees } from './payload/collections/Journees';
import { Media } from './payload/collections/Media';
import { Thematiques } from './payload/collections/Thematiques';
import { Users } from './payload/collections/Users';

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Backoffice de Hors-Champ : admin sur /admin, API sur /api (REST et GraphQL).
 * Le contenu publié y est lisible par tous (site, app mobile) ; les brouillons, par l'équipe seule.
 */
export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' — Hors-Champ' },
  },
  i18n: { supportedLanguages: { fr }, fallbackLanguage: 'fr' },
  collections: [Fiches, Thematiques, Media, Journees, Categories, Users],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URI || '' } }),
  sharp,
});
