import {
  CircleAlert,
  CircleCheck,
  CircleDashed,
  CircleQuestionMark,
  type LucideIcon,
} from '@/components/icons';
import { ASSESSMENT_LABELS } from '@/constants/labels';
import type { OptionAssessment } from '@/types';

import styles from './AssessmentBadge.module.css';

const ICONS: Record<OptionAssessment, LucideIcon> = {
  solid: CircleCheck,
  partial: CircleDashed,
  open: CircleQuestionMark,
  weak: CircleAlert,
};

/** Qualification d'un raisonnement : icône + libellé, la couleur n'est qu'un renfort. */
export function AssessmentBadge({ assessment }: { assessment: OptionAssessment }) {
  const Icon = ICONS[assessment];
  return (
    <span className={`${styles.badge} ${styles[assessment]}`}>
      <Icon size={16} strokeWidth={2.5} aria-hidden="true" />
      <span className="t-caption">{ASSESSMENT_LABELS[assessment]}</span>
    </span>
  );
}

/** Classe de fond doux associée à une qualification. */
export const assessmentSoft = (assessment: OptionAssessment) => styles[`${assessment}Soft`] ?? '';
