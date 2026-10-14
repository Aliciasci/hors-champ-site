'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Bookmark, User } from '@/components/icons';
import { HandUnderline } from '@/components/ui/HandDrawn';
import { useAppStore } from '@/store/useAppStore';

import { NAV_ITEMS, normalizePath } from './nav';
import { SchemeToggle } from './SchemeToggle';
import styles from './SiteHeader.module.css';

/** Défilement au-delà duquel l'en-tête peut s'effacer, et seuil de sens du défilement. */
const HIDE_AFTER = 160;
const DELTA = 6;

/**
 * L'en-tête s'efface quand on descend dans la page (place au texte) et revient dès qu'on
 * remonte. Il reste visible tant que le focus clavier est dedans (voir le CSS).
 */
function useHideOnScroll() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        if (y < HIDE_AFTER) setHidden(false);
        else if (y - last > DELTA) setHidden(true);
        else if (last - y > DELTA) setHidden(false);
        if (Math.abs(y - last) > DELTA || y < HIDE_AFTER) last = y;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.cancelAnimationFrame(frame);
    };
  }, []);
  return hidden;
}

/** En-tête : logo, rubriques (grand écran), Bibliothèque avec compteur, Profil. */
export function SiteHeader() {
  const path = normalizePath(usePathname());
  const hidden = useHideOnScroll();
  const saved = useAppStore((s) => s.savedDiscoveries.length + s.bookmarks.length);
  const libraryActive = path === '/bibliotheque';

  return (
    <header data-site-header className={`${styles.header} ${hidden ? styles.hidden : ''}`}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} aria-label="Hors-Champ, accueil">
          <span className={`${styles.disc} not-atlas`} aria-hidden="true" />
          Hors-Champ
          <span className={`${styles.star} only-atlas`} aria-hidden="true">
            *
          </span>
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
                    data-tone={active ? item.tone : undefined}
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
          <SchemeToggle />
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
            <span className={`${styles.libraryLabel} only-atlas`} aria-hidden="true">
              Ma bibliothèque
            </span>
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
