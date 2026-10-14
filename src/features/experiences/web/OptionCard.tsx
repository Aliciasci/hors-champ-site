'use client';

import { Check } from '@/components/icons';
import { HandCircle } from '@/components/ui/HandDrawn';
import type { AnswerOption, QuestionMode } from '@/types';

import { AssessmentBadge, assessmentSoft } from './AssessmentBadge';
import styles from './OptionCard.module.css';

/**
 * Option de réponse : une carte entière cliquable autour d'un contrôle natif (bouton radio en
 * mode `single`, case à cocher en mode `multiple`). La sélection est signalée par une coche,
 * un contour épais et l'état du contrôle — jamais par la seule couleur. Cartel : aplat cobalt ;
 * Revue : cercle tracé au feutre.
 */
export function OptionCard({
  option,
  mode,
  name,
  marker,
  number,
  selected,
  revealed,
  onToggle,
}: {
  option: AnswerOption;
  mode: QuestionMode;
  /** Nom du groupe de contrôles. */
  name: string;
  /** Lettre affichée (A, B, C…). */
  marker: string;
  /** Raccourci clavier (1, 2, 3…). */
  number?: number;
  selected: boolean;
  /** Après validation : qualification et explication de l'option, contrôles figés. */
  revealed: boolean;
  onToggle?: () => void;
}) {
  const interactive = !revealed && onToggle !== undefined;
  return (
    <label
      className={[
        styles.card,
        selected ? styles.selected : '',
        selected && !revealed ? styles.active : '',
        revealed && selected ? assessmentSoft(option.assessment) : '',
        revealed && !selected ? styles.dimmed : '',
        interactive ? styles.interactive : '',
      ].join(' ')}
      data-testid={`option-${option.id}`}
    >
      {selected && !revealed ? <HandCircle /> : null}
      <input
        type={mode === 'single' ? 'radio' : 'checkbox'}
        name={name}
        value={option.id}
        checked={selected}
        disabled={!interactive}
        onChange={() => onToggle?.()}
        className={styles.input}
        aria-describedby={revealed && selected ? `${name}-${option.id}-feedback` : undefined}
      />
      <span className={styles.row}>
        <span
          className={`${styles.marker} ${mode === 'multiple' ? styles.square : ''}`}
          aria-hidden="true"
        >
          {selected ? <Check size={18} strokeWidth={3} /> : marker}
        </span>
        <span className={`t-body ${styles.label}`}>
          <span className="sr-only">{marker}. </span>
          {option.label}
        </span>
        {number !== undefined && interactive ? (
          <kbd className={styles.kbd} aria-hidden="true">
            {number}
          </kbd>
        ) : null}
      </span>
      {revealed && selected ? (
        <span className={styles.feedback} id={`${name}-${option.id}-feedback`}>
          <AssessmentBadge assessment={option.assessment} />
          <span className="t-body-sm">{option.feedback}</span>
        </span>
      ) : null}
    </label>
  );
}
