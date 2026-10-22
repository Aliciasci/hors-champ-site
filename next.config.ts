import { withPayload } from '@payloadcms/next/withPayload';
import type { NextConfig } from 'next';

import { IMAGE_WIDTHS } from './src/lib/imageWidths.mjs';

const nextConfig: NextConfig = {
  // Le site est servi par Next.js (et non plus exporté en statique) : le contenu vient du
  // backoffice (Payload, sur /admin), et une publication se voit tout de suite.
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

export default withPayload(nextConfig);
