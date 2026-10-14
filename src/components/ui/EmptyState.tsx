import type { ReactNode } from 'react';

import type { LucideIcon } from '@/components/icons';

import styles from './EmptyState.module.css';

/** État vide éditorialisé : un vrai message, pas une simple absence. */
export function EmptyState({
  title,
  description,
  kicker,
  icon: Icon,
  actions,
  testId,
  headingLevel = 2,
}: {
  title: string;
  description?: string;
  kicker?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
  testId?: string;
  headingLevel?: 1 | 2 | 3;
}) {
  const Heading = `h${headingLevel}` as 'h1' | 'h2' | 'h3';
  return (
    <div className={styles.empty} data-testid={testId}>
      {Icon ? (
        <span className={styles.badge} aria-hidden="true">
          <Icon size={28} strokeWidth={2} />
        </span>
      ) : null}
      {kicker ? <p className="t-overline c-accent">{kicker}</p> : null}
      <Heading className="t-title2">{title}</Heading>
      {description ? <p className="t-body c-2 measure">{description}</p> : null}
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </div>
  );
}
