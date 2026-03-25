import { BasicError, Result, Transport } from '@app/core';

export const IDENTITY_FACADE_TOKEN = Symbol.for('IdentityFacade');

export interface RegisterCommandContract {
  email: string;
  password: string;
}

export interface RegisterResponseContract {
  userId: string;
  email: string;
}

export interface LoginCommandContract {
  email: string;
  password: string;
}

export interface SessionContract {
  accessToken: string;
  refreshToken: string;
  expiresAt?: number;
}

export interface UserPrincipalContract {
  userId: string;
  email: string;
  roles: string[];
  permissions: string[];
}

export interface LoginResponseContract {
  session: SessionContract;
  principal: UserPrincipalContract;
}

export interface LogoutCommandContract {
  userId: string;
}

export interface RefreshTokenCommandContract {
  refreshToken: string;
}

export interface RefreshTokenResponseContract {
  session: SessionContract;
}

export interface GetCurrentUserCommandContract {
  accessToken: string;
}

export interface UserProfileContract {
  id: string;
  email: string;
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface UpdateUserProfileCommandContract {
  userId: string;
  email?: string;
  lastLoginAt?: Date;
}

export interface AssignRoleCommandContract {
  userId: string;
  roleName: string;
}

export interface RemoveRoleCommandContract {
  userId: string;
  roleName: string;
}

export interface PermissionCheckContract {
  userId: string;
  permission: string;
}

export interface RoleCheckContract {
  userId: string;
  role: string;
}

export interface IIdentityFacade {
  register(
    payload: RegisterCommandContract,
    opts?: { via?: Transport },
  ): Promise<Result<RegisterResponseContract, BasicError>>;
  login(
    payload: LoginCommandContract,
    opts?: { via?: Transport },
  ): Promise<Result<LoginResponseContract, BasicError>>;
  logout(
    payload: LogoutCommandContract,
    opts?: { via?: Transport },
  ): Promise<Result<null, BasicError>>;
  refreshToken(
    payload: RefreshTokenCommandContract,
    opts?: { via?: Transport },
  ): Promise<Result<RefreshTokenResponseContract, BasicError>>;
  getCurrentUser(
    payload: GetCurrentUserCommandContract,
    opts?: { via?: Transport },
  ): Promise<Result<UserPrincipalContract, BasicError>>;
  hasPermission(
    payload: PermissionCheckContract,
    opts?: { via?: Transport },
  ): Promise<Result<boolean, BasicError>>;
  hasRole(
    payload: RoleCheckContract,
    opts?: { via?: Transport },
  ): Promise<Result<boolean, BasicError>>;
  assignRole(
    payload: AssignRoleCommandContract,
    opts?: { via?: Transport },
  ): Promise<Result<null, BasicError>>;
  removeRole(
    payload: RemoveRoleCommandContract,
    opts?: { via?: Transport },
  ): Promise<Result<null, BasicError>>;
  getUserPermissions(
    userId: string,
    opts?: { via?: Transport },
  ): Promise<Result<string[], BasicError>>;
  getUserRoles(
    userId: string,
    opts?: { via?: Transport },
  ): Promise<Result<string[], BasicError>>;
  getUserProfile(
    userId: string,
    opts?: { via?: Transport },
  ): Promise<Result<UserProfileContract, BasicError>>;
  updateUserProfile(
    payload: UpdateUserProfileCommandContract,
    opts?: { via?: Transport },
  ): Promise<Result<UserProfileContract, BasicError>>;
}
