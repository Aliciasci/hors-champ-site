import { Lightbulb, Rocket, Sparkles, User, UsersRound, type LucideIcon } from '@/components/icons';

export interface NavItem {
  href: string;
  label: string;
  /** Libellé complet lu par les lecteurs d'écran, si différent. */
  ariaLabel?: string;
  icon: LucideIcon;
  /** Préfixes d'URL rattachés à la rubrique (pour le soulignement). */
  match: (path: string) => boolean;
}

const under = (prefix: string) => (path: string) =>
  path === prefix || path.startsWith(`${prefix}/`);

export const NAV_ITEMS: NavItem[] = [
  {
    href: '/',
    label: 'Découvrir',
    icon: Sparkles,
    match: (p) =>
      p === '/' || ['/culture', '/collection', '/droits'].some((prefix) => under(prefix)(p)),
  },
  { href: '/elles', label: 'Elles', icon: UsersRound, match: under('/elles') },
  {
    href: '/possible',
    label: 'Possible',
    ariaLabel: 'Tout est possible',
    icon: Rocket,
    match: under('/possible'),
  },
  { href: '/contrechamps', label: 'Contrechamps', icon: Lightbulb, match: under('/contrechamps') },
  { href: '/profil', label: 'Profil', icon: User, match: under('/profil') },
];

/** Chemin sans barre finale (l'export statique en ajoute une). */
export const normalizePath = (path: string | null) =>
  !path || path === '/' ? '/' : path.replace(/\/$/, '');
