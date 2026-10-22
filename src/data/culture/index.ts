import { contemporaries } from './contemporaines';
import { events } from './events';
import { ideas } from './ideas';
import { movements } from './movements';
import { people } from './people';
import { laws, organizations, rights, rightsEvents, rightsPeople } from './rights';
import { discoveries, matildaIdea, scienceEvents, scientists } from './sciences';
import { sportswomen } from './sportives';
import { twentyFirstCentury } from './xxie-siecle';
import { works } from './works';

/** Catalogue culturel local. Validé au chargement (voir features/culture/validateCulture.ts). */
export const localCultureEntities = [
  ...people,
  ...scientists,
  ...contemporaries,
  ...sportswomen,
  ...twentyFirstCentury,
  ...works,
  ...discoveries,
  ...movements,
  ...events,
  ...scienceEvents,
  ...ideas,
  matildaIdea,
  ...rights,
  ...rightsPeople,
  ...organizations,
  ...laws,
  ...rightsEvents,
];
