import { Globe, Lightbulb, Sparkles, User, UsersRound, type LucideIcon } from '@/components/icons';

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
      !under('/droits/monde')(p) &&
      (p === '/' || ['/culture', '/collection', '/droits'].some((prefix) => under(prefix)(p))),
  },
  {
    href: '/droits/monde',
    label: 'Le monde',
    ariaLabel: 'Les droits des femmes dans le monde',
    icon: Globe,
    match: under('/droits/monde'),
  },
  { href: '/elles', label: 'Elles', icon: UsersRound, match: under('/elles') },
  {
    href: '/activites',
    label: 'Activités',
    icon: Lightbulb,
    // Contrechamps et « Tout est possible » sont rangés sous Activités.
    match: (p) => ['/activites', '/possible', '/contrechamps'].some((prefix) => under(prefix)(p)),
  },
  { href: '/profil', label: 'Profil', icon: User, match: under('/profil') },
];

/** Chemin sans barre finale (l'export statique en ajoute une). */
export const normalizePath = (path: string | null) =>
  !path || path === '/' ? '/' : path.replace(/\/$/, '');
