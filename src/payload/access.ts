import type { Access, FieldAccess, PayloadRequest } from 'payload';

/**
 * Rôles de l'équipe éditoriale :
 * - `redaction` : crée et modifie des brouillons ;
 * - `relecture` : relit, valide et publie ;
 * - `admin` : tout, y compris les comptes.
 */
export const ROLES = [
  { label: 'Rédaction', value: 'redaction' },
  { label: 'Relecture', value: 'relecture' },
  { label: 'Administration', value: 'admin' },
] as const;

export type Role = (typeof ROLES)[number]['value'];

const roleOf = (req: PayloadRequest): Role | null =>
  (req.user as { role?: Role } | null)?.role ?? null;

export const isAdmin = (req: PayloadRequest) => roleOf(req) === 'admin';
export const canPublish = (req: PayloadRequest) =>
  roleOf(req) === 'admin' || roleOf(req) === 'relecture';

export const loggedIn: Access = ({ req }) => Boolean(req.user);
export const publishers: Access = ({ req }) => canPublish(req);
export const admins: Access = ({ req }) => isAdmin(req);
export const adminField: FieldAccess = ({ req }) => isAdmin(req);

/** Public : seulement ce qui est publié ; l'équipe connectée voit aussi les brouillons. */
export const publishedOrTeam: Access = ({ req }) =>
  req.user ? true : { _status: { equals: 'published' } };
