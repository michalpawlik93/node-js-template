import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { BaseCommand, BasicError, Envelope, Handler, Result } from '@app/core';
import { AUTH_SERVICE_TOKEN, IAuthenticationService } from '../../../infrastructure/supabase';

export const LOGOUT_COMMAND_TYPE = 'identity.logout';

export interface LogoutCommand extends BaseCommand {
  userId: string;
}

@injectable()
export class LogoutCommandHandler implements Handler<LogoutCommand, null> {
  constructor(
    @inject(AUTH_SERVICE_TOKEN)
    private readonly authService: IAuthenticationService,
  ) {}

  async handle(
    env: Envelope<LogoutCommand>,
  ): Promise<Result<null, BasicError>> {
    return this.authService.logout({ userId: env.payload.userId });
  }
}
