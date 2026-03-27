import type {
  IIdentityFacade,
  IProductBaseFacade,
} from '@app/integration-contracts';
import Fastify, { type FastifyInstance } from 'fastify';
import { createAuthenticate } from './middleware/authenticate';
import { registerCors } from './plugins/cors';
import { registerErrorHandler } from './plugins/errorHandler';
import { registerHelmet } from './plugins/helmet';
import { registerRateLimit } from './plugins/rateLimit';
import { healthRoutes } from './routes/health.routes';
import { identityRoutes } from './routes/identity.routes';
import { productsRoutes } from './routes/products.routes';
import type { ApiConfig } from './config';
import './types';

export interface BuildAppDeps {
  config: ApiConfig;
  facades: {
    products: IProductBaseFacade;
    identity: IIdentityFacade;
  };
}

export async function buildApp({
  config,
  facades,
}: BuildAppDeps): Promise<FastifyInstance> {
  const app = Fastify({
    logger: true,
  });

  registerErrorHandler(app);
  await registerHelmet(app);
  await registerRateLimit(app);
  await registerCors(app, config.corsOrigin);

  const authenticate = createAuthenticate(facades.identity);

  await app.register(healthRoutes);
  await app.register(identityRoutes, {
    identityFacade: facades.identity,
    authenticate,
  });
  await app.register(productsRoutes, {
    productFacade: facades.products,
    authenticate,
  });

  return app;
}
