import { Container } from 'inversify';
import { bindOrRebind, makeBusResolver } from '@app/core';
import { IDENTITY_FACADE_TOKEN, IIdentityFacade } from '@app/integration-contracts';
import { IdentityFacade } from './identityFacade';

export const registerIdentityFacades = (container: Container): void => {
  bindOrRebind(container, IDENTITY_FACADE_TOKEN, () => {
    container
      .bind<IIdentityFacade>(IDENTITY_FACADE_TOKEN)
      .toDynamicValue(() => {
        const resolver = makeBusResolver(container);
        return new IdentityFacade(resolver);
      })
      .inSingletonScope();
  });
};
