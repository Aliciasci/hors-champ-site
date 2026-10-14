'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Bookmark, User } from '@/components/icons';
import { HandUnderline } from '@/components/ui/HandDrawn';
import { useAppStore } from '@/store/useAppStore';

import { NAV_ITEMS, normalizePath } from './nav';
import styles from './SiteHeader.module.css';

/** En-tête : logo, rubriques (grand écran), Bibliothèque avec compteur, Profil. */
export function SiteHeader() {
  const path = normalizePath(usePathname());
  const saved = useAppStore((s) => s.savedDiscoveries.length + s.bookmarks.length);
  const libraryActive = path === '/bibliotheque';

  return (
    <header data-site-header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} aria-label="Hors-Champ, accueil">
          <span className={styles.disc} aria-hidden="true" />
          Hors-Champ
        </Link>

        <nav aria-label="Rubriques" className={styles.nav}>
          <ul>
            {NAV_ITEMS.filter((item) => item.href !== '/profil').map((item) => {
              const active = item.match(path);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-label={item.ariaLabel}
                    aria-current={path === item.href ? 'page' : active ? 'true' : undefined}
                    className={`${styles.link} ${active ? styles.active : ''}`}
                  >
                    {item.label}
                    {active ? <HandUnderline /> : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.tools}>
          <Link
            href="/bibliotheque"
            className={`${styles.icon} ${libraryActive ? styles.iconActive : ''}`}
            aria-current={libraryActive ? 'page' : undefined}
            aria-label={
              saved > 0
                ? `Bibliothèque, ${saved} élément${saved > 1 ? 's' : ''} enregistré${saved > 1 ? 's' : ''}`
                : 'Bibliothèque'
            }
            data-testid="header-library"
          >
            <Bookmark size={20} strokeWidth={2} aria-hidden="true" />
            {saved > 0 ? (
              <span className={styles.badge} aria-hidden="true">
                {saved > 99 ? '99+' : saved}
              </span>
            ) : null}
          </Link>
          <Link
            href="/profil"
            className={`${styles.icon} ${styles.desktopOnly} ${path === '/profil' ? styles.iconActive : ''}`}
            aria-current={path === '/profil' ? 'page' : undefined}
            aria-label="Profil"
          >
            <User size={20} strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </header>
  );
}
