import type { Experience } from '@/types';

/**
 * EXEMPLE DE DÉVELOPPEMENT — situation fictive rédigée pour tester l'interface.
 * Aucune source : ne pas présenter comme une analyse documentée.
 */
export const ideeRepriseEnReunion: Experience = {
  id: 'idee-reprise-en-reunion',
  slug: 'idee-reprise-en-reunion',
  title: 'L’idée qui change de bouche',
  shortDescription: 'Une proposition passe inaperçue… jusqu’à ce qu’un autre la répète.',
  introduction:
    'Une réunion d’équipe ordinaire. Une idée est formulée deux fois, par deux personnes différentes. Quels éléments faut-il observer avant de conclure ?',
  categoryId: 'sexisme-quotidien',
  estimatedMinutes: 5,
  difficulty: 'intermediaire',
  coverImage: null,
  contentType: 'scenario',
  scenario: {
    title: 'Mardi, 10 h, salle B',
    blocks: [
      {
        kind: 'paragraph',
        text: 'L’équipe cherche comment réduire les délais de validation. Inès propose de regrouper les relectures en une seule session hebdomadaire. Personne ne réagit ; la discussion passe à autre chose.',
      },
      {
        kind: 'paragraph',
        text: 'Vingt minutes plus tard, Marc propose la même organisation, presque dans les mêmes termes.',
      },
      {
        kind: 'dialogue',
        speaker: 'La responsable',
        text: 'Excellente idée, Marc. On part là-dessus.',
      },
      {
        kind: 'paragraph',
        text: 'Le compte rendu envoyé le soir attribue la proposition à Marc.',
      },
    ],
  },
  question: {
    prompt: 'Quels éléments sont pertinents pour analyser cette situation ?',
    mode: 'multiple',
    helper: 'Plusieurs réponses possibles. Sélectionnez tout ce qui vous semble utile.',
  },
  answerOptions: [
    {
      id: 'attribution',
      label: 'À qui l’idée est finalement attribuée, à l’oral comme dans le compte rendu.',
      assessment: 'solid',
      feedback:
        'Oui : l’attribution est le cœur de la situation. Elle a des effets concrets, sur la reconnaissance comme sur l’évaluation du travail.',
    },
    {
      id: 'repetition',
      label: 'Si ce type de scène se répète, et avec qui.',
      assessment: 'solid',
      feedback:
        'Oui : une scène isolée peut avoir mille causes. C’est la répétition, et le fait qu’elle touche toujours les mêmes personnes, qui permet de parler d’un schéma.',
    },
    {
      id: 'intention-marc',
      label: 'Si Marc a repris l’idée volontairement.',
      assessment: 'open',
      feedback:
        'La question est compréhensible, mais l’intention est difficile à établir de l’extérieur. Marc n’a peut-être pas entendu Inès. L’effet, lui, reste le même : sa parole a été reconnue, pas celle d’Inès.',
    },
    {
      id: 'ines-plus-fort',
      label: 'Qu’Inès aurait dû parler plus fort ou insister.',
      assessment: 'weak',
      feedback:
        'Cette lecture fait porter la responsabilité sur la personne qui n’a pas été écoutée. Elle ne dit rien de la façon dont le groupe a accueilli la même idée, formulée deux fois.',
    },
  ],
  explanation: {
    summary:
      'Ce qui compte ici, c’est moins l’intention de chacun que le circuit de la reconnaissance : qui parle, qui est entendu, à qui l’on attribue le résultat.',
    keyPoints: [
      'Distinguer l’intention (difficile à connaître) de l’effet (observable).',
      'Observer les traces écrites : un compte rendu fige l’attribution.',
      'Chercher la récurrence avant de généraliser.',
    ],
  },
  nuance: {
    canConclude: [
      'Dans cette réunion, la même idée n’a pas reçu le même accueil selon la personne qui l’a formulée.',
      'Le compte rendu ne reflète pas l’origine réelle de la proposition.',
    ],
    cannotConclude: [
      'Que Marc ait agi de mauvaise foi.',
      'Que le genre soit la seule explication à partir de cette seule scène.',
    ],
    counterArguments: [
      {
        claim: '« Marc l’a peut-être mieux formulée. »',
        response:
          'La scène indique des termes presque identiques. Et si la formulation compte, il reste juste de mentionner qui a proposé l’idée en premier.',
      },
    ],
  },
  sources: [],
  relatedExperienceIds: ['meme-mail-deux-lectures', 'rayon-jouets'],
  editorialStatus: 'dev-example',
  reviewedAt: null,
};
