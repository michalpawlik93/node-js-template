import { IN_MEMORY_TRANSPORT } from '@app/core';
import type { IProductBaseFacade } from '@app/integration-contracts';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type {
  CreateProductBodyType,
  DeleteProductParamsType,
  PagedProductsBodyType,
} from '../schemas/products.schema';
import { mapResultToReply } from '../utils/resultMapper';

export const createProductController =
  (productFacade: IProductBaseFacade) =>
  async (
    request: FastifyRequest<{ Body: CreateProductBodyType }>,
    reply: FastifyReply,
  ) => {
    const result = await productFacade.invokeCreateProduct(request.body, {
      via: IN_MEMORY_TRANSPORT,
    });
    return mapResultToReply(result, reply, 201);
  };

export const deleteProductController =
  (productFacade: IProductBaseFacade) =>
  async (
    request: FastifyRequest<{ Params: DeleteProductParamsType }>,
    reply: FastifyReply,
  ) => {
    const result = await productFacade.invokeDeleteProduct(
      { id: request.params.id },
      { via: IN_MEMORY_TRANSPORT },
    );
    return mapResultToReply(result, reply);
  };

export const getPagedProductsController =
  (productFacade: IProductBaseFacade) =>
  async (
    request: FastifyRequest<{ Body: PagedProductsBodyType }>,
    reply: FastifyReply,
  ) => {
    const result = await productFacade.getPagedProducts(request.body, {
      via: IN_MEMORY_TRANSPORT,
    });
    return mapResultToReply(result, reply);
  };
