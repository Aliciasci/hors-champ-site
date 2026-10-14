import Link from 'next/link';

import { absoluteUrl } from '@/lib/site';

import styles from './Breadcrumbs.module.css';
import { JsonLd } from './JsonLd';

export interface Crumb {
  label: string;
  /** Absent pour la page courante (dernier élément). */
  href?: string;
}

/** Fil d'Ariane visible, doublé d'un `BreadcrumbList` en JSON-LD. */
export function Breadcrumbs({ items, currentPath }: { items: Crumb[]; currentPath: string }) {
  return (
    <>
      <nav aria-label="Fil d’Ariane" className={`${styles.nav} no-print`}>
        <ol className={styles.list}>
          {items.map((item, index) => (
            <li key={`${item.label}-${index}`} className={styles.item}>
              {item.href ? (
                <Link href={item.href} className={styles.link}>
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className={styles.current}>
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.label,
            item: absoluteUrl(item.href ?? currentPath),
          })),
        }}
      />
    </>
  );
}
