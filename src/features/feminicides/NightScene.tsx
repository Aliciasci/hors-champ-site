'use client';

import { useEffect, useRef, type RefObject } from 'react';

import styles from './Feminicides.module.css';
import { Hills, Meadow, random } from './Landscape';

/** Où en est le récit : l'acte (0 à 4), l'avancée dans l'acte et dans toute la page (0 à 1). */
export interface StoryPosition {
  act: number;
  progress: number;
  page: number;
}

/** Profondeur du champ, en unités du monde : les lucioles vivent entre la caméra et l'horizon. */
const DEPTH = 14;
const NEAR = 0.35;

type Behaviour = 'breathe' | 'wander' | 'fade';

interface Fly {
  x: number;
  /** Hauteur au-dessus du sol : la plupart dans les herbes, quelques-unes plus haut. */
  y: number;
  z: number;
  /** Ordre d'apparition : une luciole s'allume quand la densité dépasse ce seuil. */
  rank: number;
  behaviour: Behaviour;
  phase: number;
  /** Rythme propre, entre 7 et 18 secondes : jamais deux lucioles synchrones. */
  period: number;
  /** Amplitude et fréquences de la dérive, pour une trajectoire lente et irrégulière. */
  drift: number;
  fx: number;
  fy: number;
  /** Essaim auquel elle appartient (-1 : seule), et sa place dans la constellation. */
  cluster: number;
  /** Place sur le chemin du dernier acte (-1 : hors du chemin). */
  path: number;
  /** Ouverture : moment où elle s'allume, en secondes (Infinity : après l'ouverture). */
  intro: number;
  size: number;
}

/** Quelques lucioles s'allument d'abord une à une, au loin puis dans les herbes. */
const INTRO = [
  { at: 0.9, x: 1.1, y: 0.4, z: 7.5 },
  { at: 1.9, x: -0.7, y: 0.25, z: 5.5 },
  { at: 2.8, x: 0.25, y: 0.1, z: 2.4 },
  { at: 3.3, x: -1.9, y: 0.15, z: 4.2 },
  { at: 3.9, x: 2.2, y: 0.22, z: 4.8 },
  { at: 4.4, x: -0.3, y: 0.45, z: 9.5 },
  { at: 4.8, x: 0.8, y: 0.06, z: 1.6 },
  { at: 5.3, x: -2.8, y: 0.3, z: 7 },
  { at: 5.7, x: 3.1, y: 0.12, z: 3.6 },
  { at: 6.2, x: -1.2, y: 0.08, z: 2.2 },
];

function makeFlies(count: number): { flies: Fly[]; chains: number[][] } {
  const rand = random(11);
  const clusters = Array.from({ length: 16 }, () => ({
    x: (rand() - 0.5) * 9,
    z: 1.5 + rand() * (DEPTH - 2),
    y: 0.15 + rand() * 0.5,
    r: 0.35 + rand() * 0.5,
  }));
  const flies: Fly[] = [];
  for (let i = 0; i < count; i++) {
    const intro = INTRO[i];
    const clustered = !intro && rand() < 0.45;
    const c = clustered ? Math.floor(rand() * clusters.length) : -1;
    const home = clusters[c];
    const x = intro?.x ?? (home ? home.x + (rand() - 0.5) * home.r * 2 : (rand() - 0.5) * 12);
    const z = intro?.z ?? (home ? home.z + (rand() - 0.5) * home.r * 2 : NEAR + rand() * DEPTH);
    const y =
      intro?.y ??
      (home
        ? home.y + (rand() - 0.5) * home.r
        : rand() < 0.8
          ? rand() * 0.35
          : 0.35 + rand() * 0.9);
    const b = rand();
    flies.push({
      x,
      y,
      z,
      rank: intro ? i * 0.002 : 0.02 + rand() * 0.98,
      behaviour: b < 0.55 ? 'breathe' : b < 0.85 ? 'wander' : 'fade',
      phase: rand() * Math.PI * 2,
      period: 7 + rand() * 11,
      drift: 0.04 + rand() * 0.12,
      fx: 0.05 + rand() * 0.09,
      fy: 0.04 + rand() * 0.07,
      cluster: c,
      path: !intro && !clustered && rand() < 0.35 ? rand() : -1,
      intro: intro?.at ?? Infinity,
      size: 0.7 + rand() * 0.6,
    });
  }
  // Constellations : les membres d'un essaim reliés de proche en proche, de gauche à droite.
  const chains = clusters.map((_, c) =>
    flies
      .map((fly, index) => ({ fly, index }))
      .filter(({ fly }) => fly.cluster === c)
      .sort((a, b) => a.fly.x - b.fly.x)
      .slice(0, 9)
      .map(({ index }) => index),
  );
  return { flies, chains };
}

