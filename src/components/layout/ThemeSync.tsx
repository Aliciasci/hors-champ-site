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

/** Clé posée une fois l'ouverture de la une vue : elle ne se rejoue plus. */
export const INTRO_KEY = 'hors-champ:intro-vue';

/** Clé du choix jour / nuit (absente : on suit le réglage de l'appareil). */
export const SCHEME_KEY = 'hors-champ:scheme';

/**
 * Script exécuté avant le premier rendu : lit le thème enregistré et le mode jour / nuit, sans
 * attendre React (pas de flash clair en mode nuit).
 */
export const THEME_INIT_SCRIPT = `try{var s=JSON.parse(localStorage.getItem('hors-champ:state')||'null');var t=s&&s.state&&s.state.preferences&&s.state.preferences.themeId;if(t==='cartel'||t==='revue')document.documentElement.dataset.theme=t}catch(e){}try{var c=localStorage.getItem('${'hors-champ:scheme'}');if(c!=='light'&&c!=='dark')c=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.scheme=c}catch(e){}try{if(localStorage.getItem('${'hors-champ:intro-vue'}'))document.documentElement.dataset.intro='vue'}catch(e){}`;
