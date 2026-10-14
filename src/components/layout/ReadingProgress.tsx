'use client';

import { useEffect, useRef } from 'react';

import styles from './ReadingProgress.module.css';

/**
 * Fine barre en haut de l'écran qui avance avec la lecture de l'élément `targetId`.
 * Purement visuelle : masquée aux lecteurs d'écran.
 */
export function ReadingProgress({ targetId }: { targetId: string }) {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const target = document.getElementById(targetId);
      if (!target || !bar.current) return;
      const { top, height } = target.getBoundingClientRect();
      const readable = height - window.innerHeight;
      const progress = readable > 0 ? Math.min(1, Math.max(0, -top / readable)) : 1;
      bar.current.style.transform = `scaleX(${progress})`;
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.cancelAnimationFrame(frame);
    };
  }, [targetId]);

  return (
    <div className={`${styles.track} no-print`} aria-hidden="true">
      <div ref={bar} className={styles.bar} />
    </div>
  );
}
