'use client';

import { useEffect, useRef, type RefObject } from 'react';

import styles from './Feminicides.module.css';

/** Où en est le récit : l'acte en cours (0 à 4) et l'avancée dans cet acte (0 à 1). */
export interface StoryPosition {
  act: number;
  progress: number;
}

interface Fly {
  x: number;
  y: number;
  /** Profondeur : 0,3 (loin, petite, lente) à 1 (proche). */
  z: number;
  /** Ordre d'apparition : une luciole s'allume quand la densité dépasse ce seuil. */
  rank: number;
  phase: number;
  /** Respiration lente, entre 6 et 16 secondes par cycle : jamais de scintillement. */
  speed: number;
  /** Place sur le chemin de lumière du dernier acte. */
  pathT: number;
  pathJitter: number;
}

/** Générateur pseudo-aléatoire déterministe : la même nuit à chaque visite. */
function random(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function makeFlies(count: number): Fly[] {
  const rand = random(7);
  return Array.from({ length: count }, (_, index) => ({
    x: rand(),
    y: rand(),
    z: 0.3 + rand() * 0.7,
    rank: index / count,
    phase: rand() * Math.PI * 2,
    speed: (Math.PI * 2) / (6 + rand() * 10),
    pathT: rand(),
    pathJitter: rand() - 0.5,
  }));
}

/** Combien de lucioles sont allumées, acte par acte (part du total). */
function densityAt({ act, progress }: StoryPosition) {
  switch (act) {
    case 0:
      return 0.12;
    case 1:
      // Une lumière, puis une autre, puis des milliers.
      return 0.04 + 0.96 * Math.min(1, progress * 1.25) ** 2;
    case 2:
      return 0.45;
    case 3:
      return 0.7;
    default:
      return 0.7;
  }
}

/** Recul de la « caméra » : proche au début de l'acte II, puis tout le champ. */
function zoomAt({ act, progress }: StoryPosition) {
  if (act === 0) return 1.7;
  if (act === 1) return 1.7 - 0.7 * Math.min(1, progress * 1.25);
  return 1;
}

/** Le chemin de lumière de l'acte V : une ligne sinueuse, du bas à gauche vers l'horizon. */
function pathPoint(t: number, jitter: number) {
  const x = 0.08 + t * 0.84;
  const y = 0.92 - t * 0.5 + Math.sin(t * Math.PI * 2.2) * 0.07 + jitter * 0.05 * (1 - t * 0.6);
  return { x, y };
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Les lucioles : un canvas sous le texte. Leur nombre suit le récit (densityAt), elles respirent
 * lentement et dérivent à peine. Au dernier acte, elles se rangent en chemin. Sans animation
 * (réglage du système ou bouton de la page), la scène est redessinée seulement quand le récit
 * avance : les lumières sont là, immobiles.
 */
export function Fireflies({
  position,
  animate,
}: {
  position: RefObject<StoryPosition>;
  animate: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const small = window.matchMedia('(max-width: 699px)').matches;
    const flies = makeFlies(small ? 260 : 700);
    // Une seule lueur, dessinée une fois puis copiée : pas de dégradé recalculé à chaque image.
    const sprite = document.createElement('canvas');
    sprite.width = sprite.height = 64;
    const s = sprite.getContext('2d')!;
    const glow = s.createRadialGradient(32, 32, 0, 32, 32, 32);
    glow.addColorStop(0, 'rgba(255, 244, 220, 1)');
    glow.addColorStop(0.1, 'rgba(255, 214, 140, 1)');
    glow.addColorStop(0.28, 'rgba(255, 198, 109, 0.5)');
    glow.addColorStop(0.6, 'rgba(255, 198, 109, 0.12)');
    glow.addColorStop(1, 'rgba(255, 198, 109, 0)');
    s.fillStyle = glow;
    s.fillRect(0, 0, 64, 64);

    let width = 0;
    let height = 0;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    resize();

    // Valeurs lissées : la densité et le recul suivent le défilement sans à-coups.
    let density = densityAt(position.current);
    let zoom = zoomAt(position.current);
    let gather = 0;

    const draw = (time: number, smooth: boolean) => {
      const target = position.current;
      const k = smooth ? 0.05 : 1;
      density = lerp(density, densityAt(target), k);
      zoom = lerp(zoom, zoomAt(target), k);
      gather = lerp(gather, target.act === 4 ? Math.min(1, 0.25 + target.progress * 1.2) : 0, k);

      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = 'lighter';
      const seconds = time / 1000;
      const base = Math.min(width, height);
      for (const fly of flies) {
        // Les dernières à s'allumer arrivent en fondu, sur un dixième de la densité.
        const on = Math.min(1, Math.max(0, (density - fly.rank) / 0.1));
        if (on <= 0) continue;
        const drift = animate ? seconds * 0.02 * fly.z : 0;
        let x = fly.x + Math.sin(drift * 3 + fly.phase) * 0.012;
        let y = fly.y + Math.cos(drift * 2 + fly.phase * 1.3) * 0.01;
        x = 0.5 + (x - 0.5) * zoom;
        y = 0.55 + (y - 0.55) * zoom;
        if (gather > 0.001) {
          const p = pathPoint(fly.pathT, fly.pathJitter);
          x = lerp(x, p.x, gather);
          y = lerp(y, p.y, gather);
        }
        if (x < -0.05 || x > 1.05 || y < -0.05 || y > 1.05) continue;
        const breath = animate ? 0.72 + 0.28 * Math.sin(seconds * fly.speed + fly.phase) : 0.85;
        // Au début, peu de lumières : chacune un peu plus présente.
        const alpha = Math.min(
          1,
          on * breath * (0.55 + 0.45 * fly.z) * (1 + 0.5 * Math.max(0, 1 - density * 6)),
        );
        const size = (base / 38) * (0.5 + fly.z * 1.2) * Math.max(0.75, zoom * 0.8);
        context.globalAlpha = alpha;
        context.drawImage(sprite, x * width - size / 2, y * height - size / 2, size, size);
      }
      context.globalAlpha = 1;
      context.globalCompositeOperation = 'source-over';
    };

    let frame = 0;
    let visible = true;
    const loop = (time: number) => {
      draw(time, true);
      frame = visible && !document.hidden ? requestAnimationFrame(loop) : 0;
    };
    const start = () => {
      if (animate && !frame && visible && !document.hidden) frame = requestAnimationFrame(loop);
    };
    // Sans animation : on redessine seulement quand le récit change d'endroit.
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
      window.addEventListener('hc-story-move', still);
    }

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizer.disconnect();
      document.removeEventListener('visibilitychange', start);
      window.removeEventListener('hc-story-move', still);
    };
  }, [animate, position]);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
