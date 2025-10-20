export const RoleType = Object.freeze({
  ADMIN: 'admin',
  USER: 'user',
});

export const RoleHelpers = {
  equals: (roleValue, other) => roleValue === other,
  admins: () => [RoleType.ADMIN],
  asArray: () => Object.values(RoleType),
};

export const Privilege = Object.freeze({
  USERS_SEE_ALL: 'users.view.any',
  USERS_SEE_ONE: 'users.view.one',
  USERS_CREATE: 'users.create',
  USERS_UPDATE: 'users.update',
  USERS_UPDATE_ROLE: 'users.role.update',
  USERS_DELETE: 'users.delete',
  USERS_RESTORE: 'users.restore',
});

export const PERMISSIONS = Object.freeze(Object.values(Privilege));

export const ROLE_PERMISSIONS = Object.freeze({
  [RoleType.ADMIN]: PERMISSIONS,

  [RoleType.USER]: [Privilege.USERS_SEE_ALL, Privilege.USERS_SEE_ONE],
});
