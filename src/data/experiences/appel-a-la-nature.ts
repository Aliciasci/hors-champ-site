import type { Experience } from '@/types';

/**
 * EXEMPLE DE DÉVELOPPEMENT — argument fictif rédigé pour tester l'interface.
 * L'analyse porte sur la structure logique, sans affirmation empirique. Aucune source.
 */
export const appelALaNature: Experience = {
  id: 'appel-a-la-nature',
  slug: 'appel-a-la-nature',
  title: '« C’est dans leur nature »',
  shortDescription: 'Passer de « c’est naturel » à « c’est normal » : où est le saut ?',
  introduction:
    'On n’examine pas ici si la prémisse est vraie ou fausse, mais si la conclusion en découle. C’est souvent là que le raisonnement déraille.',
  categoryId: 'raisonnement',
  estimatedMinutes: 5,
  difficulty: 'approfondi',
  coverImage: null,
  contentType: 'argument-analysis',
  scenario: {
    title: 'Un argument entendu au dîner',
    blocks: [
      {
        kind: 'paragraph',
        text: 'La conversation porte sur la répartition des congés parentaux. Un convive avance l’argument suivant :',
      },
      {
        kind: 'argument',
        premises: [
          'Les femmes seraient naturellement plus douées pour s’occuper des jeunes enfants.',
        ],
        conclusion: 'Donc il est normal que ce soient elles qui prennent l’essentiel des congés.',
      },
    ],
  },
  question: {
    prompt: 'Où se situe la principale faiblesse de ce raisonnement ?',
    mode: 'single',
  },
  answerOptions: [
    {
      id: 'saut-normatif',
      label: 'Il passe de « c’est naturel » à « c’est souhaitable » sans le justifier.',
      assessment: 'solid',
      feedback:
        'Exactement. Même si la prémisse était vraie, elle décrirait une tendance ; elle ne dirait pas comment une société doit organiser les congés. Ce saut s’appelle l’appel à la nature.',
    },
    {
      id: 'premisse-fausse',
      label: 'La prémisse est fausse, donc tout l’argument tombe.',
      assessment: 'partial',
      feedback:
        'La prémisse est discutable et mérite d’être examinée avec des sources. Mais il est plus robuste de montrer que la conclusion ne suit pas, même si on l’acceptait.',
    },
    {
      id: 'qui-parle',
      label: 'Il faut d’abord savoir qui parle et pourquoi il défend cette idée.',
      assessment: 'weak',
      feedback:
        'Les motivations de la personne peuvent intéresser, mais elles ne disent rien de la validité de l’argument. Juger l’argument par la personne est un raisonnement ad hominem.',
    },
    {
      id: 'aucun-probleme',
      label: 'Il n’y a pas de problème : ce qui est naturel est forcément bon.',
      assessment: 'weak',
      feedback:
        'C’est précisément le présupposé caché de l’argument. Beaucoup de choses « naturelles » ne sont pas pour autant souhaitables, et inversement.',
    },
  ],
  explanation: {
    summary:
      'L’appel à la nature consiste à conclure qu’une chose est bonne, normale ou légitime parce qu’elle serait naturelle. Il mélange deux plans : ce qui est, et ce qui doit être.',
    keyPoints: [
      'Repérer la prémisse descriptive (« les femmes seraient… »).',
      'Repérer la conclusion normative (« il est normal que… »).',
      'Chercher la prémisse manquante (« ce qui est naturel est souhaitable ») et l’examiner.',
    ],
  },
  nuance: {
    canConclude: ['Tel qu’il est formulé, l’argument ne justifie pas sa conclusion.'],
    cannotConclude: [
      'Que la prémisse soit vraie ou fausse : cela demande des sources scientifiques, non fournies ici.',
      'Que la personne qui l’avance soit de mauvaise foi.',
    ],
    counterArguments: [
      {
        claim: '« Mais si c’est vrai, c’est quand même un argument ! »',
        response:
          'Une tendance peut éclairer un choix, mais elle ne le dicte pas. Une politique de congés repose aussi sur des choix de société : égalité, liberté de chacun, intérêt de l’enfant.',
      },
    ],
  },
  sources: [],
  relatedExperienceIds: ['meme-mail-deux-lectures', 'rayon-jouets'],
  editorialStatus: 'dev-example',
  reviewedAt: null,
};
