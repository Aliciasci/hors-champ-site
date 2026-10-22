import { notFound } from 'next/navigation';

/**
 * Le site et l'admin ont chacun leur mise en page racine : une adresse inconnue passe par ici
 * pour afficher la page « introuvable » du site.
 */
export default function Introuvable() {
  notFound();
}
