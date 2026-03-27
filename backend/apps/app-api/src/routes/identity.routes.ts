import type { IIdentityFacade } from '@app/integration-contracts';
import type {
  FastifyPluginAsync,
  preHandlerHookHandler,
} from 'fastify';
import {
  getCurrentUserController,
  getUserProfileController,
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
} from '../controllers/identity.controller';
import {
  getCurrentUserRouteSchema,
  getUserProfileRouteSchema,
  loginRouteSchema,
  logoutRouteSchema,
  refreshTokenRouteSchema,
  registerRouteSchema,
} from '../schemas/identity.schema';

interface IdentityRoutesOptions {
  identityFacade: IIdentityFacade;
  authenticate: preHandlerHookHandler;
}

export const identityRoutes: FastifyPluginAsync<IdentityRoutesOptions> = async (
  app,
  { identityFacade, authenticate },
) => {
  app.post('/auth/register', {
    schema: registerRouteSchema,
    handler: registerController(identityFacade),
  });

  app.post('/auth/login', {
    schema: loginRouteSchema,
    handler: loginController(identityFacade),
  });

  app.post('/auth/logout', {
    preHandler: [authenticate],
    schema: logoutRouteSchema,
    handler: logoutController(identityFacade),
  });

  app.post('/auth/refresh', {
    schema: refreshTokenRouteSchema,
    handler: refreshTokenController(identityFacade),
  });

  app.get('/auth/me', {
    preHandler: [authenticate],
    schema: getCurrentUserRouteSchema,
    handler: getCurrentUserController,
  });

  app.get('/auth/profile', {
    preHandler: [authenticate],
    schema: getUserProfileRouteSchema,
    handler: getUserProfileController(identityFacade),
  });
};
