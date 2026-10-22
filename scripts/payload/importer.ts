/**
 * Verse dans le backoffice les contenus du dépôt : images, fiches, thématiques, catégories et
 * journées internationales. Idempotent : un contenu déjà présent est mis à jour, pas dupliqué.
 *
 *   npm run payload -- run scripts/payload/importer.ts
 */
import path from 'node:path';

import { getPayload } from 'payload';

import config from '@payload-config';
import { getCatalog } from '@/content/catalog';
import { WOMEN_COUNTRIES } from '@/content/world/womenCountries';
import { WOMEN_DATES } from '@/content/world/womenDates';
import { categories } from '@/data/categories';
import { portraitThemes } from '@/data/portraitThemes';
import { OBSERVANCES } from '@/features/home/almanac';
import { THEME_SHORT_LABELS } from '@/features/portraits/themeLabels';
import { entityToFiche } from '@/payload/ficheMapping';
import type { Artwork } from '@/types';

const payload = await getPayload({ config });
const { culture } = getCatalog();

/** Une image locale (`/images/people/x.jpg`) correspond au fichier `assets/people/x.jpg`. */
const assetOf = (artwork: Artwork) => {
  const src = typeof artwork.image === 'string' ? artwork.image : artwork.image.src;
  return src.startsWith('/images/') ? path.resolve('assets', src.slice('/images/'.length)) : null;
};

const mediaIds = new Map<string, number | string>();
async function media(artwork: Artwork | null | undefined) {
  if (!artwork) return undefined;
  const file = assetOf(artwork);
  if (!file) return undefined;
  const cached = mediaIds.get(file);
  if (cached) return cached;
  const data = {
    alt: artwork.alt,
    title: artwork.title,
    artist: artwork.artist,
    date: artwork.date,
    holder: artwork.holder ?? null,
    license: artwork.license,
    sourceUrl: artwork.sourceUrl,
    focusTop: artwork.focus?.top ?? null,
    focusLeft: artwork.focus?.left ?? null,
  };
  const existing = await payload.find({
    collection: 'media',
    where: { sourceUrl: { equals: artwork.sourceUrl }, title: { equals: artwork.title } },
    limit: 1,
  });
  const doc = existing.docs[0]
    ? await payload.update({ collection: 'media', id: existing.docs[0].id, data })
    : await payload.create({ collection: 'media', data, filePath: file });
  mediaIds.set(file, doc.id);
  return doc.id;
}

// Les données viennent du modèle du site, déjà validé : les types générés de Payload, plus
// étroits (listes de choix), sont contournés ici.
async function upsert(
  collection: 'fiches' | 'thematiques' | 'categories',
  id: string,
  data: object,
  draft = false,
) {
  const found = await payload.find({
    collection,
    where: { id: { equals: id } },
    limit: 1,
    draft: true,
  });
  return found.docs[0]
    ? payload.update({ collection, id, data: data as never, draft })
    : payload.create({ collection, data: { ...data, id } as never, draft: draft as true });
}

// 1. Fiches, sans leurs liens : une relation exige que la fiche visée existe déjà.
let n = 0;
for (const entity of culture) {
  const countries = WOMEN_COUNTRIES[entity.id];
  const dates = WOMEN_DATES[entity.id];
  const person =
    entity.kind === 'person'
      ? {
          wikidata: countries?.qid,
          countries: countries?.countries,
          historical: countries?.historical,
          born: dates?.born,
          died: dates?.died,
        }
      : undefined;
  const doc = entityToFiche(entity, { image: await media(entity.image), person });
  await upsert(
    'fiches',
    entity.id,
    {
      ...doc,
      links: [],
      right: { ...doc.right, later: doc.right?.later?.map((l) => ({ ...l, involves: [] })) },
      _status: 'draft',
    },
    true,
  );
  n++;
}
console.log(`fiches créées : ${n}`);

// 2. Liens, puis publication : la validation du site s'applique à chaque fiche.
for (const entity of culture) {
  const doc = entityToFiche(entity);
  await payload.update({
    collection: 'fiches',
    id: entity.id,
    data: { links: doc.links, right: doc.right, _status: 'published' } as never,
  });
}
console.log('fiches publiées, liens rétablis');

// 3. Thématiques, dans l'ordre de l'onglet « Elles ».
for (const [index, theme] of portraitThemes.entries()) {
  await upsert('thematiques', theme.id, {
    shortLabel: THEME_SHORT_LABELS[theme.id],
    order: (index + 1) * 10,
    title: theme.title,
    subtitle: theme.subtitle,
    description: theme.description,
    caution: theme.caution ?? null,
    members: theme.members.map((m) => ({ person: m.personId, reason: m.reason })),
    _status: 'published',
  });
}
console.log(`thématiques : ${portraitThemes.length}`);

// 4. Catégories et journées internationales.
for (const category of categories) {
  await upsert('categories', category.id, {
    title: category.title,
    shortTitle: category.shortTitle,
    description: category.description,
    artwork: await media(category.artwork),
    motif: category.motif,
  });
}
const journees = await payload.find({ collection: 'journees', limit: 100 });
if (journees.totalDocs === 0) {
  for (const o of OBSERVANCES) await payload.create({ collection: 'journees', data: o });
}
console.log(
  `catégories : ${categories.length}, journées : ${OBSERVANCES.length}, images : ${mediaIds.size}`,
);
process.exit(0);
