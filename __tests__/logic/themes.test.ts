import { localCultureEntities } from '@/data/culture';
import { portraitThemes } from '@/data/portraitThemes';
import { relatedEntities } from '@/features/culture/cultureGraph';
import { prepareCultureEntities } from '@/features/culture/validateCulture';
import { resolveThemes, themesOf } from '@/features/portraits/portraitThemes';

const catalog = prepareCultureEntities(localCultureEntities, () => {});
const byId = new Map(catalog.map((e) => [e.id, e]));

describe('thématiques des portraits', () => {
  it('propose les neuf thématiques, dans l’ordre', () => {
    expect(portraitThemes.map((t) => t.title)).toEqual([
      'Elles ont révolutionné le monde',
      'Elles ont changé la culture',
      'Elles ont conquis des droits',
      'Elles ont changé nos idées',
      'Elles ont été oubliées',
      'Elles étaient là avant tout le monde',
      'Elles ont fait tourner le monde',
      'Elles ont changé le cours de l’histoire',
      'Elles ont repoussé les limites',
    ]);
  });

  it('ne range que des fiches de femmes existantes, chacune avec une raison', () => {
    for (const theme of portraitThemes) {
      const ids = theme.members.map((m) => m.personId);
      expect(new Set(ids).size).toBe(ids.length);
      for (const member of theme.members) {
        expect(byId.get(member.personId)?.kind).toBe('person');
        expect(member.reason.length).toBeGreaterThan(15);
      }
    }
    expect(resolveThemes(catalog).flatMap((t) => t.people)).toHaveLength(
      portraitThemes.flatMap((t) => t.members).length,
    );
  });

  it('range chaque femme du catalogue dans au moins une thématique, parfois plusieurs', () => {
    for (const person of catalog.filter((e) => e.kind === 'person')) {
      expect({ id: person.id, n: themesOf(catalog, person.id).length > 0 }).toEqual({
        id: person.id,
        n: true,
      });
    }
    expect(themesOf(catalog, 'person-simone-de-beauvoir').map((t) => t.id)).toEqual([
      'droits',
      'idees',
    ]);
  });

  it('« oubliées » ne compte que des femmes que la source de l’effet Matilda relie', () => {
    const matilda = relatedEntities(catalog, 'idea-effet-matilda').map((r) => r.entity.id);
    const forgotten = portraitThemes.find((t) => t.id === 'oubliees');
    for (const member of forgotten?.members ?? []) expect(matilda).toContain(member.personId);
  });

  it('laisse vides les thématiques sans fiche documentée plutôt que de les remplir', () => {
    const empty = portraitThemes.filter((t) => t.members.length === 0).map((t) => t.id);
    expect(empty).toEqual(['quotidien', 'limites']);
  });

  it('ignore une membre dont la fiche a disparu', () => {
    const themes = resolveThemes(catalog, [
      {
        ...portraitThemes[0]!,
        members: [{ personId: 'person-absente', reason: 'Raison de test.' }],
      },
    ]);
    expect(themes[0]?.people).toEqual([]);
  });
});
