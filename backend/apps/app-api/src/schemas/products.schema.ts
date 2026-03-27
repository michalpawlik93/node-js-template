import { Type, type Static } from '@sinclair/typebox';
import { ErrorResponse, PagedResponse, SuccessResponse } from './common.schema';

export const ProductItem = Type.Object({
  id: Type.String(),
  name: Type.String(),
  priceCents: Type.Integer({ minimum: 1 }),
});

export const CreateProductBody = Type.Object({
  id: Type.Optional(Type.String()),
  name: Type.String({ minLength: 1 }),
  priceCents: Type.Integer({ minimum: 1 }),
});

export const DeleteProductParams = Type.Object({
  id: Type.String(),
});

export const PagedProductsBody = Type.Object({
  pageSize: Type.Integer({ minimum: 1, maximum: 100 }),
  cursor: Type.Optional(Type.String()),
});

export const CreateProductResponseData = Type.Object({
  id: Type.String(),
});

export const DeleteProductResponseData = Type.Object({
  id: Type.String(),
});

export const createProductRouteSchema = {
  body: CreateProductBody,
  response: {
    201: SuccessResponse(CreateProductResponseData),
    400: ErrorResponse,
    401: ErrorResponse,
    500: ErrorResponse,
  },
};

export const deleteProductRouteSchema = {
  params: DeleteProductParams,
  response: {
    200: SuccessResponse(DeleteProductResponseData),
    401: ErrorResponse,
    404: ErrorResponse,
    500: ErrorResponse,
  },
};

export const getPagedProductsRouteSchema = {
  body: PagedProductsBody,
  response: {
    200: PagedResponse(ProductItem),
    400: ErrorResponse,
    401: ErrorResponse,
    500: ErrorResponse,
  },
};

export type CreateProductBodyType = Static<typeof CreateProductBody>;
export type DeleteProductParamsType = Static<typeof DeleteProductParams>;
export type PagedProductsBodyType = Static<typeof PagedProductsBody>;
