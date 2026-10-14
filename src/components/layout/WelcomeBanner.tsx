'use client';

import { X } from '@/components/icons';
import { ButtonLink } from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';

import styles from './WelcomeBanner.module.css';

/**
 * Bandeau discret de première visite (accueil). L'onboarding n'est jamais bloquant :
 * « Commencer » y mène, la croix le passe. Posé en surimpression fixe, il n'apparaît qu'après
 * lecture des données locales et ne décale aucun contenu.
 */
export function WelcomeBanner() {
  const hydrated = useAppStore((s) => s.hasHydrated);
  const done = useAppStore((s) => s.preferences.onboardingCompleted);
  const skip = useAppStore((s) => s.skipOnboarding);
  if (!hydrated || done) return null;
  return (
    <aside
      className={`${styles.banner} no-print`}
      aria-labelledby="welcome-title"
      data-testid="welcome-banner"
    >
      <div className={styles.text}>
        <p id="welcome-title" className="t-label">
          Première visite ?
        </p>
        <p className="t-body-sm c-2">Quatre étapes pour découvrir l’approche de Hors-Champ.</p>
      </div>
      <ButtonLink href="/bienvenue" variant="primary" className={styles.start}>
        Commencer
      </ButtonLink>
      <button
        type="button"
        className={styles.close}
        onClick={skip}
        aria-label="Fermer le bandeau de bienvenue"
        data-testid="welcome-close"
      >
        <X size={20} strokeWidth={2.25} aria-hidden="true" />
      </button>
    </aside>
  );
}
