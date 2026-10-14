import Link from 'next/link';
import type { ReactNode } from 'react';

import styles from './Tag.module.css';

export type TagTone = 'default' | 'primary' | 'accent' | 'solid';

/** Étiquette. Avec `href`, c'est un lien (étiquette cliquable). */
export function Tag({
  children,
  tone = 'default',
  href,
  icon,
  className,
  testId,
}: {
  children: ReactNode;
  tone?: TagTone;
  href?: string;
  icon?: ReactNode;
  className?: string;
  testId?: string;
}) {
  const cls = `${styles.tag} ${styles[tone]} ${href ? styles.link : ''} ${className ?? ''}`;
  if (href) {
    return (
      <Link href={href} className={cls} data-testid={testId}>
        {icon}
        {children}
      </Link>
    );
  }
  return (
    <span className={cls} data-testid={testId}>
      {icon}
      {children}
    </span>
  );
}
