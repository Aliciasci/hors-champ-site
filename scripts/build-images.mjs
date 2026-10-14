/**
 * Prépare les images pour un hébergement statique (next/image sans serveur d'optimisation) :
 * - chaque illustration de `assets/` est déclinée en WebP aux largeurs de `IMAGE_WIDTHS`
 *   dans `public/images/` (jamais agrandie au-delà de l'original) ;
 * - `src/generated/imageManifest.ts` donne la taille d'origine de chaque fichier ;
 * - favicon, apple-touch-icon et image Open Graph sont dérivés de l'icône de la marque.
 * Le chargeur `src/lib/imageLoader.ts` choisit la déclinaison adaptée.
 * Idempotent : un fichier déjà produit et plus récent que sa source n'est pas refait.
 */
import { mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

import { IMAGE_WIDTHS } from '../src/lib/imageWidths.mjs';

const root = path.resolve(import.meta.dirname, '..');
const FOLDERS = ['artworks', 'people', 'inventions', 'rights', 'youth'];

async function fresh(target, source) {
  try {
    return (await stat(target)).mtimeMs >= (await stat(source)).mtimeMs;
  } catch {
    return false;
  }
}

const manifest = {};
for (const folder of FOLDERS) {
  const dir = path.join(root, 'assets', folder);
  for (const file of (await readdir(dir)).filter((f) => /\.(jpe?g|png)$/i.test(f)).sort()) {
    const source = path.join(dir, file);
    const { width, height } = await sharp(source).metadata();
    const key = `${folder}/${file}`;
    manifest[key] = { width, height };
    const base = file.replace(/\.[^.]+$/, '');
    await mkdir(path.join(root, 'public/images', folder), { recursive: true });
    for (const w of IMAGE_WIDTHS) {
      const target = path.join(root, 'public/images', folder, `${base}-${w}.webp`);
      if (await fresh(target, source)) continue;
      await sharp(source)
        .resize({ width: Math.min(w, width), withoutEnlargement: true })
        .webp({ quality: 72 })
        .toFile(target);
    }
  }
}

await mkdir(path.join(root, 'src/generated'), { recursive: true });
await writeFile(
  path.join(root, 'src/generated/imageManifest.ts'),
  `// Fichier généré par scripts/build-images.mjs : ne pas modifier à la main.\n` +
    `export const imageManifest: Record<string, { width: number; height: number }> = ${JSON.stringify(manifest, null, 2)};\n`,
);

// Icônes et image de partage, dérivées du collage de la marque.
const brand = path.join(root, 'assets/brand/icone-source.png');
const app = path.join(root, 'src/app');
const PAPER = '#F3EEE5';
await sharp(brand).resize(32, 32).png().toFile(path.join(app, 'icon.png'));
await sharp(brand)
  .resize(180, 180)
  .flatten({ background: PAPER })
  .png()
  .toFile(path.join(app, 'apple-icon.png'));
const logo = await sharp(brand).resize(470, 470).png().toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: PAPER } })
  .composite([{ input: logo, left: 365, top: 80 }])
  .jpeg({ quality: 82 })
  .toFile(path.join(root, 'public/og-default.jpg'));

console.log(`[images] ${Object.keys(manifest).length} illustrations prêtes`);
