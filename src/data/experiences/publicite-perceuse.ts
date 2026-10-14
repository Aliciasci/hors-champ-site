import type { Experience } from '@/types';

/**
 * EXEMPLE DE DÉVELOPPEMENT — publicité fictive, décrite en texte, rédigée pour tester l'interface.
 * Aucune marque ni campagne réelle n'est visée. Aucune source.
 */
export const publicitePerceuse: Experience = {
  id: 'publicite-perceuse',
  slug: 'publicite-perceuse',
  title: 'Ce que vend vraiment l’affiche',
  shortDescription: 'Une publicité fictive pour une perceuse. Qu’est-ce qui est mis en avant ?',
  introduction:
    'On décrit ici une affiche imaginaire, construite pour l’exercice. L’objectif : apprendre à lire une composition, pas seulement un slogan.',
  categoryId: 'medias-publicite',
  estimatedMinutes: 6,
  difficulty: 'intermediaire',
  coverImage: null,
  contentType: 'image-analysis',
  scenario: {
    title: 'Une affiche en abribus',
    blocks: [
      {
        kind: 'visual',
        title: 'Description de l’affiche (fictive)',
        description:
          'Au centre, une femme en maillot de bain, photographiée de la tête aux genoux, regarde l’objectif. La perceuse, tenue du bout des doigts, occupe un coin de l’image. En bas, le slogan : « Puissante. Et pas compliquée. » Le nom de la marque est écrit en petit.',
      },
      {
        kind: 'paragraph',
        text: 'La même marque diffuse une autre affiche pour le même produit : un homme en tenue de chantier, la perceuse en action, gros plan sur l’outil.',
      },
    ],
  },
  question: {
    prompt: 'Quels éléments de l’affiche méritent d’être questionnés ?',
    mode: 'multiple',
    helper: 'Plusieurs réponses possibles.',
  },
  answerOptions: [
    {
      id: 'corps-central',
      label: 'Le corps occupe le centre, alors que le produit est relégué dans un coin.',
      assessment: 'solid',
      feedback:
        'Oui : la composition dit ce qui est censé attirer le regard. Ici, ce n’est pas l’outil.',
    },
    {
      id: 'role-different',
      label: 'La femme pose avec l’outil, l’homme l’utilise.',
      assessment: 'solid',
      feedback:
        'Oui : la comparaison entre les deux affiches est éclairante. L’une montre une compétence, l’autre un décor.',
    },
    {
      id: 'slogan-ambigu',
      label: 'Le slogan peut se lire comme parlant de l’outil… ou de la femme.',
      assessment: 'open',
      feedback:
        'C’est une lecture défendable. Le double sens est fréquent en publicité ; savoir s’il est voulu demande d’autres éléments, mais la mise en page le rend possible.',
    },
    {
      id: 'presence-femme',
      label: 'Le simple fait qu’une femme apparaisse dans une publicité de bricolage.',
      assessment: 'weak',
      feedback:
        'Non : montrer une femme qui bricole n’a rien de problématique en soi. C’est le rôle qu’on lui donne dans l’image qui pose question.',
    },
  ],
  explanation: {
    summary:
      'Décrypter une image, c’est regarder ce qu’elle met au centre, ce qu’elle laisse à la marge, et le rôle donné à chaque personne. La comparaison avec une autre image du même annonceur aide à objectiver.',
    keyPoints: [
      'Composition : qu’est-ce qui occupe le centre et le plus d’espace ?',
      'Action : qui agit, qui est regardé ?',
      'Texte : le slogan renforce-t-il ou détourne-t-il le sens de l’image ?',
    ],
  },
  nuance: {
    canConclude: [
      'Les deux affiches attribuent des rôles différents aux personnes représentées.',
      'Dans la première, le produit n’est pas l’élément principal de la composition.',
    ],
    cannotConclude: [
      'L’intention précise des concepteurs, sans autres informations.',
      'L’effet réel de cette affiche sur les personnes qui la voient.',
    ],
    counterArguments: [
      {
        claim: '« C’est juste pour attirer l’attention, tout le monde le fait. »',
        response:
          'Que la pratique soit répandue n’en fait pas une pratique neutre. La question n’est pas de savoir si cela attire l’œil, mais ce que cela montre.',
      },
    ],
  },
  sources: [],
  relatedExperienceIds: ['test-de-bechdel', 'rayon-jouets'],
  editorialStatus: 'dev-example',
  reviewedAt: null,
};
