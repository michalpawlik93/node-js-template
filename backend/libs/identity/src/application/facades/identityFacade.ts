import 'reflect-metadata';
import { injectable } from 'inversify';
import {
  BasicError,
  BusResolver,
  Envelope,
  IN_MEMORY_TRANSPORT,
  Result,
  Transport,
  isErr,
} from '@app/core';
import {
  AssignRoleCommandContract,
  GetCurrentUserCommandContract,
  IIdentityFacade,
  LoginCommandContract,
  LoginResponseContract,
  LogoutCommandContract,
  PermissionCheckContract,
  RefreshTokenCommandContract,
  RefreshTokenResponseContract,
  RegisterCommandContract,
  RegisterResponseContract,
  RemoveRoleCommandContract,
  RoleCheckContract,
  UpdateUserProfileCommandContract,
  UserPrincipalContract,
  UserProfileContract,
} from '@app/integration-contracts';
import { ulid } from 'ulid';
import {
  GET_CURRENT_USER_COMMAND_TYPE,
  GetCurrentUserCommand,
  LOGIN_COMMAND_TYPE,
  LoginCommand,
  LOGOUT_COMMAND_TYPE,
  LogoutCommand,
  REFRESH_TOKEN_COMMAND_TYPE,
  RefreshTokenCommand,
  REGISTER_COMMAND_TYPE,
  RegisterCommand,
} from '../features/authentication';
import {
  ASSIGN_ROLE_COMMAND_TYPE,
  AssignRoleCommand,
  GET_USER_PERMISSIONS_COMMAND_TYPE,
  GET_USER_ROLES_COMMAND_TYPE,
  GetUserPermissionsCommand,
  GetUserRolesCommand,
  HAS_PERMISSION_COMMAND_TYPE,
  HAS_ROLE_COMMAND_TYPE,
  HasPermissionCommand,
  HasRoleCommand,
  REMOVE_ROLE_COMMAND_TYPE,
  RemoveRoleCommand,
} from '../features/authorization';
import {
  GET_USER_PROFILE_COMMAND_TYPE,
  GetUserProfileCommand,
  UPDATE_USER_PROFILE_COMMAND_TYPE,
  UpdateUserProfileCommand,
} from '../features/userProfile';

@injectable()
export class IdentityFacade implements IIdentityFacade {
  constructor(private readonly resolveBus: BusResolver) {}

  private async invoke<TCommand extends Record<string, unknown>, TResponse>(
    type: string,
    payload: TCommand,
    via?: Transport,
  ): Promise<Result<TResponse, BasicError>> {
    const busResult = this.resolveBus(via ?? IN_MEMORY_TRANSPORT);
    if (isErr(busResult)) {
      return busResult;
    }

    const envelope: Envelope<TCommand> = {
      type,
      payload,
      meta: { commandId: ulid() },
    };

    return busResult.value.invoke<TCommand, TResponse>(envelope);
  }

  register(
    payload: RegisterCommandContract,
    opts?: { via?: Transport },
  ): Promise<Result<RegisterResponseContract, BasicError>> {
    return this.invoke<RegisterCommand, RegisterResponseContract>(
      REGISTER_COMMAND_TYPE,
      payload as RegisterCommand,
      opts?.via,
    );
  }

  login(
    payload: LoginCommandContract,
    opts?: { via?: Transport },
  ): Promise<Result<LoginResponseContract, BasicError>> {
    return this.invoke<LoginCommand, LoginResponseContract>(
      LOGIN_COMMAND_TYPE,
      payload as LoginCommand,
      opts?.via,
    );
  }

  logout(
    payload: LogoutCommandContract,
    opts?: { via?: Transport },
  ): Promise<Result<null, BasicError>> {
    return this.invoke<LogoutCommand, null>(
      LOGOUT_COMMAND_TYPE,
      payload as LogoutCommand,
      opts?.via,
    );
  }

  refreshToken(
    payload: RefreshTokenCommandContract,
    opts?: { via?: Transport },
  ): Promise<Result<RefreshTokenResponseContract, BasicError>> {
    return this.invoke<RefreshTokenCommand, RefreshTokenResponseContract>(
      REFRESH_TOKEN_COMMAND_TYPE,
      payload as RefreshTokenCommand,
      opts?.via,
    );
  }

  getCurrentUser(
    payload: GetCurrentUserCommandContract,
    opts?: { via?: Transport },
  ): Promise<Result<UserPrincipalContract, BasicError>> {
    return this.invoke<GetCurrentUserCommand, UserPrincipalContract>(
      GET_CURRENT_USER_COMMAND_TYPE,
      payload as GetCurrentUserCommand,
      opts?.via,
    );
  }

  hasPermission(
    payload: PermissionCheckContract,
    opts?: { via?: Transport },
  ): Promise<Result<boolean, BasicError>> {
    return this.invoke<HasPermissionCommand, boolean>(
      HAS_PERMISSION_COMMAND_TYPE,
      payload as HasPermissionCommand,
      opts?.via,
    );
  }

  hasRole(
    payload: RoleCheckContract,
    opts?: { via?: Transport },
  ): Promise<Result<boolean, BasicError>> {
    return this.invoke<HasRoleCommand, boolean>(
      HAS_ROLE_COMMAND_TYPE,
      payload as HasRoleCommand,
      opts?.via,
    );
  }

  assignRole(
    payload: AssignRoleCommandContract,
    opts?: { via?: Transport },
  ): Promise<Result<null, BasicError>> {
    return this.invoke<AssignRoleCommand, null>(
      ASSIGN_ROLE_COMMAND_TYPE,
      payload as AssignRoleCommand,
      opts?.via,
    );
  }

  removeRole(
    payload: RemoveRoleCommandContract,
    opts?: { via?: Transport },
  ): Promise<Result<null, BasicError>> {
    return this.invoke<RemoveRoleCommand, null>(
      REMOVE_ROLE_COMMAND_TYPE,
      payload as RemoveRoleCommand,
      opts?.via,
    );
  }

  getUserPermissions(
    userId: string,
    opts?: { via?: Transport },
  ): Promise<Result<string[], BasicError>> {
    return this.invoke<GetUserPermissionsCommand, string[]>(
      GET_USER_PERMISSIONS_COMMAND_TYPE,
      { userId },
      opts?.via,
    );
  }

  getUserRoles(
    userId: string,
    opts?: { via?: Transport },
  ): Promise<Result<string[], BasicError>> {
    return this.invoke<GetUserRolesCommand, string[]>(
      GET_USER_ROLES_COMMAND_TYPE,
      { userId },
      opts?.via,
    );
  }

  getUserProfile(
    userId: string,
    opts?: { via?: Transport },
  ): Promise<Result<UserProfileContract, BasicError>> {
    return this.invoke<GetUserProfileCommand, UserProfileContract>(
      GET_USER_PROFILE_COMMAND_TYPE,
      { userId },
      opts?.via,
    );
  }

  updateUserProfile(
    payload: UpdateUserProfileCommandContract,
    opts?: { via?: Transport },
  ): Promise<Result<UserProfileContract, BasicError>> {
    return this.invoke<UpdateUserProfileCommand, UserProfileContract>(
      UPDATE_USER_PROFILE_COMMAND_TYPE,
      {
        userId: payload.userId,
        email: payload.email,
        lastLoginAt: payload.lastLoginAt,
      },
      opts?.via,
    );
  }
}
