import { inject, injectable } from 'inversify';
import { LOGGING_TYPES, LoggerFactory, ModuleLogger } from '@app/core';

export const IDENTITY_LOGGER = Symbol.for('IdentityLogger');

@injectable()
export class IdentityLogger extends ModuleLogger {
  constructor(
    @inject(LOGGING_TYPES.LoggerFactory)
    loggerFactory: LoggerFactory,
  ) {
    super(loggerFactory, 'IDENTITY', { component: 'identity' });
  }
}
