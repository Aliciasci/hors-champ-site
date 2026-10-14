import Link from 'next/link';

import { ChevronDown, FlaskConical, ShieldCheck } from '@/components/icons';
import { EDITORIAL_STATUS_LABELS } from '@/constants/labels';
import type { EditorialStatus } from '@/types';
import { formatDate } from '@/utils/text';

import styles from './EditorialNotice.module.css';

export const STATUS_DESCRIPTIONS: Record<EditorialStatus, string> = {
  'dev-example':
    'Situation inventée pour tester le site. La rédaction ne l’a pas relue, ce n’est pas une analyse documentée.',
  draft: 'En cours d’écriture. Ce texte peut encore changer.',
  'in-review': 'En relecture à la rédaction.',
  verified: 'Relu par la rédaction, sources vérifiées.',
};

export function statusTitle(status: EditorialStatus, reviewedAt: string | null) {
  return status === 'verified' && reviewedAt
    ? `${EDITORIAL_STATUS_LABELS[status]} le ${formatDate(reviewedAt)}`
    : EDITORIAL_STATUS_LABELS[status];
}

/**
 * Statut éditorial affiché en clair : on sait toujours ce qu'on lit. L'explication est repliée
 * (`<details>`), le statut lui-même reste visible.
 */
export function EditorialNotice({
  status,
  reviewedAt,
  open = false,
}: {
  status: EditorialStatus;
  reviewedAt: string | null;
  open?: boolean;
}) {
  const verified = status === 'verified';
  const Icon = verified ? ShieldCheck : FlaskConical;
  return (
    <details
      className={`${styles.box} ${verified ? styles.verified : styles.unverified}`}
      open={open || undefined}
      data-testid="editorial-notice"
    >
      <summary className={styles.summary}>
        <Icon size={18} strokeWidth={2.25} aria-hidden="true" className={styles.icon} />
        <span className="t-label">
          <span className="sr-only">Statut éditorial : </span>
          {statusTitle(status, reviewedAt)}
        </span>
        <ChevronDown size={18} strokeWidth={2.25} aria-hidden="true" className={styles.chevron} />
      </summary>
      <p className="t-body-sm c-2">{STATUS_DESCRIPTIONS[status]}</p>
    </details>
  );
}

/**
 * Statut en une pastille, dans la ligne de signature d'un article. Le détail des statuts est
 * expliqué sur la page « Qui sommes-nous », vers laquelle elle renvoie.
 */
export function StatusBadge({
  status,
  reviewedAt,
}: {
  status: EditorialStatus;
  reviewedAt: string | null;
}) {
  const verified = status === 'verified';
  const Icon = verified ? ShieldCheck : FlaskConical;
  return (
    <Link
      href="/a-propos#statuts"
      className={`${styles.badge} ${verified ? styles.badgeVerified : ''}`}
      title={STATUS_DESCRIPTIONS[status]}
      data-testid="status-badge"
    >
      <Icon size={14} strokeWidth={2.25} aria-hidden="true" />
      <span className="sr-only">Statut éditorial : </span>
      {statusTitle(status, reviewedAt)}
    </Link>
  );
}
