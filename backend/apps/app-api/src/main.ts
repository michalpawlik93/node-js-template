import 'reflect-metadata';
import {
  cleanConnections,
  IN_MEMORY_TRANSPORT,
  ModuleContainer,
  runWithContext,
  setupConnections,
} from '@app/core';
import {
  IDENTITY_FACADE_TOKEN,
  IIdentityFacade,
  IProductBaseFacade,
  PRODUCT_FACADE_TOKEN,
} from '@app/integration-contracts';
import { buildApp } from './app';
import { buildApiConfig } from './config';
import { setupContainer } from './di';

let modules: ModuleContainer[] | null = null;
let appInstance: Awaited<ReturnType<typeof buildApp>> | null = null;

const shutdown = async (exitCode: number) => {
  if (appInstance) {
    await appInstance.close();
  }
  await cleanConnections(modules ?? undefined);
  process.exit(exitCode);
};

async function main() {
  const { modules: moduleInstances, requestContext } = await setupContainer();
  modules = Object.values(moduleInstances);
  await setupConnections(modules);

  const productsFacade =
    moduleInstances.products.container.get<IProductBaseFacade>(
      PRODUCT_FACADE_TOKEN,
    );
  const identityFacade =
    moduleInstances.identity.container.get<IIdentityFacade>(
      IDENTITY_FACADE_TOKEN,
    );

  const apiConfig = buildApiConfig();

  await runWithContext(requestContext, async () => {
    appInstance = await buildApp({
      config: apiConfig,
      facades: {
        products: productsFacade,
        identity: identityFacade,
      },
    });

    await appInstance.listen({
      port: apiConfig.port,
      host: apiConfig.host,
    });

    appInstance.log.info(
      {
        port: apiConfig.port,
        host: apiConfig.host,
        transport: IN_MEMORY_TRANSPORT,
      },
      'API server is running',
    );
  });
}

process.on('uncaughtException', async (error) => {
  // eslint-disable-next-line no-console
  console.error('Uncaught Exception:', error);
  await shutdown(1);
});

process.on('unhandledRejection', async (reason, promise) => {
  // eslint-disable-next-line no-console
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  await shutdown(1);
});

process.on('SIGTERM', async () => {
  // eslint-disable-next-line no-console
  console.log('SIGTERM received, shutting down gracefully...');
  await shutdown(0);
});

process.on('SIGINT', async () => {
  // eslint-disable-next-line no-console
  console.log('SIGINT received, shutting down gracefully...');
  await shutdown(0);
});

main().catch(async (error) => {
  // eslint-disable-next-line no-console
  console.error('Fatal error in main:', error);
  await shutdown(1);
});
