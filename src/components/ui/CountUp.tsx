'use client';

import { useEffect, useRef, useState } from 'react';

/** Durée du défilement des chiffres, en millisecondes. */
const DURATION = 1100;

/**
 * Un nombre qui défile de 0 à sa valeur quand il entre à l'écran. Rendu final côté serveur
 * (sans JavaScript, ou sans animation selon l'appareil) ; la valeur exacte reste lue par les
 * lecteurs d'écran.
 */
export function CountUp({ value, className }: { value: number; className?: string }) {
  const [shown, setShown] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Déjà à l'écran au chargement : la valeur reste telle quelle, sans animation.
    if (element.getBoundingClientRect().top < window.innerHeight) return;
    // Plus bas dans la page : on part de 0, hors de la vue (pas de saut visible).
    let frame = requestAnimationFrame(() => setShown(0));
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION);
          setShown(Math.round(value * (1 - (1 - t) ** 3)));
          if (t < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.6 },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">{shown}</span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
