import { Container } from 'inversify';
import type { ILogger } from '@app/core';
import { IdentityLogger, IDENTITY_LOGGER } from './identityLogger';

export const registerIdentityLogging = (container: Container): void => {
  if (!container.isBound(IdentityLogger)) {
    container.bind(IdentityLogger).toSelf().inSingletonScope();
  }

  if (!container.isBound(IDENTITY_LOGGER)) {
    container
      .bind<ILogger>(IDENTITY_LOGGER)
      .toDynamicValue((ctx) =>
        (ctx as unknown as { container: Container }).container.get(IdentityLogger),
      );
  }
};
