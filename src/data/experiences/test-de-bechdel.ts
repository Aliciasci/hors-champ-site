import type { Experience } from '@/types';

/**
 * EXEMPLE DE DÉVELOPPEMENT — texte rédigé pour tester l'interface, non relu par l'équipe éditoriale.
 * Les faits sur l'origine et les critères du test ont été vérifiés sur la source listée
 * (consultée le 2026-10-12). Le reste du texte doit être relu avant passage en `verified`.
 */
export const testDeBechdel: Experience = {
  id: 'test-de-bechdel',
  slug: 'test-de-bechdel',
  title: 'Ce que dit (et ne dit pas) le test de Bechdel',
  shortDescription: 'Trois critères nés d’une bande dessinée de 1985. Que mesurent-ils vraiment ?',
  introduction:
    'Le test de Bechdel est souvent cité pour évaluer la place des femmes dans les films. Mais un outil n’est utile que si l’on sait ce qu’il mesure.',
  categoryId: 'histoire-culture',
  estimatedMinutes: 5,
  difficulty: 'decouverte',
  coverImage: null,
  contentType: 'historical-context',
  scenario: {
    title: 'D’une case de BD à un outil d’analyse',
    blocks: [
      {
        kind: 'context',
        title: 'L’origine',
        text: 'Le nom du test renvoie à une bande dessinée d’Alison Bechdel, « La Règle » (« The Rule »), parue en 1985 dans l’album « Lesbiennes à suivre ».',
      },
      {
        kind: 'context',
        title: 'Les critères',
        text: '1. Au moins deux femmes nommées. 2. Elles parlent ensemble. 3. De quelque chose qui est sans rapport avec un homme. Le critère « nommées » a été ajouté par d’autres par la suite.',
      },
      {
        kind: 'paragraph',
        text: 'Un film fictif, « Horizon », passe les trois critères grâce à une scène de trente secondes entre deux collègues.',
      },
    ],
  },
  question: {
    prompt: 'Que peut-on conclure du fait que « Horizon » passe le test ?',
    mode: 'single',
  },
  answerOptions: [
    {
      id: 'seuil-minimal',
      label:
        'Que le film franchit un seuil minimal de présence féminine dans les dialogues — rien de plus.',
      assessment: 'solid',
      feedback:
        'C’est la lecture la plus juste. Le test mesure une présence minimale, pas la qualité des rôles ni la façon dont les personnages sont représentés.',
    },
    {
      id: 'film-feministe',
      label: 'Que le film est féministe.',
      assessment: 'weak',
      feedback:
        'Le test ne permet pas de le dire, et ce n’était pas son objet. Un film peut passer les trois critères tout en proposant des représentations très stéréotypées.',
    },
    {
      id: 'test-inutile',
      label: 'Rien du tout : le test ne sert à rien.',
      assessment: 'partial',
      feedback:
        'Pour juger un film isolé, il est limité. Appliqué à un grand nombre d’œuvres, il permet en revanche de faire apparaître une tendance d’ensemble.',
    },
  ],
  explanation: {
    summary:
      'Le test de Bechdel est un indicateur grossier, utile pour poser une question sur un ensemble d’œuvres, pas pour juger une œuvre isolée.',
    keyPoints: [
      'Un indicateur simple est facile à appliquer, mais il ne mesure qu’une chose.',
      'Passer le test ne dit rien de la diversité des personnages féminins ni de leur rôle dans l’histoire.',
      'Le test est d’abord né comme une remarque dans une fiction, avant d’être repris comme outil.',
    ],
  },
  nuance: {
    canConclude: [
      '« Horizon » comporte au moins une scène où deux femmes nommées parlent d’autre chose que d’un homme.',
    ],
    cannotConclude: [
      'Que le film soit féministe, ou qu’il ne le soit pas.',
      'Comment les personnages féminins sont représentés dans le reste du film.',
    ],
    counterArguments: [
      {
        claim: '« Si un film peut le passer en trente secondes, le test est absurde. »',
        response:
          'Cela montre surtout que le seuil est bas — ce qui rend d’autant plus parlant le fait que de nombreuses œuvres ne l’atteignent pas.',
      },
    ],
  },
  sources: [
    {
      id: 'wikipedia-test-de-bechdel',
      title: 'Test de Bechdel',
      publisher: 'Wikipédia',
      url: 'https://fr.wikipedia.org/wiki/Test_de_Bechdel',
      sourceType: 'encyclopedia',
      accessedAt: '2026-10-12',
      relevantExcerpt:
        'Si le test de Bechdel-Wallace se veut un indicateur du sexisme de certains films, il ne suffit pas à déterminer si un film est féministe.',
      note: 'Origine du test, énoncé des critères et principales limites. Article collaboratif : à compléter par les sources primaires qu’il cite.',
    },
  ],
  relatedExperienceIds: ['publicite-perceuse', 'meme-mail-deux-lectures'],
  editorialStatus: 'dev-example',
  reviewedAt: null,
};
