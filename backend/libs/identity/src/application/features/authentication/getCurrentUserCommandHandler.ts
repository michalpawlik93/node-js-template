import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { BaseCommand, BasicError, Envelope, Handler, Result, isErr, ok } from '@app/core';
import { createUserPrincipal } from '../../../domain';
import { AUTH_SERVICE_TOKEN, IAuthenticationService } from '../../../infrastructure/supabase';
import { IUserRoleRepository, USER_ROLE_REPOSITORY_KEY } from '../../../infrastructure/prisma';

export const GET_CURRENT_USER_COMMAND_TYPE = 'identity.getCurrentUser';

export interface GetCurrentUserCommand extends BaseCommand {
  accessToken: string;
}

export interface GetCurrentUserResponse {
  userId: string;
  email: string;
  roles: string[];
  permissions: string[];
}

@injectable()
export class GetCurrentUserCommandHandler
  implements Handler<GetCurrentUserCommand, GetCurrentUserResponse>
{
  constructor(
    @inject(AUTH_SERVICE_TOKEN)
    private readonly authService: IAuthenticationService,
    @inject(USER_ROLE_REPOSITORY_KEY)
    private readonly userRoleRepository: IUserRoleRepository,
  ) {}

  async handle(
    env: Envelope<GetCurrentUserCommand>,
  ): Promise<Result<GetCurrentUserResponse, BasicError>> {
    const userResult = await this.authService.getCurrentUser({
      accessToken: env.payload.accessToken,
    });

    if (isErr(userResult)) {
      return userResult;
    }

    const rolesResult = await this.userRoleRepository.findRolesByUserId(userResult.value.id);
    if (isErr(rolesResult)) {
      return rolesResult;
    }

    const permissionsResult = await this.userRoleRepository.getEffectivePermissions(userResult.value.id);
    if (isErr(permissionsResult)) {
      return permissionsResult;
    }

    const principal = createUserPrincipal({
      userId: userResult.value.id,
      email: userResult.value.email,
      roles: rolesResult.value.map((role) => role.name),
      permissions: permissionsResult.value,
    });

    return ok({
      userId: principal.userId,
      email: principal.email,
      roles: principal.roles,
      permissions: principal.permissions,
    });
  }
}
