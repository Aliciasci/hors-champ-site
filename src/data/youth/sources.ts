import type { Source } from '@/types';

import { wikipedia } from '../culture/sources';

/**
 * Sources du parcours « Tout est possible ». Extraits cités mot pour mot (Wikipédia, consultés le
 * 2026-10-12, vérifiés automatiquement contre le texte des articles).
 */
export const Y = {
  // Mary Anning — paléontologue
  anningIntro: wikipedia(
    'Mary Anning',
    'Mary_Anning',
    "Mary Anning, née le 21 mai 1799  et morte le 9 mars 1847à Lyme Regis, est une paléontologue autodidacte britannique. Elle commence par récolter des fossiles pour les revendre à des collectionneurs et des musées et devient, grâce à la découverte du premier plésiosaure et d'ichtyosaures, une figure incontournable dans l’histoire de la paléontologie des vertébrés.",
  ),
  anningPere: wikipedia(
    'Mary Anning',
    'Mary_Anning',
    'Son père arrondit ses fins de mois en vendant des fossiles aux touristes et initie ses enfants, Mary et Joseph, à cette activité.',
    'pere',
  ),
  anningPhilpot: wikipedia(
    'Mary Anning',
    'Mary_Anning',
    "Elle devient amie avec Elizabeth Philpot, malgré un écart d'âge de 20 ans et leurs différences sociales, qui l'encourage à lire, s'instruire en géologie et sur les fossiles.",
    'philpot',
  ),
  anningEbeniste: wikipedia(
    'Mary Anning',
    'Mary_Anning',
    'Son père ébéniste, Richard Anning, est originaire de Colyton et sa mère Mary Moore, dite Molly, vient de Blandford Forum.',
    'ebeniste',
  ),
  anningEcole: wikipedia(
    'Mary Anning',
    'Mary_Anning',
    "La famille, endettée, vit alors de la charité et il semblerait que Mary Anning arrête l'école cette année-là.",
    'ecole',
  ),
  anningIchtyo: wikipedia(
    'Mary Anning',
    'Mary_Anning',
    'Le reste du squelette est ensuite découvert par Mary Anning, accompagnée de son frère.',
    'ichtyosaure',
  ),
  anningTreize: wikipedia(
    'Mary Anning',
    'Mary_Anning',
    'Mary Anning est alors âgée de treize ans.',
    'treize-ans',
  ),
  anningPlesio: wikipedia(
    'Mary Anning',
    'Mary_Anning',
    "Sa découverte majeure est une première : le squelette d'un plésiosaure en 1821.",
    'plesiosaure',
  ),
  anningSociete: wikipedia(
    'Mary Anning',
    'Mary_Anning',
    "Le président de la Société géologique de Londres, dont elle n'a jamais pu être membre car l'instance était interdite aux femmes (même invitées), Henry De la Beche, prononce une eulogie en son honneur lors de son discours annuel, faisant de Mary Anning la première femme à recevoir une telle faveur.",
    'societe',
  ),
  anningMarge: wikipedia(
    'Mary Anning',
    'Mary_Anning',
    "Elle correspond avec quelques membres de la communauté scientifique de l'époque majoritairement composée d'hommes anglicans mais sa condition de femme issue de la classe ouvrière la laisse en marge de cette communauté, avant d'être finalement reconnue par ses pairs.",
    'marge',
  ),
  paleoDefinition: wikipedia(
    'Paléontologie',
    'Paléontologie',
    'La paléontologie peut être définie comme la science des fossiles.',
  ),
  paleoActualisme: wikipedia(
    'Paléontologie',
    'Paléontologie',
    "Les paléontologues utilisent souvent l'observation de caractères actuels pour comprendre les caractères du passé : c'est le principe de l'actualisme.",
    'actualisme',
  ),
  paleoAmateurs: wikipedia(
    'Paléontologie',
    'Paléontologie',
    "Plus récemment, les paléontologues ont souvent été popularisés comme « chasseurs de fossiles » : une pratique d'amateurs qui est parfois pratiquée illégalement, éventuellement au détriment des archives fossiles et données scientifiques (déterrage sauvage, dégradation du contexte fossilisé, non-déclaration des « trouvailles », vol sur sites de fouille, trafic, etc), et qui doit beaucoup à la médiatisation des expéditions de Cope et Marsh aux États-Unis.",
    'amateurs',
  ),

  // Katia Krafft — volcanologue
  krafftIntro: wikipedia(
    'Katia et Maurice Krafft',
    'Katia_et_Maurice_Krafft',
    'Catherine Marie Joséphine Conrad, dite Katia Krafft, née le 17 avril 1942 à Soultz-Haut-Rhin (Haut-Rhin, Alsace), et son mari, Maurice Paul Krafft, né le 25 mars 1946 à Mulhouse (Haut-Rhin), sont un couple de volcanologues français et cinéastes, qui ont œuvré pour la diffusion des connaissances et risques volcaniques.',
  ),
  krafftEtudes: wikipedia(
    'Katia et Maurice Krafft',
    'Katia_et_Maurice_Krafft',
    "Elle devient institutrice, puis professeure de mathématiques, après avoir passé le concours de l'École normale en 1957 et suivi des études de physique et de géochimie à l'université de Strasbourg.",
    'etudes',
  ),
  krafftEnfance: wikipedia(
    'Katia et Maurice Krafft',
    'Katia_et_Maurice_Krafft',
    "Dès son enfance, Katia Krafft montre un caractère affirmé jusqu'à parfois être turbulente.",
    'enfance',
  ),
  krafftStromboli: wikipedia(
    'Katia et Maurice Krafft',
    'Katia_et_Maurice_Krafft',
    "Avec peu d'argent, les époux Krafft économisent pour se payer un voyage à Stromboli et photographient ses éruptions volcaniques quasi-continues.",
    'stromboli',
  ),
  krafftPhoto: wikipedia(
    'Katia et Maurice Krafft',
    'Katia_et_Maurice_Krafft',
    "Durant 25 ans, ils parcourent ensemble le monde, lui privilégiant la caméra, elle l'appareil photo ; Katia et Maurice Krafft sont surnommés les volcano devils (« les fous des volcans ») par les scientifiques américains, traduisant ainsi un sentiment d'admiration et de reconnaissance devant l'enthousiasme et la passion du métier exprimés par le couple de volcanologues français.",
    'photo',
  ),
  krafftChimiste: wikipedia(
    'Katia et Maurice Krafft',
    'Katia_et_Maurice_Krafft',
    'Lui, en tant que géologue, et elle, en tant que chimiste et physicienne, privilégient aux articles académiques les images, les échantillons et les descriptions fines des phénomènes éruptifs, apportant des éléments à la compréhension de ceux-ci.',
    'chimiste',
  ),
  krafftVies: wikipedia(
    'Katia et Maurice Krafft',
    'Katia_et_Maurice_Krafft',
    "Au-delà de la vulgarisation scientifique des volcans en mettant leur propre vie en danger (conditions extrêmes, risques d'éruption), leurs productions cinématographiques et missions de sensibilisation ont permis de sauver des milliers de vies à travers le monde.",
    'vies',
  ),
  krafftUnzen: wikipedia(
    'Katia et Maurice Krafft',
    'Katia_et_Maurice_Krafft',
    'Ils meurent dans une coulée pyroclastique sur le mont Unzen, au Japon, le 3 juin 1991.',
    'unzen',
  ),
  volcanologueDefinition: wikipedia(
    'Volcanologue',
    'Volcanologue',
    "Un volcanologue (ou vulcanologue, terme majoritairement utilisé jusqu'au milieu du XXe siècle) est un spécialiste de l'étude des volcans. Il peut être géologue, géophysicien, géochimiste, hydrogéologue, sismologue, magnéticien, etc.",
  ),
  volcanologuePrevision: wikipedia(
    'Volcanologue',
    'Volcanologue',
    "Ces phénomènes pouvant être dangereux pour les populations, le métier implique souvent une forme de prévision volcanologique et nécessite parfois l'entretien de relations étroites avec les autorités administratives chargées de la prévention et d'éventuelles évacuations.",
    'prevision',
  ),
  volcanologueEtudes: wikipedia(
    'Volcanologue',
    'Volcanologue',
    'En France, on devient volcanologue après de longues études universitaires (5 années de master suivies de 3 années de doctorat).',
    'etudes',
  ),
  volcanoSismo: wikipedia(
    'Volcanologie',
    'Volcanologie',
    'Les sismographes permettent aux volcanologues de détecter les microséismes provoqués par la mise sous pression de la chambre magmatique.',
    'sismographes',
  ),

  // Sylvia Earle — océanographe
  earleIntro: wikipedia(
    'Sylvia Earle',
    'Sylvia_Earle',
    "Sylvia Earle, née le 30 août 1935 à Gibbstown (New Jersey), est une océanographe, exploratrice, autrice et conférencière américaine. Depuis 1998, elle est « exploratrice à demeure » pour le National Geographic. Elle est aussi la première femme à occuper un poste de direction scientifique au sein de l'Agence américaine d'observation océanique et atmosphérique.",
  ),
  earleParents: wikipedia(
    'Sylvia Earle',
    'Sylvia_Earle',
    'Ses parents, Alice Freas Earle and Lewis Earl, passionnés des sports de plein air, encouragent leur fille à explorer la nature dès son plus jeune âge.',
    'parents',
  ),
  earleEtudes: wikipedia(
    'Sylvia Earle',
    'Sylvia_Earle',
    "En 1956, elle obtient sa Maîtrise universitaire en sciences (master) puis son doctorat en phycologie en 1966 à l'Université Duke.",
    'etudes',
  ),
  earleClark: wikipedia(
    'Sylvia Earle',
    'Sylvia_Earle',
    "Elle y rencontre Eugenie Clark, et l'assiste dans la création d'un Herbier de référence pour le laboratoire.",
    'clark',
  ),
  earleEntreprise: wikipedia(
    'Sylvia Earle',
    'Sylvia_Earle',
    'En 1982, elle cofonde Deep Ocean Engineering avec son futur époux Graham Hawkes, ingénieur naval.',
    'entreprise',
  ),
  earleTektite: wikipedia(
    'Sylvia Earle',
    'Sylvia_Earle',
    'En 1970, elle dirige la première mission composée uniquement de femmes du projet Tektite II (en), un habitat sous-marin situé à 15 mètres de profondeur au large des îles Vierges.',
    'tektite',
  ),
  earleCoraux: wikipedia(
    'Sylvia Earle',
    'Sylvia_Earle',
    "Durant deux semaines de mission sous-marine, Sylvia Earle étudie l'effet de la pollution sur les récifs coralliens.",
    'coraux',
  ),
  earleRecord: wikipedia(
    'Sylvia Earle',
    'Sylvia_Earle',
    "En 1979, elle établit le record féminin de plongée en profondeur lors d'une descente à 381 mètres de profondeur.",
    'record',
  ),
  earleDeepRover: wikipedia(
    'Sylvia Earle',
    'Sylvia_Earle',
    "En 1985, l'équipe conçoit et construit le Deep Rover, un sous-marin de recherche capable d'opérer à 1000 mètres de profondeur.",
    'deep-rover',
  ),
  oceanoDefinition: wikipedia(
    'Océanographie',
    'Océanographie',
    "Les océanographes étudient un très grand nombre d'aspects des océans et des mers, incluant la tectonique des plaques, les grands cycles biogéochimiques, les courants océaniques ou encore les organismes et les écosystèmes marins ou encore les liens entre océans et modifications climatiques.",
  ),
  oceanoInconnu: wikipedia(
    'Océanographie',
    'Océanographie',
    "Selon une évaluation mise à jour en mai 2025 dans Science Advances : moins de 0,001 % des fonds marins profonds ont été observés visuellement, lors d'environ 44 000 plongées scientifiques en haute mer, réalisées par des navires et/ou des submersibles télécommandés ou autonomes ; soit une superficie équivalente à un dixième de la Belgique.",
    'inconnu',
  ),

  oceanoSatellite: wikipedia(
    'Océanographie',
    'Océanographie',
    'Ces progrès ont été notamment obtenus grâce aux données du satellite franco-américain TOPEX/Poséidon lancé par la fusée Ariane en août 1992.',
    'satellite',
  ),
  concepteurSeparation: wikipedia(
    'Concepteur de jeux',
    'Concepteur_de_jeux',
    "Tôt dans l'industrialisation du jeu vidéo, les concepteurs de jeux étaient les lead programmers, ou le seul programmeur du jeu.",
    'separation',
  ),

  // Françoise Barré-Sinoussi — virologue
  fbsIntro: wikipedia(
    'Françoise Barré-Sinoussi',
    'Françoise_Barré-Sinoussi',
    "Françoise Barré-Sinoussi, née le 30 juillet 1947 à Paris, est une immunologue et virologue française, spécialisée dans les rétrovirus. Elle fait sa carrière à l'Institut Pasteur, dont elle est directrice de recherche honoraire, et participe à la découverte du virus de l'immunodéficience humaine (VIH) à l'origine du sida.",
  ),
  fbsNobel: wikipedia(
    'Françoise Barré-Sinoussi',
    'Françoise_Barré-Sinoussi',
    "Cette découverte lui vaut de recevoir le 6 octobre 2008 le prix Nobel de médecine, prix partagé avec Luc Montagnier et Harald zur Hausen (ce dernier pour la découverte de l'oncogénicité de certains papillomavirus humains).",
    'nobel',
  ),
  fbsMere: wikipedia(
    'Françoise Barré-Sinoussi',
    'Françoise_Barré-Sinoussi',
    "Sa mère, bien qu'ayant fait très peu d'études, lui donne très tôt le gout du médical, discipline qui la fascinait.",
    'mere',
  ),
  fbsEtudes: wikipedia(
    'Françoise Barré-Sinoussi',
    'Françoise_Barré-Sinoussi',
    "Après l'obtention du baccalauréat en 1966, Françoise Sinoussi entreprend des études supérieures de biologie à la faculté des sciences de l'université de Paris, où elle obtient le diplôme universitaire d'études scientifiques de chimie-biologie en 1968, la maîtrise en biochimie en 1971 et le diplôme d'études approfondies en 1972.",
    'etudes',
  ),
  fbsPasteur: wikipedia(
    'Françoise Barré-Sinoussi',
    'Françoise_Barré-Sinoussi',
    "Elle rejoint en 1971 le laboratoire de Jean-Claude Chermann au sein du service d'immunochimie de l'Institut Pasteur à Garches, et obtient le doctorat d'État en 1974.",
    'pasteur',
  ),
  fbsEquipe: wikipedia(
    'Françoise Barré-Sinoussi',
    'Françoise_Barré-Sinoussi',
    "Pendant les trois semaines qui suivent, Jean-Claude Chermann et Françoise Barré-Sinoussi analysent régulièrement l'activité rétrotranscriptase (aussi nommée transcriptase inverse) du surnageant des cultures afin de déterminer l'éventuelle présence d'un rétrovirus.",
    'equipe',
  ),
  viroDefinition: wikipedia(
    'Virologie',
    'Virologie',
    "La virologie est la discipline scientifique s'attachant à l'étude, l'utilisation et la lutte contre les virus et agents infectieux assimilés (viroïde, etc).",
  ),
  viroTaille: wikipedia(
    'Virologie',
    'Virologie',
    "Les virus ont une taille variant de 30  à   450 nm environ, ce qui implique que la plupart d'entre eux ne puissent pas être observés par un microscope photonique.",
    'taille',
  ),

  // Françoise Combes — astronome
  combesIntro: wikipedia(
    'Françoise Combes',
    'Françoise_Combes',
    'Françoise Combes, née le 12 août 1952 à Montpellier, est une astrophysicienne française, titulaire de la chaire « Galaxies et cosmologie » au Collège de France et présidente de l’Académie des sciences pour 2025-2026.',
  ),
  combesTravaux: wikipedia(
    'Françoise Combes',
    'Françoise_Combes',
    "Ses travaux portent essentiellement sur la physique galactique, c'est-à-dire sur la formation, l'évolution et la composition des galaxies. Ses recherches s'appuient à la fois sur des observations astronomiques et des simulations numériques théoriques.",
    'travaux',
  ),
  combesEnfance: wikipedia(
    'Françoise Combes',
    'Françoise_Combes',
    "Elle grandit entre la Nouvelle-Calédonie, Tahiti et l'Algérie, et se passionne pour la physique.",
    'enfance',
  ),
  combesEtudes: wikipedia(
    'Françoise Combes',
    'Françoise_Combes',
    "Après deux années de classes préparatoires aux grandes écoles (CPGE) à Montpellier, elle intègre l'École normale supérieure de jeunes filles où elle obtient un diplôme d'études approfondies (DEA) de physique.",
    'etudes',
  ),
  combesAstro: wikipedia(
    'Françoise Combes',
    'Françoise_Combes',
    "Elle se passionne ensuite pour l'astronomie et obtient un doctorat d'État en astrophysique avec une thèse sur la dynamique et la structure des galaxies.",
    'astro',
  ),
  combesTelescopes: wikipedia(
    'Françoise Combes',
    'Françoise_Combes',
    'Mais grâce aux progrès technologiques, elle peut désormais piloter certains télescopes depuis son bureau ou demander des observations aux personnes sur place.',
    'telescopes',
  ),
  combesAcademie: wikipedia(
    'Françoise Combes',
    'Françoise_Combes',
    "Le 30 novembre 2004, elle est la première femme astronome à être élue à l'Académie des sciences.",
    'academie',
  ),
  astronomeDoctorat: wikipedia(
    'Astronome',
    'Astronome',
    'Les astronomes professionnels sont des personnes instruites qui ont généralement un doctorat en physique ou en astronomie et sont souvent employées comme chercheurs dans des universités.',
  ),
  astronomeObservation: wikipedia(
    'Astronome',
    'Astronome',
    "Les astronomes modernes passent un temps relativement court à l'observation — généralement quelques semaines par an —, et le temps restant est employé à l'analyse et à la réduction des données.",
    'observation',
  ),
  astronomeAmateurs: wikipedia(
    'Astronome',
    'Astronome',
    "Plus que le nombre d'astronomes professionnels dans le monde, existe une énorme communauté d'astronomes amateurs répartis dans des clubs dans la plupart des villes.",
    'amateurs',
  ),

  // Roberta Williams — conceptrice de jeux vidéo
  williamsIntro: wikipedia(
    'Roberta Williams',
    'Roberta_Williams',
    "Roberta Williams née le 16 février 1953 à Los Angeles, est une créatrice de jeu vidéo américaine. Elle est à l'origine du jeu vidéo Mystery House, le premier jeu d'aventure graphique, dont le succès fut tel qu'avec son mari Ken Williams, elle créa On-Line Systems en 1980 qui devint en 1982, Sierra On-Line.",
  ),
  williamsEnfance: wikipedia(
    'Roberta Williams',
    'Roberta_Williams',
    'Enfant timide dotée d’une imagination vive, elle invente souvent des histoires d’aventure et de contes de fées pour divertir sa famille.',
    'enfance',
  ),
  williamsLycee: wikipedia(
    'Roberta Williams',
    'Roberta_Williams',
    'Après le lycée, elle devient employée administrative au département des services sociaux du comté de Los Angeles, en partie grâce aux relations de son père dans l’administration locale.',
    'lycee',
  ),
  williamsOperatrice: wikipedia(
    'Roberta Williams',
    'Roberta_Williams',
    'Le couple s’installe brièvement dans l’Illinois, où elle travaille comme opératrice informatique, avant de revenir à Los Angeles.',
    'operatrice',
  ),
  williamsDessins: wikipedia(
    'Roberta Williams',
    'Roberta_Williams',
    'Elle réalise les illustrations sur un Apple II à l’aide d’un Versawriter, une tablette graphique permettant de décalquer à la main une image sur papier pour la transférer à l’ordinateur.',
    'dessins',
  ),
  williamsCobol: wikipedia(
    'Roberta Williams',
    'Roberta_Williams',
    'Elle y est embauchée chez Lawry’s Foods comme programmeuse en COBOL.',
    'cobol',
  ),
  williamsTextuel: wikipedia(
    'Roberta Williams',
    'Roberta_Williams',
    "Elle développe une passion pour l'informatique en découvrant les jeux d'aventure textuels.",
    'textuel',
  ),
  williamsDuo: wikipedia(
    'Roberta Williams',
    'Roberta_Williams',
    'Roberta le persuade d’apporter ses compétences techniques pour programmer le jeu, tandis qu’elle-même met à profit son expérience de la fiction et de la narration.',
    'duo',
  ),
  williamsZiploc: wikipedia(
    'Roberta Williams',
    'Roberta_Williams',
    'Le titre se vend rapidement à dix mille exemplaires, Roberta s’occupant elle-même de l’emballage des disquettes et des documents d’accompagnement dans des sacs Ziploc, tout en répondant au téléphone de leur domicile pour fournir des indices aux joueurs.',
    'ziploc',
  ),
  concepteurDefinition: wikipedia(
    'Concepteur de jeux',
    'Concepteur_de_jeux',
    "Le concepteur d'un jeu vidéo en développe la forme, le concept, le gameplay et la jouabilité (playability). Il conçoit le champ, les spécifications, les propriétés des objets, les règles du jeu, etc.",
  ),
  concepteurVoies: wikipedia(
    'Concepteur de jeux',
    'Concepteur_de_jeux',
    "De véritables connaissances en programmation ou en art sont aussi très utiles. À l'origine, de nombreux concepteurs de jeux étaient d'anciens programmeurs ou graphistes. De nos jours, ils proviennent davantage d'écoles spécialisées, qui forment à la conception de jeux.",
    'voies',
  ),

  // Activités
  treillis: wikipedia(
    'Poutre en treillis',
    'Poutre_en_treillis',
    "Une poutre est dite en treillis lorsqu’elle est formée d'éléments articulés entre eux et formant une triangulation.",
  ),
  treillisInertie: wikipedia(
    'Poutre en treillis',
    'Poutre_en_treillis',
    "Pour franchir de grandes portées, il faut augmenter l'inertie des poutres en faisant un assemblage de bois qui ont probablement été inspirées par les fermes triangulaires des toitures qui par assemblage vont former des treillis.",
    'inertie',
  ),
  robotDefinition: wikipedia(
    'Robotique',
    'Robotique',
    'De cette définition découlent deux interprétations : la première serait de voir le robot comme une machine, qui possède des capteurs, un système logique et des actionneurs.',
  ),
  robotReflexe: wikipedia(
    'Robotique',
    'Robotique',
    "À un niveau réactif, un robot peut traduire l'information brute d'un capteur directement en commande d'un actionneur (p.ex. un arrêt d'urgence ; si un obstacle est détecté alors arrêt des moteurs).",
    'reflexe',
  ),
  robotProgramme: wikipedia(
    'Robotique',
    'Robotique',
    "Un robot fonctionne par l'exécution continue d'un programme informatique constitué d'algorithmes.",
    'programme',
  ),
} satisfies Record<string, Source>;

