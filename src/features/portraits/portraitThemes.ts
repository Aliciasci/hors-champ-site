import { portraitThemes } from '@/data/portraitThemes';
import type { CultureEntity, PortraitTheme, PortraitThemeId } from '@/types';

export interface ResolvedMember {
  person: CultureEntity;
  reason: string;
}

export interface ResolvedTheme extends PortraitTheme {
  /** Membres dont la fiche existe dans le catalogue chargé. */
  people: ResolvedMember[];
}

/**
 * Relie les thématiques aux fiches chargées. Une membre dont la fiche est absente (retirée,
 * invalide) est ignorée, sans casser la thématique.
 */
export function resolveThemes(
  entities: readonly CultureEntity[],
  themes: readonly PortraitTheme[] = portraitThemes,
): ResolvedTheme[] {
  const byId = new Map(entities.map((e) => [e.id, e]));
  return themes.map((theme) => ({
    ...theme,
    people: theme.members.flatMap(({ personId, reason }) => {
      const person = byId.get(personId);
      return person && person.kind === 'person' ? [{ person, reason }] : [];
    }),
  }));
}

/** Thématiques d'une femme, pour l'afficher sur sa fiche. */
export function themesOf(entities: readonly CultureEntity[], personId: string): ResolvedTheme[] {
  return resolveThemes(entities).filter((t) => t.people.some((m) => m.person.id === personId));
}

export const isThemeId = (id: string | undefined): id is PortraitThemeId =>
  portraitThemes.some((t) => t.id === id);
