import { appelALaNature } from './appel-a-la-nature';
import { ideeRepriseEnReunion } from './idee-reprise-en-reunion';
import { memeMailDeuxLectures } from './meme-mail-deux-lectures';
import { publicitePerceuse } from './publicite-perceuse';
import { rayonJouets } from './rayon-jouets';
import { testDeBechdel } from './test-de-bechdel';

/**
 * Catalogue local. L'ordre détermine l'ordre d'affichage par défaut.
 * Pour ajouter une expérience : créer un fichier typé `Experience` dans ce dossier
 * et l'ajouter à cette liste. Le repository valide chaque entrée au chargement.
 */
export const localExperiences = [
  memeMailDeuxLectures,
  ideeRepriseEnReunion,
  publicitePerceuse,
  appelALaNature,
  rayonJouets,
  testDeBechdel,
];
