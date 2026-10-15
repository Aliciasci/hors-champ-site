import styles from './Feminicides.module.css';

/** Pseudo-aléatoire déterministe : le même rendu côté serveur et dans le navigateur. */
function random(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Herbes hautes et silhouettes végétales en contre-jour, au bas d'une scène. Une simple
 * silhouette : deux plans d'herbes (le plus loin un peu plus clair), quelques tiges à ombelles.
 */
export function Grass({ seed = 1, tall = false }: { seed?: number; tall?: boolean }) {
  const rand = random(seed);
  const width = 1200;
  const height = tall ? 220 : 150;
  const blades = (count: number, maxHeight: number) =>
    Array.from({ length: count }, () => {
      const x = rand() * width;
      const h = maxHeight * (0.35 + rand() * 0.65);
      const lean = (rand() - 0.5) * h * 0.5;
      const w = 2 + rand() * 4;
      return `M${(x - w).toFixed(1)} ${height} Q${(x + lean * 0.4).toFixed(1)} ${(height - h * 0.6).toFixed(1)} ${(x + lean).toFixed(1)} ${(height - h).toFixed(1)} Q${(x + lean * 0.4 + w * 0.4).toFixed(1)} ${(height - h * 0.6).toFixed(1)} ${(x + w).toFixed(1)} ${height}Z`;
    }).join('');
  const stems = Array.from({ length: 7 }, () => {
    const x = 40 + rand() * (width - 80);
    const h = height * (0.6 + rand() * 0.38);
    const top = height - h;
    const umbel = Array.from({ length: 6 }, (_, i) => {
      const a = Math.PI * (0.15 + (i / 5) * 0.7);
      const r = 10 + rand() * 8;
      return `M${x.toFixed(1)} ${top.toFixed(1)} L${(x - Math.cos(a) * r).toFixed(1)} ${(top - Math.sin(a) * r).toFixed(1)}`;
    }).join('');
    return `M${x.toFixed(1)} ${height} L${x.toFixed(1)} ${top.toFixed(1)}${umbel}`;
  }).join('');
  return (
    <svg
      className={styles.grass}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d={blades(150, height * 0.7)} className={styles.grassFar} />
      <path d={stems} className={styles.stems} />
      <path d={blades(220, height)} className={styles.grassNear} />
    </svg>
  );
}
