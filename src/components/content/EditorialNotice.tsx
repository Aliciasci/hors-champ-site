import { ChevronDown, FlaskConical, ShieldCheck } from '@/components/icons';
import { EDITORIAL_STATUS_LABELS } from '@/constants/labels';
import type { EditorialStatus } from '@/types';
import { formatDate } from '@/utils/text';

import styles from './EditorialNotice.module.css';

export const STATUS_DESCRIPTIONS: Record<EditorialStatus, string> = {
  'dev-example':
    'Situation fictive rédigée pour le développement de l’application. Ce contenu n’a pas été relu par l’équipe éditoriale et ne constitue pas une analyse documentée.',
  draft: 'Contenu en cours de rédaction, susceptible d’évoluer.',
  'in-review': 'Contenu en cours de relecture éditoriale.',
  verified: 'Contenu relu par l’équipe éditoriale, sources vérifiées.',
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
