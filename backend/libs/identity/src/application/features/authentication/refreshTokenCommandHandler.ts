import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { BaseCommand, BasicError, Envelope, Handler, Result, isErr, ok } from '@app/core';
import { AUTH_SERVICE_TOKEN, IAuthenticationService } from '../../../infrastructure/supabase';

export const REFRESH_TOKEN_COMMAND_TYPE = 'identity.refreshToken';

export interface RefreshTokenCommand extends BaseCommand {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  session: {
    accessToken: string;
    refreshToken: string;
    expiresAt?: number;
  };
}

@injectable()
export class RefreshTokenCommandHandler
  implements Handler<RefreshTokenCommand, RefreshTokenResponse>
{
  constructor(
    @inject(AUTH_SERVICE_TOKEN)
    private readonly authService: IAuthenticationService,
  ) {}

  async handle(
    env: Envelope<RefreshTokenCommand>,
  ): Promise<Result<RefreshTokenResponse, BasicError>> {
    const result = await this.authService.refreshToken({
      refreshToken: env.payload.refreshToken,
    });

    if (isErr(result)) {
      return result;
    }

    return ok({ session: result.value });
  }
}
