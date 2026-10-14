import type { ReactNode } from 'react';

import { Breadcrumbs, type Crumb } from '@/components/ui/Breadcrumbs';

import { BackLink } from './BackLink';
import styles from './PageTop.module.css';

/** Haut des pages de détail : retour sûr, fil d'Ariane, actions éventuelles à droite. */
export function PageTop({
  crumbs,
  path,
  fallback,
  actions,
}: {
  crumbs: Crumb[];
  path: string;
  fallback: string;
  actions?: ReactNode;
}) {
  return (
    <div className={styles.top}>
      <BackLink fallback={fallback} />
      <Breadcrumbs items={crumbs} currentPath={path} />
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </div>
  );
}