/** Article de Wikipédia en anglais, quand l'article français manque. */
function wikipediaEn(article: string, path: string, excerpt: string, key = 'intro'): Source {
  return {
    id: `wikipedia-en-${path.toLowerCase()}-${key}`,
    title: article,
    publisher: 'Wikipedia (en anglais)',
    url: `https://en.wikipedia.org/wiki/${path}`,
    sourceType: 'encyclopedia',
    accessedAt: '2026-10-12',
    relevantExcerpt: excerpt,
    note: 'Article collaboratif en anglais : à compléter par les sources primaires qu’il cite.',
  };
}

export const YE = {
  pitturaRipa: wikipediaEn(
    'Self-Portrait as the Allegory of Painting',
    'Self-Portrait_as_the_Allegory_of_Painting',
    'She holds in her hand a brush, and in the other the palette',
  ),
  pitturaMasque: wikipediaEn(
    'Self-Portrait as the Allegory of Painting',
    'Self-Portrait_as_the_Allegory_of_Painting',
    'The gold chain near the neck shimmers, while the chain near the chest (ending in a mask pendant) slowly dies down into a lacklustre brown.',
    'masque',
  ),
  pitturaCheveux: wikipediaEn(
    'Self-Portrait as the Allegory of Painting',
    'Self-Portrait_as_the_Allegory_of_Painting',
    "The textural element, so important in Baroque paintings, is found in the wisps in the disheveled hair, the crinkles in the sleeve with spilled paint cracking near the wrist, and the dirty hands, which augment the painting's realism.",
    'textures',
  ),
  pitturaLumiere: wikipediaEn(
    'Self-Portrait as the Allegory of Painting',
    'Self-Portrait_as_the_Allegory_of_Painting',
    'The light is clearly coming from the left, but the source is not visible and is unusually harsh.',
    'lumiere',
  ),
  pitturaInitiales: wikipediaEn(
    'Self-Portrait as the Allegory of Painting',
    'Self-Portrait_as_the_Allegory_of_Painting',
    "The artist's initials are placed below the palette.",
    'initiales',
  ),
  pitturaNettoyage: wikipediaEn(
    'Self-Portrait as the Allegory of Painting',
    'Self-Portrait_as_the_Allegory_of_Painting',
    'The thinness of the painting in the background gives the impression that the painting is unfinished, however a 1972 cleaning removed later overpainting to restore it to its earlier condition.',
    'nettoyage',
  ),
  pitturaDebat: wikipediaEn(
    'Self-Portrait as the Allegory of Painting',
    'Self-Portrait_as_the_Allegory_of_Painting',
    'That it is a self-portrait as well as an allegory was first proposed by Michael Levey in the 20th century, and is not universally accepted, as some art historians see the features of the figure here as too different from those in other portraits of the artist.',
    'debat',
  ),
} satisfies Record<string, Source>;
