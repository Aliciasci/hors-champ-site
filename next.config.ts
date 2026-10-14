import type { NextConfig } from 'next';

import { IMAGE_WIDTHS } from './src/lib/imageWidths.mjs';

const nextConfig: NextConfig = {
  // Site entièrement statique : servi tel quel par n'importe quel hébergeur (dossier `out/`).
  output: 'export',
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    // Pas de serveur d'optimisation : les déclinaisons WebP sont produites par
    // scripts/build-images.mjs et choisies par ce chargeur.
    loader: 'custom',
    loaderFile: './src/lib/imageLoader.ts',
    deviceSizes: IMAGE_WIDTHS.filter((w) => w >= 320),
    imageSizes: IMAGE_WIDTHS.filter((w) => w < 320),
  },
};

export default nextConfig;
