import type { ChangeEventHandler, ReactNode } from 'react';

import { Check } from '@/components/icons';

import styles from './Chip.module.css';

/**
 * Pastille sélectionnable, sur un vrai contrôle natif : case à cocher (choix multiple) ou
 * bouton radio (choix unique, même `name`). L'état n'est jamais porté par la seule couleur.
 */
export function Chip({
  type = 'checkbox',
  name,
  value,
  checked,
  onChange,
  children,
  count,
  testId,
  ariaLabel,
}: {
  type?: 'checkbox' | 'radio';
  name: string;
  value: string;
  checked: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
  children: ReactNode;
  count?: number;
  testId?: string;
  ariaLabel?: string;
}) {
  return (
    <label className={`${styles.chip} ${checked ? styles.checked : ''}`}>
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className={styles.input}
        data-testid={testId}
        aria-label={ariaLabel}
      />
      {checked ? (
        <Check size={14} strokeWidth={3} aria-hidden="true" className={styles.check} />
      ) : null}
      <span>{children}</span>
      {count !== undefined ? <span className={styles.count}>{count}</span> : null}
    </label>
  );
}

/** Groupe de pastilles : `<fieldset>` + `<legend>`. */
export function ChipGroup({
  legend,
  children,
  hideLegend = false,
}: {
  legend: string;
  children: ReactNode;
  hideLegend?: boolean;
}) {
  return (
    <fieldset className={styles.group}>
      <legend className={hideLegend ? 'sr-only' : `t-overline c-2 ${styles.legend}`}>
        {legend}
      </legend>
      <div className={styles.chips}>{children}</div>
    </fieldset>
  );
}

/**
 * Contrôle segmenté : un groupe de boutons radio présenté en barre.
 */
export function Segmented<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
  testIdPrefix,
}: {
  legend: string;
  name: string;
  options: { id: T; label: string; ariaLabel?: string }[];
  value: T;
  onChange: (value: T) => void;
  testIdPrefix?: string;
}) {
  return (
    <fieldset className={styles.segmentedGroup}>
      <legend className="sr-only">{legend}</legend>
      <div className={styles.segmented}>
        {options.map((option) => (
          <label
            key={option.id}
            className={`${styles.segment} ${value === option.id ? styles.segmentOn : ''}`}
          >
            <input
              type="radio"
              name={name}
              value={option.id}
              checked={value === option.id}
              onChange={() => onChange(option.id)}
              className={styles.input}
              aria-label={option.ariaLabel}
              data-testid={testIdPrefix ? `${testIdPrefix}-${option.id}` : undefined}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
