import { Container } from 'inversify';
import { Handler, TYPES } from '@app/core';
import {
  GET_CURRENT_USER_COMMAND_TYPE,
  GetCurrentUserCommand,
  GetCurrentUserCommandHandler,
  LOGIN_COMMAND_TYPE,
  LoginCommand,
  LoginCommandHandler,
  LOGOUT_COMMAND_TYPE,
  LogoutCommand,
  LogoutCommandHandler,
  REFRESH_TOKEN_COMMAND_TYPE,
  RefreshTokenCommand,
  RefreshTokenCommandHandler,
  REGISTER_COMMAND_TYPE,
  RegisterCommand,
  RegisterCommandHandler,
} from './authentication';
import {
  ASSIGN_ROLE_COMMAND_TYPE,
  AssignRoleCommand,
  AssignRoleCommandHandler,
  GET_USER_PERMISSIONS_COMMAND_TYPE,
  GET_USER_ROLES_COMMAND_TYPE,
  GetUserPermissionsCommand,
  GetUserPermissionsCommandHandler,
  GetUserRolesCommand,
  GetUserRolesCommandHandler,
  HAS_PERMISSION_COMMAND_TYPE,
  HAS_ROLE_COMMAND_TYPE,
  HasPermissionCommand,
  HasPermissionCommandHandler,
  HasRoleCommand,
  HasRoleCommandHandler,
  REMOVE_ROLE_COMMAND_TYPE,
  RemoveRoleCommand,
  RemoveRoleCommandHandler,
} from './authorization';
import {
  GET_USER_PROFILE_COMMAND_TYPE,
  GetUserProfileCommand,
  GetUserProfileCommandHandler,
  UPDATE_USER_PROFILE_COMMAND_TYPE,
  UpdateUserProfileCommand,
  UpdateUserProfileCommandHandler,
} from './userProfile';

export const registerIdentityCommandHandlers = (container: Container): void => {
  container
    .bind<Handler<RegisterCommand>>(TYPES.Handler)
    .to(RegisterCommandHandler)
    .inSingletonScope()
    .whenNamed(REGISTER_COMMAND_TYPE);

  container
    .bind<Handler<LoginCommand>>(TYPES.Handler)
    .to(LoginCommandHandler)
    .inSingletonScope()
    .whenNamed(LOGIN_COMMAND_TYPE);

  container
    .bind<Handler<LogoutCommand>>(TYPES.Handler)
    .to(LogoutCommandHandler)
    .inSingletonScope()
    .whenNamed(LOGOUT_COMMAND_TYPE);

  container
    .bind<Handler<GetCurrentUserCommand>>(TYPES.Handler)
    .to(GetCurrentUserCommandHandler)
    .inSingletonScope()
    .whenNamed(GET_CURRENT_USER_COMMAND_TYPE);

  container
    .bind<Handler<RefreshTokenCommand>>(TYPES.Handler)
    .to(RefreshTokenCommandHandler)
    .inSingletonScope()
    .whenNamed(REFRESH_TOKEN_COMMAND_TYPE);

  container
    .bind<Handler<HasPermissionCommand>>(TYPES.Handler)
    .to(HasPermissionCommandHandler)
    .inSingletonScope()
    .whenNamed(HAS_PERMISSION_COMMAND_TYPE);

  container
    .bind<Handler<HasRoleCommand>>(TYPES.Handler)
    .to(HasRoleCommandHandler)
    .inSingletonScope()
    .whenNamed(HAS_ROLE_COMMAND_TYPE);

  container
    .bind<Handler<AssignRoleCommand>>(TYPES.Handler)
    .to(AssignRoleCommandHandler)
    .inSingletonScope()
    .whenNamed(ASSIGN_ROLE_COMMAND_TYPE);

  container
    .bind<Handler<RemoveRoleCommand>>(TYPES.Handler)
    .to(RemoveRoleCommandHandler)
    .inSingletonScope()
    .whenNamed(REMOVE_ROLE_COMMAND_TYPE);

  container
    .bind<Handler<GetUserPermissionsCommand>>(TYPES.Handler)
    .to(GetUserPermissionsCommandHandler)
    .inSingletonScope()
    .whenNamed(GET_USER_PERMISSIONS_COMMAND_TYPE);

  container
    .bind<Handler<GetUserRolesCommand>>(TYPES.Handler)
    .to(GetUserRolesCommandHandler)
    .inSingletonScope()
    .whenNamed(GET_USER_ROLES_COMMAND_TYPE);

  container
    .bind<Handler<GetUserProfileCommand>>(TYPES.Handler)
    .to(GetUserProfileCommandHandler)
    .inSingletonScope()
    .whenNamed(GET_USER_PROFILE_COMMAND_TYPE);

  container
    .bind<Handler<UpdateUserProfileCommand>>(TYPES.Handler)
    .to(UpdateUserProfileCommandHandler)
    .inSingletonScope()
    .whenNamed(UPDATE_USER_PROFILE_COMMAND_TYPE);
};
