# API Layer Rules

This document describes conventions for building HTTP endpoints in the `app-api` application using Fastify.

## Overview

The API layer is organized into four parts:

- **schemas** – request/response shape definitions using `@sinclair/typebox`
- **routes** – Fastify plugin functions that register endpoints
- **controllers** – thin handlers that call facade methods
- **middleware** – `preHandler` hooks for authentication and authorization

---

## Schemas (`@sinclair/typebox`)

Use `@sinclair/typebox` to define all request bodies, params, and responses. Export both the schema object and the `Static<>` type for use in controllers.

```typescript
import { Type, type Static } from '@sinclair/typebox';
import { ErrorResponse, SuccessResponse, PagedResponse } from './common.schema';

export const CreateOrderBody = Type.Object({
  productId: Type.String({ minLength: 1 }),
  quantity: Type.Integer({ minimum: 1 }),
  scheduledAt: Type.Optional(Type.String()), // ISO 8601 UTC string
});

export const OrderResponseData = Type.Object({
  id: Type.String(),
});

export const createOrderRouteSchema = {
  body: CreateOrderBody,
  response: {
    201: SuccessResponse(OrderResponseData),
    400: ErrorResponse,
    401: ErrorResponse,
    500: ErrorResponse,
  },
};

export type CreateOrderBodyType = Static<typeof CreateOrderBody>;
```

**Common response wrappers** (from `common.schema.ts`):
- `SuccessResponse(DataSchema)` – wraps data in `{ data, messages? }`
- `PagedResponse(ItemSchema)` – wraps paginated data in `{ data[], cursor?, messages? }`
- `ErrorResponse` – `{ error: { type, message } }`

---

## Routes

Each domain has its own routes file exporting a `FastifyPluginAsync`. Facades and middleware are passed as options — never imported directly.

```typescript
import type { FastifyPluginAsync, preHandlerHookHandler } from 'fastify';
import type { IOrderFacade } from '@app/integration-contracts';

interface OrderRoutesOptions {
  orderFacade: IOrderFacade;
  authenticate: preHandlerHookHandler;
  authorize: (role: string) => preHandlerHookHandler;
}

export const orderRoutes: FastifyPluginAsync<OrderRoutesOptions> = async (
  app,
  { orderFacade, authenticate, authorize },
) => {
  app.post('/orders', {
    preHandler: [authenticate],
    schema: createOrderRouteSchema,
    handler: createOrderController(orderFacade),
  });

  app.delete('/orders/:id', {
    preHandler: [authenticate, authorize('admin')],
    schema: deleteOrderRouteSchema,
    handler: deleteOrderController(orderFacade),
  });
};
```

---

## Controllers

Controllers are factory functions that accept a facade and return a Fastify handler. They extract typed input from the request and delegate to the facade. They do not contain business logic or mapping.

```typescript
import type { FastifyRequest, FastifyReply } from 'fastify';
import { IN_MEMORY_TRANSPORT } from '@app/core';
import { mapResultToReply } from '../utils/resultMapper';
import type { CreateOrderBodyType } from '../schemas/order.schema';

export const createOrderController =
  (orderFacade: IOrderFacade) =>
  async (
    request: FastifyRequest<{ Body: CreateOrderBodyType }>,
    reply: FastifyReply,
  ) => {
    const result = await orderFacade.invokeCreateOrder(request.body, {
      via: IN_MEMORY_TRANSPORT,
    });
    return mapResultToReply(result, reply, 201);
  };
```

`mapResultToReply` translates `Result<T, BasicError>` into the correct HTTP response using `error._type` to determine the status code (`NotFoundError` → 404, `ValidationError` → 400, etc.).

---

## Middleware

### `authenticate`

Created by `createAuthenticate(identityFacade)`. Validates a Bearer token, resolves the user, and sets `request.principal`.

```typescript
preHandler: [authenticate]
```

### `requireRole` / `requirePermission` (authorize)

`requireRole(role)` and `requirePermission(permission)` are guard factories. They check `request.principal.roles` or `request.principal.permissions`. Always place them **after** `authenticate`.

```typescript
preHandler: [authenticate, requireRole('admin')]
preHandler: [authenticate, requirePermission('orders:write')]
```

`request.principal` is typed as `UserPrincipalContract` via module augmentation in `types.ts`.

---

## Mapping

**All input/output mapping between API contracts and domain commands lives in the facade layer**, not in controllers or routes.

The controller passes the raw typed body directly to the facade. The facade is responsible for constructing the internal command from the contract.

### Date mapping

When the API receives a date as an ISO 8601 UTC string and the domain expects a `Date` object, use `dateTimeUtils` from `@app/core`:

```typescript
// In facade: string → Date (domain input)
import { parseUTCISOStringToUTCDate } from '@app/core';

const dateResult = parseUTCISOStringToUTCDate(payload.scheduledAt);
if (isErr(dateResult)) return dateResult;
const scheduledAt = dateResult.value; // Date
```

When the domain returns a `Date` and the API response contract expects a string, use the inverse:

```typescript
// In facade: Date → string (contract output)
import { formatUTCDateToISOString } from '@app/core';

const isoResult = formatUTCDateToISOString(domainEntity.scheduledAt);
if (isErr(isoResult)) return isoResult;
const scheduledAt = isoResult.value; // string
```

Available helpers in `dateTimeUtils.ts`:
- `parseUTCISOStringToUTCDate(isoUtcString)` – parses a UTC ISO string to `Date`
- `parseLocalISOStringToUTC(isoDateStr)` – parses and converts local ISO string to UTC `Date`
- `formatUTCDateToISOString(date)` – formats a `Date` to ISO 8601 UTC string

All functions return `Result<T, BasicError>` and must be handled with `isErr`.
