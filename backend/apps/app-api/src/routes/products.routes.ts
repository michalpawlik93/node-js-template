import type { IProductBaseFacade } from '@app/integration-contracts';
import type {
  FastifyPluginAsync,
  preHandlerHookHandler,
} from 'fastify';
import {
  createProductController,
  deleteProductController,
  getPagedProductsController,
} from '../controllers/products.controller';
import {
  createProductRouteSchema,
  deleteProductRouteSchema,
  getPagedProductsRouteSchema,
} from '../schemas/products.schema';

interface ProductsRoutesOptions {
  productFacade: IProductBaseFacade;
  authenticate: preHandlerHookHandler;
}

export const productsRoutes: FastifyPluginAsync<ProductsRoutesOptions> = async (
  app,
  { productFacade, authenticate },
) => {
  app.post('/products', {
    preHandler: [authenticate],
    schema: createProductRouteSchema,
    handler: createProductController(productFacade),
  });

  app.delete('/products/:id', {
    preHandler: [authenticate],
    schema: deleteProductRouteSchema,
    handler: deleteProductController(productFacade),
  });

  app.post('/products/search', {
    preHandler: [authenticate],
    schema: getPagedProductsRouteSchema,
    handler: getPagedProductsController(productFacade),
  });
};
