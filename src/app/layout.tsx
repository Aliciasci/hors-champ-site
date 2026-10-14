import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import { NavigationTracker } from '@/components/layout/NavigationTracker';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { TabBar } from '@/components/layout/TabBar';
import { THEME_INIT_SCRIPT, ThemeSync } from '@/components/layout/ThemeSync';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';

import '@/styles/globals.css';
import styles from './layout.module.css';
import { fontVariables } from './fonts';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Celles que l’histoire a laissées hors champ`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: SITE_NAME,
    images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Hors-Champ' }],
  },
  twitter: { card: 'summary_large_image' },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: '#F3EEE5',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" data-theme="cartel" className={fontVariables} suppressHydrationWarning>
      <head>
        {/* Thème enregistré posé avant le premier rendu : pas de flash du mauvais thème. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <a href="#contenu" className={styles.skip} data-skip-link>
          Aller au contenu
        </a>
        <ThemeSync />
        <NavigationTracker />
        <SiteHeader />
        <main id="contenu" tabIndex={-1} className={styles.main}>
          {children}
        </main>
        <SiteFooter />
        <TabBar />
      </body>
    </html>
  );
}
