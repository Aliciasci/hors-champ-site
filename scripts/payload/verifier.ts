/**
 * Vérifie l'import : chaque fiche relue depuis le backoffice redonne exactement la fiche du dépôt.
 *
 *   npm run payload -- run scripts/payload/verifier.ts
 */
import { getPayload } from 'payload';

import config from '@payload-config';
import { getCatalog } from '@/content/catalog';
import { ficheToEntity, type FicheDoc } from '@/payload/ficheMapping';

const payload = await getPayload({ config });
const { culture } = getCatalog();
const { docs } = await payload.find({
  collection: 'fiches',
  limit: 1000,
  depth: 0,
  pagination: false,
});
const byId = new Map(docs.map((d) => [d.id, d]));

const sortKeys = (v: unknown): unknown =>
  Array.isArray(v)
    ? v.map(sortKeys)
    : v && typeof v === 'object'
      ? Object.fromEntries(
          Object.entries(v)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([k, x]) => [k, sortKeys(x)]),
        )
      : v;

let diffs = 0;
for (const entity of culture) {
  const doc = byId.get(entity.id);
  if (!doc) {
    console.log('absente :', entity.id);
    diffs++;
    continue;
  }
  const expected: Partial<typeof entity> = { ...entity };
  delete expected.image;
  const a = JSON.stringify(sortKeys(expected));
  const b = JSON.stringify(sortKeys(ficheToEntity(doc as unknown as FicheDoc)));
  if (a !== b) {
    diffs++;
    if (diffs <= 3)
      console.log(
        'différente :',
        entity.id,
        '\n  dépôt :',
        a.slice(0, 400),
        '\n  base  :',
        b.slice(0, 400),
      );
  }
  if (Boolean(entity.image) !== Boolean(doc.image)) console.log('image :', entity.id);
}
console.log(`${culture.length} fiches, ${docs.length} en base, ${diffs} différence(s)`);
process.exit(diffs ? 1 : 0);
