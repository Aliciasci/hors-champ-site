'use client';

import { useSyncExternalStore } from 'react';

import { Moon, Sun } from '@/components/icons';

import styles from './SiteHeader.module.css';
import { SCHEME_KEY } from './ThemeSync';

/** Le mode jour / nuit vit sur <html data-scheme> : on le lit et on suit ses changements. */
const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-scheme'],
  });
  return () => observer.disconnect();
};
const isDark = () => document.documentElement.dataset.scheme === 'dark';

/** Bascule jour / nuit. Le choix reste dans ce navigateur ; sans choix, on suit l'appareil. */
export function SchemeToggle() {
  const dark = useSyncExternalStore(subscribe, isDark, () => false);

  const toggle = () => {
    const next = dark ? 'light' : 'dark';
    document.documentElement.dataset.scheme = next;
    try {
      localStorage.setItem(SCHEME_KEY, next);
    } catch {
      // Stockage indisponible (navigation privée) : le choix vaut pour cette page.
    }
  };

  return (
    <button
      type="button"
      className={styles.icon}
      onClick={toggle}
      aria-pressed={dark}
      aria-label="Mode nuit"
      data-testid="scheme-toggle"
    >
      {dark ? (
        <Sun size={20} strokeWidth={2} aria-hidden="true" />
      ) : (
        <Moon size={20} strokeWidth={2} aria-hidden="true" />
      )}
    </button>
  );
}
