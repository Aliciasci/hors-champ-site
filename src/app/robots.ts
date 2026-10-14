import type { MetadataRoute } from 'next';

import { absoluteUrl } from '@/lib/site';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    // Pas de « disallow » : les pages personnelles portent un noindex, que les robots doivent lire.
    rules: { userAgent: '*', allow: '/' },
    sitemap: absoluteUrl('/sitemap.xml').replace(/\/$/, ''),
  };
}
