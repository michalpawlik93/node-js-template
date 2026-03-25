export interface UserPrincipal {
  userId: string;
  email: string;
  roles: string[];
  permissions: string[];
  hasPermission: (name: string) => boolean;
  hasRole: (name: string) => boolean;
}

export const createUserPrincipal = (params: {
  userId: string;
  email: string;
  roles: string[];
  permissions: string[];
}): UserPrincipal => ({
  userId: params.userId,
  email: params.email,
  roles: params.roles,
  permissions: params.permissions,
  hasPermission: (name: string) => params.permissions.includes(name),
  hasRole: (name: string) => params.roles.includes(name),
});
