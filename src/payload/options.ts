/** Listes de choix du backoffice, avec leurs libellés. Les valeurs sont celles du modèle du site. */

export const KIND_OPTIONS = [
  { label: 'Femme', value: 'person' },
  { label: 'Œuvre', value: 'work' },
  { label: 'Invention ou découverte', value: 'science' },
  { label: 'Mouvement', value: 'movement' },
  { label: 'Événement', value: 'event' },
  { label: 'Idée', value: 'idea' },
  { label: 'Conquête (droit)', value: 'right' },
  { label: 'Organisation', value: 'organization' },
  { label: 'Texte de loi', value: 'law' },
];

export const DOMAIN_OPTIONS = [
  { label: 'Arts', value: 'arts' },
  { label: 'Sciences', value: 'sciences' },
  { label: 'Droits', value: 'droits' },
  { label: 'Sport', value: 'sport' },
];

export const EDITORIAL_STATUS_OPTIONS = [
  { label: 'Exemple de développement', value: 'dev-example' },
  { label: 'Brouillon', value: 'draft' },
  { label: 'En relecture', value: 'in-review' },
  { label: 'Vérifiée', value: 'verified' },
];

export const CATEGORY_OPTIONS = [
  { label: 'Doubles standards', value: 'doubles-standards' },
  { label: 'Sexisme au quotidien', value: 'sexisme-quotidien' },
  { label: 'Médias et publicité', value: 'medias-publicite' },
  { label: 'Stéréotypes', value: 'stereotypes' },
  { label: 'Raisonnement', value: 'raisonnement' },
  { label: 'Histoire et culture', value: 'histoire-culture' },
];

export const RELATION_OPTIONS = [
  { label: 'A créé (œuvre, invention)', value: 'created' },
  { label: 'Membre de (mouvement, organisation)', value: 'member-of' },
  { label: 'A pris part à (événement)', value: 'took-part' },
  { label: 'Illustre (idée)', value: 'illustrates' },
  { label: 'A contribué à (conquête)', value: 'contributed' },
  { label: 'Établit (conquête)', value: 'enacted' },
  { label: 'Contexte', value: 'context' },
];

export const CONTRIBUTION_OPTIONS = [
  { label: 'Revendication', value: 'claim' },
  { label: 'Mobilisation', value: 'mobilization' },
  { label: 'Publication', value: 'publication' },
  { label: 'Recherche', value: 'research' },
  { label: 'Action en justice', value: 'legal-action' },
  { label: 'Plaidoyer', value: 'advocacy' },
  { label: 'Rédaction du texte', value: 'drafting' },
  { label: 'Réforme', value: 'reform' },
  { label: 'Prolongement', value: 'continuation' },
];

export const RIGHT_CATEGORY_OPTIONS = [
  { label: 'Politique', value: 'politique' },
  { label: 'Autonomie', value: 'autonomie' },
  { label: 'Reproduction', value: 'reproduction' },
  { label: 'Éducation', value: 'education' },
  { label: 'Travail', value: 'travail' },
  { label: 'Violences', value: 'violences' },
  { label: 'Famille', value: 'famille' },
  { label: 'Libertés', value: 'libertes' },
];

export const SOURCE_TYPE_OPTIONS = [
  { label: 'Universitaire', value: 'academic' },
  { label: 'Institutionnelle', value: 'institutional' },
  { label: 'Juridique', value: 'legal' },
  { label: 'Presse', value: 'press' },
  { label: 'Livre', value: 'book' },
  { label: 'Encyclopédie', value: 'encyclopedia' },
  { label: 'Archive', value: 'archive' },
  { label: 'Autre', value: 'other' },
];

export const MOTIF_OPTIONS = ['split', 'circles', 'frame', 'stripes', 'arrows', 'arch'];
