'use client';

import { useEffect } from 'react';

import { useAppStore } from '@/store/useAppStore';

/**
 * Reflète le thème choisi sur <html data-theme>. Le script inline du <head> l'a déjà posé avant
 * le premier rendu ; ce composant suit ensuite les changements (Profil, pied de page, autre onglet).
 */
export function ThemeSync() {
  const themeId = useAppStore((s) => s.preferences.themeId);
  const hydrated = useAppStore((s) => s.hasHydrated);
  useEffect(() => {
    if (hydrated) document.documentElement.dataset.theme = themeId;
  }, [themeId, hydrated]);
  return null;
}

/** Script exécuté avant le premier rendu : lit le thème enregistré, sans attendre React. */
export const THEME_INIT_SCRIPT = `try{var s=JSON.parse(localStorage.getItem('hors-champ:state')||'null');var t=s&&s.state&&s.state.preferences&&s.state.preferences.themeId;if(t==='cartel'||t==='revue')document.documentElement.dataset.theme=t}catch(e){}`;
