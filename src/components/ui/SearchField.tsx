'use client';

import { forwardRef } from 'react';

import { Search, X } from '@/components/icons';

import styles from './SearchField.module.css';

/** Champ de recherche natif (`type="search"`) avec libellé et bouton d'effacement. */
export const SearchField = forwardRef<
  HTMLInputElement,
  {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    testId?: string;
    hint?: string;
  }
>(function SearchField({ label, value, onChange, placeholder, testId, hint }, ref) {
  return (
    <div className={styles.field} role="search">
      <label className="sr-only" htmlFor={testId ?? label}>
        {label}
      </label>
      <Search size={18} strokeWidth={2.25} aria-hidden="true" className={styles.icon} />
      <input
        ref={ref}
        id={testId ?? label}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={styles.input}
        autoComplete="off"
        spellCheck={false}
        enterKeyHint="search"
        data-testid={testId}
      />
      {hint ? (
        <kbd className={styles.hint} aria-hidden="true">
          {hint}
        </kbd>
      ) : null}
      {value ? (
        <button
          type="button"
          className={styles.clear}
          onClick={() => onChange('')}
          aria-label="Effacer la recherche"
        >
          <X size={16} strokeWidth={2.5} aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
});
