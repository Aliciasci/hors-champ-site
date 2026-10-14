import { localCultureEntities } from '@/data/culture';
import { EXPLORE_DOORS, localYouthItems, youthLives } from '@/data/youth';
import { prepareCultureEntities } from '@/features/culture/validateCulture';
import { byDoor, prepareYouth, read, validateYouth } from '@/features/youth/youthCatalog';
import type { Career, YouthPortrait } from '@/types';

const culture = prepareCultureEntities(localCultureEntities, () => {});

describe('Tout est possible — corpus', () => {
  it('est entièrement valide, références et liens culturels compris', () => {
    expect(validateYouth(localYouthItems, youthLives, culture)).toEqual([]);
  });

  it('écrit chaque texte pour les deux tranches d’âge, plus court pour les 6–10 ans', () => {
    const careers = localYouthItems.filter((i): i is Career => i.kind === 'career');
    for (const c of careers) {
      expect(c.daily['6-10'].length).toBeLessThan(c.daily['11-14'].length);
    }
  });

  it('présente des métiers variés, dont des métiers auxquels on ne pense pas', () => {
    const careers = localYouthItems.filter((i): i is Career => i.kind === 'career');
    expect(careers.filter((c) => c.unusual).length).toBeGreaterThanOrEqual(2);
    expect(careers.filter((c) => !c.unusual).length).toBeGreaterThanOrEqual(3);
  });

  it('ne donne jamais un seul chemin : chaque métier propose au moins deux repères', () => {
    for (const c of localYouthItems.filter((i): i is Career => i.kind === 'career')) {
      expect(c.paths.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('associe chaque métier à une femme réelle, au portrait sourcé', () => {
    const byId = new Map(localYouthItems.map((i) => [i.id, i]));
    for (const c of localYouthItems.filter((i): i is Career => i.kind === 'career')) {
      const portrait = byId.get(c.portraitId) as YouthPortrait | undefined;
      expect(portrait?.kind).toBe('portrait');
      expect(portrait?.sources.length).toBeGreaterThanOrEqual(4);
      expect(portrait?.careerIds).toContain(c.id);
    }
  });

  it('cite chaque fait mot pour mot et garde tout le contenu en brouillon', () => {
    for (const item of localYouthItems) {
      expect(item.editorialStatus).toBe('draft');
      for (const source of item.sources) {
        expect(source.relevantExcerpt?.length).toBeGreaterThan(20);
        expect(source.url).toMatch(/^https:\/\/(fr|en)\.wikipedia\.org\/wiki\//);
      }
    }
  });

  it('ne note jamais l’enfant : aucun retour d’activité ne juge', () => {
    const judging = /\b(faux|nul|mauvaise réponse|perdu|échec|score|points?)\b/i;
    for (const item of localYouthItems) {
      if (item.kind !== 'activity') continue;
      for (const choice of item.choices ?? []) {
        expect(choice.feedback['6-10']).not.toMatch(judging);
        expect(choice.feedback['11-14']).not.toMatch(judging);
      }
    }
  });

  it('donne des consignes de sécurité à toute activité qui se fait en vrai', () => {
    for (const item of localYouthItems) {
      if (item.kind === 'activity' && item.materials.length > 0) {
        expect(item.safety?.length).toBeGreaterThan(0);
      }
    }
  });

  it('ouvre chaque porte d’entrée sur au moins une carte', () => {
    for (const door of EXPLORE_DOORS) {
      expect(byDoor(localYouthItems, door.id).length).toBeGreaterThan(0);
    }
    expect(byDoor(localYouthItems, null)).toHaveLength(localYouthItems.length);
  });

  it('illustre chaque métier par une image libre, décrite et créditée', () => {
    for (const c of localYouthItems.filter((i) => i.kind === 'career'))
      expect(c.image).toBeDefined();
    for (const item of localYouthItems) {
      if (!item.image) continue;
      expect(['Domaine public', 'CC0', 'CC BY 2.0']).toContain(item.image.license);
      expect(item.image.alt.length).toBeGreaterThan(40);
      expect(item.image.sourceUrl).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
      // Une licence CC BY impose de nommer l'auteur.
      if (item.image.license.startsWith('CC BY')) expect(item.image.artist).not.toMatch(/inconnu/i);
    }
  });
});

describe('Tout est possible — validation', () => {
  const [first] = localYouthItems.filter((i): i is Career => i.kind === 'career');
  const career = first!;

  it('refuse un texte absent pour une tranche d’âge', () => {
    const broken = { ...career, daily: { '6-10': '', '11-14': 'Texte' } };
    expect(validateYouth([broken], [], culture).map((i) => i.error)).toContain(
      'texte manquant pour une tranche d’âge',
    );
  });

  it('refuse un lien culturel qui ne cite pas une source de l’élément', () => {
    const broken = {
      ...career,
      cultureLinks: [{ ...career.cultureLinks[0]!, sourceId: 'source-absente' }],
    };
    expect(validateYouth([broken], [], culture).map((i) => i.error)).toContain(
      'lien culturel sans source de l’élément',
    );
  });

  it('écarte un élément invalide sans casser les collections', () => {
    const broken = { ...career, sources: [] };
    const others = localYouthItems.filter((i) => i.id !== career.id);
    const { items, lives } = prepareYouth([broken, ...others], youthLives, culture);
    expect(items.find((i) => i.id === career.id)).toBeUndefined();
    for (const life of lives) expect(life.itemIds).not.toContain(career.id);
  });

  it('lit la version choisie, et la version 11–14 ans sans choix', () => {
    const text = { '6-10': 'court', '11-14': 'long' };
    expect(read(text, '6-10')).toBe('court');
    expect(read(text, null)).toBe('long');
  });
});