interface Camera {
  /** Avancée dans le paysage. */
  z: number;
  /** Hauteur de la caméra : plus haut, on voit le champ s'étendre. */
  height: number;
  /** Ligne d'horizon, en part de la hauteur de l'écran. */
  horizon: number;
  /** Léger balancement latéral : il fait glisser les plans les uns sur les autres. */
  x: number;
  /** Part des lucioles allumées. */
  density: number;
  /** Lignes entre les lucioles d'un même essaim (acte IV). */
  links: number;
  /** Lucioles rangées en chemin (acte V). */
  gather: number;
  /** Lucioles lointaines atténuées (acte III : certaines restent, d'autres s'éloignent). */
  hush: number;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (n: number) => Math.min(1, Math.max(0, n));
const ease = (t: number) => t * t * (3 - 2 * t);

/** Le plan de la caméra pour un endroit du récit. */
function cameraAt({ act, progress, page }: StoryPosition): Camera {
  const p = clamp(progress);
  const base = {
    z: page * 26,
    x: Math.sin(page * Math.PI * 3) * 0.6,
    links: 0,
    gather: 0,
    hush: 0,
  };
  switch (act) {
    case 0:
      return { ...base, height: 0.16, horizon: 0.64, density: 0.03 + p * 0.03 };
    case 1: {
      const rise = ease(clamp(p * 1.3));
      return {
        ...base,
        height: lerp(0.18, 1.35, rise),
        horizon: lerp(0.62, 0.4, rise),
        density: lerp(0.06, 1, clamp(p * 1.4) ** 2),
      };
    }
    case 2:
      return {
        ...base,
        height: lerp(1.2, 0.6, ease(p)),
        horizon: lerp(0.42, 0.52, ease(p)),
        density: 0.55,
        hush: ease(clamp(p * 2)),
      };
    case 3:
      return {
        ...base,
        height: 0.75,
        horizon: 0.5,
        density: 0.7,
        hush: 0.35,
        links: ease(clamp(p * 3)),
      };
    default:
      return {
        ...base,
        height: lerp(0.5, 0.24, ease(p)),
        horizon: lerp(0.58, 0.74, ease(p)),
        density: 0.4,
        gather: ease(clamp(0.2 + p * 1.4)),
        hush: 0.5,
      };
  }
}

/** Sans animation : un plan fixe par acte, sans parallaxe ni mouvement au défilement. */
const STILL_PROGRESS = [0.5, 1, 0.7, 1, 1];
function stillCamera({ act }: StoryPosition): Camera {
  return cameraAt({ act, progress: STILL_PROGRESS[act] ?? 1, page: 0.1 + act * 0.2 });
}

function blend(a: Camera, b: Camera, t: number): Camera {
  return {
    z: lerp(a.z, b.z, t),
    height: lerp(a.height, b.height, t),
    horizon: lerp(a.horizon, b.horizon, t),
    x: lerp(a.x, b.x, t),
    density: lerp(a.density, b.density, t),
    links: lerp(a.links, b.links, t),
    gather: lerp(a.gather, b.gather, t),
    hush: lerp(a.hush, b.hush, t),
  };
}

/**
 * La nuit : un ciel, un horizon, trois plans d'herbes et de fleurs, et des lucioles placées dans
 * un vrai champ en profondeur. Le défilement est la caméra : elle avance, monte au-dessus du
 * champ pour en montrer l'ampleur, redescend, puis regarde l'horizon. Les lucioles proches sont
 * grandes et rapides, les lointaines petites et lentes.
 *
 * Sans animation, la scène est posée acte par acte : pas de mouvement, pas de parallaxe.
 */
export function NightScene({
  position,
  animate,
}: {
  position: RefObject<StoryPosition>;
  animate: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hillsRef = useRef<HTMLDivElement>(null);
  const farRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const nearRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const small = window.matchMedia('(max-width: 699px)').matches;
    const { flies, chains } = makeFlies(small ? 320 : 820);

    // Deux lueurs dessinées une fois : le cœur incandescent, et le halo ambré diffus.
    const sprite = (stops: [number, string][]) => {
      const c = document.createElement('canvas');
      c.width = c.height = 64;
      const g = c.getContext('2d')!;
      const gradient = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      for (const [at, color] of stops) gradient.addColorStop(at, color);
      g.fillStyle = gradient;
      g.fillRect(0, 0, 64, 64);
      return c;
    };
    const core = sprite([
      [0, 'rgba(255, 246, 222, 1)'],
      [0.18, 'rgba(255, 214, 140, 0.95)'],
      [0.45, 'rgba(247, 185, 94, 0.35)'],
      [1, 'rgba(247, 185, 94, 0)'],
    ]);
    const halo = sprite([
      [0, 'rgba(247, 185, 94, 0.35)'],
      [0.4, 'rgba(233, 107, 53, 0.1)'],
      [1, 'rgba(233, 107, 53, 0)'],
    ]);

    let width = 0;
    let height = 0;
    let focal = 1;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2);
      width = rect.width;
      height = rect.height;
      focal = Math.max(width, height) * 0.62;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    resize();

    let camera = animate ? cameraAt(position.current) : stillCamera(position.current);
    const started = performance.now();
    const screen = new Float32Array(flies.length * 3);

    const draw = (now: number, smooth: boolean) => {
      camera = smooth
        ? blend(camera, cameraAt(position.current), 0.06)
        : stillCamera(position.current);
      const t = animate ? (now - started) / 1000 : 60;

      // Les plans du paysage glissent à des vitesses différentes : la parallaxe.
      const lift = (camera.height - 0.16) * height;
      const horizonPx = camera.horizon * height;
      const shift = (k: number) => -camera.x * k;
      const place = (el: HTMLDivElement | null, transform: string) => {
        if (el) el.style.transform = transform;
      };
      place(glowRef.current, `translate3d(0, ${horizonPx - height * 0.6}px, 0)`);
      place(hillsRef.current, `translate3d(${shift(18)}px, ${horizonPx}px, 0)`);
      place(farRef.current, `translate3d(${shift(40)}px, ${horizonPx}px, 0)`);
      place(midRef.current, `translate3d(${shift(120)}px, ${lift * 0.12}px, 0)`);
      place(nearRef.current, `translate3d(${shift(260)}px, ${lift * 0.3}px, 0)`);

      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = 'lighter';
      const unit = focal / 140;

      for (let i = 0; i < flies.length; i++) {
        const fly = flies[i]!;
        screen[i * 3 + 2] = 0;
        // Allumage : selon la densité du moment, et pendant l'ouverture, une à une.
        let on = clamp((camera.density - fly.rank) / 0.06);
        if (animate && position.current.act === 0) {
          on *= fly.intro !== Infinity ? clamp((t - fly.intro) / 2.2) : clamp((t - 6.5) / 4);
        }
        if (on <= 0.001) continue;

        // Dérive lente, propre à chaque luciole ; plus ample pour les vagabondes.
        const amp = fly.behaviour === 'wander' ? fly.drift * 2.2 : fly.drift;
        let x =
          fly.x +
          Math.sin(t * fly.fx * 2.1 + fly.phase) * amp +
          Math.sin(t * fly.fx * 0.7) * amp * 0.5;
        let y = fly.y + Math.sin(t * fly.fy * 1.7 + fly.phase * 1.3) * amp * 0.45;
        let dz = ((((fly.z - NEAR - camera.z) % DEPTH) + DEPTH) % DEPTH) + NEAR;

        // Acte V : une partie des lucioles se range en chemin vers l'horizon.
        if (fly.path >= 0 && camera.gather > 0.001) {
          // Un chemin qui serpente du premier plan, à gauche, jusqu'à l'horizon.
          const d = 2.2 + fly.path * (DEPTH - 3);
          const px =
            -1.6 * (1 - fly.path) +
            Math.sin(fly.path * 9 + 0.4) * (0.5 + fly.path * 2.2) +
            camera.x;
          x = lerp(x, px, camera.gather);
          y = lerp(y, 0.06 + fly.path * 0.05, camera.gather);
          dz = lerp(dz, d, camera.gather);
        }

        const sx = width / 2 + ((x - camera.x) / dz) * focal;
        const sy = camera.horizon * height + ((camera.height - y) / dz) * focal * 0.55;
        if (sx < -60 || sx > width + 60 || sy < -60 || sy > height + 60) continue;

        // Respiration, extinction lente, ou présence continue : jamais en même temps.
        const cycle = (t / fly.period) * Math.PI * 2 + fly.phase;
        let glow = 0.72 + 0.28 * Math.sin(cycle);
        if (fly.behaviour === 'fade') glow = clamp(0.5 + Math.sin(cycle) * 1.4);
        if (!animate) glow = 0.85;

        // Atténuées de loin, et tout près de la caméra (pas de tache floue envahissante).
        const far = clamp((DEPTH + NEAR - dz) / 3.5);
        const near = clamp((dz - NEAR) / 0.6);
        const hushed =
          fly.cluster >= 0 || fly.path >= 0 ? 1 : 1 - camera.hush * clamp((dz - 3) / 6);
        const alpha = on * glow * far * near * hushed;
        if (alpha <= 0.01) continue;

        const gathered = fly.path >= 0 ? camera.gather : 0;
        const size =
          Math.min(unit * (34 - gathered * 22), (unit * 15 * fly.size) / Math.max(dz, 0.6)) + 2.5;
        context.globalAlpha = alpha;
        context.drawImage(core, sx - size / 2, sy - size / 2, size, size);
        if (dz < 4.5 && gathered < 0.5) {
          const h = size * 3.2;
          context.globalAlpha = alpha * clamp((4.5 - dz) / 2.5) * 0.8;
          context.drawImage(halo, sx - h / 2, sy - h / 2, h, h);
        }
        screen[i * 3] = sx;
        screen[i * 3 + 1] = sy;
        screen[i * 3 + 2] = alpha;
      }

      // Acte IV : les lucioles d'un même essaim se relient, comme une constellation.
      if (camera.links > 0.01) {
        context.globalCompositeOperation = 'source-over';
        context.lineWidth = 1;
        context.strokeStyle = 'rgb(247, 185, 94)';
        for (const chain of chains) {
          for (let k = 1; k < chain.length; k++) {
            const a = chain[k - 1]! * 3;
            const b = chain[k]! * 3;
            const strength = Math.min(screen[a + 2]!, screen[b + 2]!);
            if (strength <= 0.05) continue;
            const length = Math.hypot(screen[a]! - screen[b]!, screen[a + 1]! - screen[b + 1]!);
            if (length > width * 0.18) continue;
            context.globalAlpha = camera.links * strength * 0.32;
            context.beginPath();
            context.moveTo(screen[a]!, screen[a + 1]!);
            context.lineTo(screen[b]!, screen[b + 1]!);
            context.stroke();
          }
        }
      }
      context.globalAlpha = 1;
      context.globalCompositeOperation = 'source-over';
    };

    let frame = 0;
    let visible = true;
    const loop = (now: number) => {
      draw(now, true);
      frame = visible && !document.hidden ? requestAnimationFrame(loop) : 0;
    };
    const start = () => {
      if (animate && !frame && visible && !document.hidden) frame = requestAnimationFrame(loop);
    };
    const still = () => draw(0, false);

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      start();
    });
    observer.observe(canvas);
    const resizer = new ResizeObserver(() => {
      resize();
      if (!animate) still();
    });
    resizer.observe(canvas);
    document.addEventListener('visibilitychange', start);
    if (animate) start();
    else {
      still();
      window.addEventListener('hc-story-act', still);
    }

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizer.disconnect();
      document.removeEventListener('visibilitychange', start);
      window.removeEventListener('hc-story-act', still);
    };
  }, [animate, position]);

  return (
    <div className={styles.stage} aria-hidden="true">
      <div className={styles.sky} />
      <div ref={glowRef} className={styles.horizonGlow} />
      <div ref={hillsRef} className={styles.hillsLayer}>
        <Hills className={styles.hills} />
      </div>
      <div ref={farRef} className={styles.farLayer}>
        <Meadow className={styles.meadowFar} seed={21} height={60} count={900} />
      </div>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div ref={midRef} className={styles.midLayer}>
        <Meadow className={styles.meadowMid} seed={33} height={150} count={520} flowerCount={26} />
      </div>
      <div ref={nearRef} className={styles.nearLayer}>
        <Meadow className={styles.meadowNear} seed={47} height={260} count={260} flowerCount={14} />
      </div>
      <div className={styles.grain} />
    </div>
  );
}
