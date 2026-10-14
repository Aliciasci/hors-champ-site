'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { NAV_ITEMS, normalizePath } from './nav';
import styles from './TabBar.module.css';

/** Barre d'onglets inférieure, sur petit écran uniquement. */
export function TabBar() {
  const path = normalizePath(usePathname());
  return (
    <nav data-tabbar aria-label="Rubriques" className={styles.bar}>
      <ul className={styles.list}>
        {NAV_ITEMS.map((item) => {
          const active = item.match(path);
          const Icon = item.icon;
          return (
            <li key={item.href} className={styles.item} data-tab={item.href}>
              <Link
                href={item.href}
                aria-label={item.ariaLabel}
                aria-current={path === item.href ? 'page' : active ? 'true' : undefined}
                className={`${styles.link} ${active ? styles.active : ''}`}
              >
                <Icon size={22} strokeWidth={active ? 2.5 : 2} aria-hidden="true" />
                <span className={styles.label}>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
