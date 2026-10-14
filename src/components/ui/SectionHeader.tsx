import Link from 'next/link';

import styles from './SectionHeader.module.css';

/** En-tête de section : surtitre, titre (h2 par défaut), lien d'action facultatif. */
export function SectionHeader({
  title,
  kicker,
  action,
  level = 2,
  id,
}: {
  title: string;
  kicker?: string;
  action?: { label: string; href: string; ariaLabel?: string };
  level?: 2 | 3;
  id?: string;
}) {
  const Heading = level === 2 ? 'h2' : 'h3';
  return (
    <div className={styles.row}>
      <div className={styles.text}>
        {kicker ? <p className="t-overline c-accent">{kicker}</p> : null}
        <Heading id={id} className={level === 2 ? 't-title2' : 't-title3'}>
          {title}
        </Heading>
      </div>
      {action ? (
        <Link href={action.href} className={styles.action} aria-label={action.ariaLabel}>
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
