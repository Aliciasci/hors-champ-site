/** Pseudo-aléatoire déterministe : le même paysage côté serveur et dans le navigateur. */
export function random(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const f = (n: number) => n.toFixed(1);

/** Des brins d'herbe effilés, légèrement courbés, posés sur la ligne du bas. */
function blades(rand: () => number, width: number, height: number, count: number, max: number) {
  let d = '';
  for (let i = 0; i < count; i++) {
    const x = rand() * width;
    const h = max * (0.25 + rand() ** 1.6 * 0.75);
    const lean = (rand() - 0.5) * h * 0.7;
    const w = 1.2 + rand() * 3.2;
    const tipX = x + lean;
    const tipY = height - h;
    d += `M${f(x - w)} ${height}Q${f(x + lean * 0.35)} ${f(height - h * 0.55)} ${f(tipX)} ${f(tipY)}Q${f(x + lean * 0.35 + w * 0.5)} ${f(height - h * 0.55)} ${f(x + w)} ${height}Z`;
  }
  return d;
}

/**
 * Tiges et fleurs des champs en silhouette : ombelles (carotte sauvage), épis de graminées,
 * petites fleurs rondes. Tracées en traits, sans aucun remplissage.
 */
function flowers(rand: () => number, width: number, height: number, count: number) {
  let stems = '';
  let heads = '';
  for (let i = 0; i < count; i++) {
    const x = 20 + rand() * (width - 40);
    const h = height * (0.45 + rand() * 0.5);
    const bend = (rand() - 0.5) * 40;
    const topX = x + bend;
    const topY = height - h;
    stems += `M${f(x)} ${height}Q${f(x + bend * 0.2)} ${f(height - h * 0.6)} ${f(topX)} ${f(topY)}`;
    const kind = rand();
    if (kind < 0.45) {
      // Ombelle : des rayons, chacun terminé par un point.
      const r = 9 + rand() * 12;
      for (let k = 0; k < 9; k++) {
        const a = Math.PI * (0.08 + (k / 8) * 0.84);
        const ex = topX - Math.cos(a) * r;
        const ey = topY - Math.sin(a) * r * 0.75;
        stems += `M${f(topX)} ${f(topY)}L${f(ex)} ${f(ey)}`;
        heads += `M${f(ex + 1.6)} ${f(ey)}a1.6 1.6 0 1 0 -3.2 0a1.6 1.6 0 1 0 3.2 0`;
      }
    } else if (kind < 0.8) {
      // Épi : de petits grains alternés le long de la pointe.
      for (let k = 0; k < 7; k++) {
        const t = k / 7;
        const ex = topX - bend * 0.08 * t;
        const ey = topY + t * 26;
        const side = k % 2 === 0 ? 1 : -1;
        heads += `M${f(ex)} ${f(ey)}q${f(side * 5)} -3 ${f(side * 2)} -9q${f(-side * 3)} 4 ${f(-side * 2)} 9Z`;
      }
    } else {
      // Petite fleur ronde, en bouton.
      const r = 3 + rand() * 3;
      heads += `M${f(topX + r)} ${f(topY)}a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0`;
    }
  }
  return { stems, heads };
}

/** Une ligne de collines lointaines, très douce. */
function hills(rand: () => number, width: number, height: number) {
  const phases = [rand() * 6, rand() * 6, rand() * 6];
  let d = `M0 ${height}`;
  for (let x = 0; x <= width; x += 24) {
    const t = x / width;
    const y =
      height * 0.55 -
      Math.sin(t * 5 + phases[0]!) * height * 0.22 -
      Math.sin(t * 13 + phases[1]!) * height * 0.08 -
      Math.sin(t * 31 + phases[2]!) * height * 0.03;
    d += `L${x} ${f(y)}`;
  }
  return `${d}L${width} ${height}Z`;
}

const WIDTH = 2400;

/** Les plans du paysage, du plus lointain au plus proche. */
export function Hills({ className }: { className?: string }) {
  const rand = random(5);
  return (
    <svg
      className={className}
      viewBox={`0 0 ${WIDTH} 90`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d={hills(rand, WIDTH, 90)} />
    </svg>
  );
}

export function Meadow({
  className,
  seed,
  height,
  count,
  flowerCount = 0,
}: {
  className?: string;
  seed: number;
  height: number;
  count: number;
  flowerCount?: number;
}) {
  const rand = random(seed);
  const grass = blades(rand, WIDTH, height, count, height);
  const bloom = flowerCount > 0 ? flowers(rand, WIDTH, height, flowerCount) : null;
  return (
    <svg
      className={className}
      viewBox={`0 0 ${WIDTH} ${height}`}
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
    >
      {bloom ? (
        <>
          <path d={bloom.stems} fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d={bloom.heads} fill="currentColor" />
        </>
      ) : null}
      <path d={grass} fill="currentColor" />
    </svg>
  );
}
