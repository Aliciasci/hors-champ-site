import styles from './HandDrawn.module.css';

/** Trait de soulignement tracé « à la main » sous le contenu parent (thème Revue). */
export function HandUnderline({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={`${styles.underline} only-revue ${className ?? ''}`}
      viewBox="0 0 120 16"
      preserveAspectRatio="none"
    >
      <path d="M2 10 C 30 3, 60 14, 118 5" fill="none" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

/** Cercle tracé « à la main » autour du contenu parent (thème Revue). */
export function HandCircle({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={`${styles.circle} only-revue ${className ?? ''}`}
      viewBox="0 0 340 90"
      preserveAspectRatio="none"
    >
      <path
        d="M18 14 C 90 2, 260 0, 326 16 C 342 34, 336 72, 300 82 C 210 94, 70 92, 20 78 C 2 64, 4 26, 30 10"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
