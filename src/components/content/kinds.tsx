import {
  Atom,
  CalendarDays,
  Frame,
  Landmark,
  Lightbulb,
  Palette,
  ScrollText,
  UserRound,
  Users,
  type LucideIcon,
} from '@/components/icons';
import type { CultureKind } from '@/types';

import styles from './kinds.module.css';

export const KIND_ICONS: Record<CultureKind, LucideIcon> = {
  person: UserRound,
  work: Frame,
  science: Atom,
  movement: Palette,
  event: CalendarDays,
  idea: Lightbulb,
  right: Landmark,
  organization: Users,
  law: ScrollText,
};

/** Couleur de repère par type de fiche : toujours doublée d'une icône et d'un libellé. */
export const kindClass = (kind: CultureKind) => styles[kind] ?? '';
