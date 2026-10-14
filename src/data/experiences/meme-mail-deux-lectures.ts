import type { Experience } from '@/types';

/**
 * EXEMPLE DE DÉVELOPPEMENT — situation fictive rédigée pour tester l'interface.
 * Aucune source : ne pas présenter comme une analyse documentée.
 */
export const memeMailDeuxLectures: Experience = {
  id: 'meme-mail-deux-lectures',
  slug: 'meme-mail-deux-lectures',
  title: 'Le même mail, deux lectures',
  shortDescription: 'Deux messages presque identiques, deux réputations très différentes.',
  introduction:
    'Dans une équipe fictive, deux responsables envoient un message de recadrage très proche. Les réactions, elles, ne se ressemblent pas. Que peut-on vraiment en tirer ?',
  categoryId: 'doubles-standards',
  estimatedMinutes: 4,
  difficulty: 'decouverte',
  coverImage: null,
  contentType: 'double-standard',
  scenario: {
    title: 'Un lundi, deux messages',
    blocks: [
      {
        kind: 'paragraph',
        text: 'Thomas et Camille dirigent chacun une équipe. Le même lundi, ils envoient un message pour signaler un retard sur un projet.',
      },
      {
        kind: 'comparison',
        left: {
          label: 'Le message de Thomas',
          text: '« Le livrable est en retard. J’attends un plan de rattrapage d’ici mercredi. »',
        },
        right: {
          label: 'Le message de Camille',
          text: '« Le livrable est en retard. J’attends un plan de rattrapage d’ici mercredi. »',
        },
      },
      {
        kind: 'dialogue',
        speaker: 'Un collègue, à propos de Thomas',
        text: 'Il est direct, au moins on sait où on va.',
      },
      {
        kind: 'dialogue',
        speaker: 'Une collègue, à propos de Camille',
        text: 'Elle aurait pu y mettre les formes. Elle est vraiment cassante.',
      },
    ],
  },
  question: {
    prompt: 'Que peut-on raisonnablement dire de ce décalage ?',
    mode: 'single',
    helper: 'Choisissez la lecture qui vous semble la mieux appuyée par les éléments présentés.',
  },
  answerOptions: [
    {
      id: 'indice-double-standard',
      label: 'C’est un indice de double standard, à confirmer en observant d’autres situations.',
      assessment: 'solid',
      feedback:
        'Les messages sont identiques, les jugements opposés : c’est exactement la forme d’un double standard. Un seul épisode reste toutefois un indice, pas une preuve d’un fonctionnement général.',
    },
    {
      id: 'equipe-sexiste',
      label: 'Cela prouve que toute l’équipe est sexiste.',
      assessment: 'partial',
      feedback:
        'Le décalage est réel et mérite d’être nommé. Mais deux commentaires ne permettent pas de qualifier toute une équipe : la conclusion dépasse ce que montrent les éléments.',
    },
    {
      id: 'contexte-different',
      label: 'D’autres facteurs ont pu jouer : l’historique de chacun, la relation avec l’équipe…',
      assessment: 'open',
      feedback:
        'C’est une question légitime. Le contexte compte. Mais ici les messages sont mot pour mot les mêmes : si l’explication change selon la personne, il vaut la peine de se demander pourquoi.',
    },
    {
      id: 'aucun-lien',
      label: 'Le genre n’a rien à voir : c’est une question de personnalité.',
      assessment: 'weak',
      feedback:
        'Écarter d’emblée cette piste revient à ne pas examiner la seule différence visible entre les deux situations. La personnalité peut jouer, mais elle ne s’exprime pas dans des messages identiques.',
    },
  ],
  explanation: {
    summary:
      'Un double standard apparaît quand une même action reçoit des jugements différents selon la personne qui l’accomplit. La comparaison terme à terme est l’outil le plus simple pour le rendre visible.',
    keyPoints: [
      'Isoler ce qui est identique (le message) et ce qui change (la personne, le jugement).',
      'Remarquer le vocabulaire : « direct » valorise, « cassante » disqualifie, pour un même comportement.',
      'Un cas isolé ouvre une question ; c’est la répétition des situations qui permet de parler d’un schéma.',
    ],
  },
  nuance: {
    canConclude: [
      'Dans cette situation, un même message a été jugé de manière opposée.',
      'Les mots choisis pour décrire Thomas et Camille ne sont pas neutres.',
    ],
    cannotConclude: [
      'Que les personnes qui ont commenté agissent consciemment par sexisme.',
      'Que ce schéma se répète systématiquement dans l’équipe, sans autres observations.',
    ],
    counterArguments: [
      {
        claim: '« Le ton à l’oral n’était peut-être pas le même. »',
        response:
          'C’est possible et vérifiable. Mais l’exercice porte sur un message écrit identique : si le jugement change quand même, l’hypothèse du ton ne suffit pas à l’expliquer.',
      },
    ],
  },
  sources: [],
  relatedExperienceIds: ['idee-reprise-en-reunion', 'appel-a-la-nature'],
  editorialStatus: 'dev-example',
  reviewedAt: null,
};
