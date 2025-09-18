import { createAccessControl } from 'better-auth/plugins/access';
import { adminAc, defaultStatements, memberAc, ownerAc } from 'better-auth/plugins/organization/access';
const statement = {
  ...defaultStatements,
  project: ['create', 'share', 'update', 'delete'],
} as const;

export const ac = createAccessControl(statement);

export const member = ac.newRole({
  project: ['create'],
  ...memberAc.statements,
});

export const admin = ac.newRole({
  project: ['create', 'update'],
  ...adminAc.statements,
});

export const owner = ac.newRole({
  project: ['create', 'update', 'delete'],
  ...ownerAc.statements,
});
