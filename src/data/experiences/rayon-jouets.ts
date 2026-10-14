import type { Experience } from '@/types';

/**
 * EXEMPLE DE DÉVELOPPEMENT — situation fictive rédigée pour tester l'interface.
 * Plusieurs réponses sont des lectures défendables. Aucune source.
 */
export const rayonJouets: Experience = {
  id: 'rayon-jouets',
  slug: 'rayon-jouets',
  title: '« Ce ne sont que des jouets »',
  shortDescription: 'Un rayon séparé en deux, une remarque, plusieurs lectures possibles.',
  introduction:
    'Certaines situations n’ont pas une seule bonne réponse. L’enjeu est de repérer ce que chaque lecture prend en compte… et ce qu’elle laisse de côté.',
  categoryId: 'stereotypes',
  estimatedMinutes: 4,
  difficulty: 'decouverte',
  coverImage: null,
  contentType: 'scenario',
  scenario: {
    title: 'Un samedi, au magasin',
    blocks: [
      {
        kind: 'paragraph',
        text: 'Le rayon est séparé en deux allées. Panneau de gauche : « Garçons » — véhicules, construction, sciences. Panneau de droite : « Filles » — poupées, cuisine, maquillage.',
      },
      {
        kind: 'paragraph',
        text: 'Un enfant hésite devant une dînette, côté « Filles ». L’adulte qui l’accompagne remarque la scène.',
      },
      {
        kind: 'dialogue',
        speaker: 'Une autre cliente',
        text: 'Ce ne sont que des jouets, il ne faut pas tout analyser.',
      },
    ],
  },
  question: {
    prompt: 'Comment lisez-vous cette remarque ?',
    mode: 'single',
    helper: 'Plusieurs lectures sont défendables : choisissez celle qui vous parle le plus.',
  },
  answerOptions: [
    {
      id: 'signal-normes',
      label: 'Le jouet compte moins que le panneau : il indique à qui le jeu est « destiné ».',
      assessment: 'open',
      feedback:
        'Lecture défendable : le classement transmet une norme, indépendamment du jouet lui-même. L’enfant reçoit un message sur ce qui est attendu de lui.',
    },
    {
      id: 'liberte-choix',
      label: 'L’important, c’est que l’adulte laisse l’enfant choisir, quel que soit le rayon.',
      assessment: 'open',
      feedback:
        'Lecture défendable : l’attitude des adultes pèse beaucoup. Elle laisse toutefois de côté le rôle de l’organisation du magasin, qui oriente avant même toute discussion.',
    },
    {
      id: 'remarque-juste',
      label: 'La cliente a en partie raison : un jouet seul ne décide pas d’une vie.',
      assessment: 'partial',
      feedback:
        'C’est vrai pris isolément. Mais la question n’est pas un jouet, c’est la répétition d’un même message, du rayon aux vêtements en passant par les livres.',
    },
    {
      id: 'rien-a-voir',
      label: 'Les enfants choisiraient de toute façon les mêmes jouets.',
      assessment: 'weak',
      feedback:
        'Affirmer cela suppose de savoir ce qu’ils choisiraient sans le classement — précisément ce que la situation ne permet pas d’observer.',
    },
  ],
  explanation: {
    summary:
      'Un stéréotype fonctionne rarement par une seule injonction ; il s’installe par répétition. Le classement d’un rayon est un message discret, qui s’ajoute à d’autres.',
    keyPoints: [
      'Distinguer l’objet (le jouet) de son cadrage (le panneau, la couleur, l’emplacement).',
      'Plusieurs lectures peuvent être vraies en même temps : le rôle des adultes et celui du magasin.',
      'Se méfier des affirmations sur ce que les enfants « choisiraient naturellement ».',
    ],
  },
  nuance: {
    canConclude: [
      'Le magasin associe explicitement certains jeux à un genre.',
      'L’enfant hésite devant un jouet présenté comme destiné à l’autre genre.',
    ],
    cannotConclude: [
      'L’effet de ce rayon sur cet enfant en particulier.',
      'Ce que l’enfant aurait choisi sans le panneau.',
    ],
    counterArguments: [
      {
        claim: '« Ça aide les parents à trouver un cadeau rapidement. »',
        response:
          'Un classement par âge ou par type de jeu remplirait la même fonction pratique, sans associer les jeux à un genre.',
      },
    ],
  },
  sources: [],
  relatedExperienceIds: ['appel-a-la-nature', 'publicite-perceuse'],
  editorialStatus: 'dev-example',
  reviewedAt: null,
};
