import { Type, type Static, type TSchema } from '@sinclair/typebox';

export const ErrorResponse = Type.Object({
  error: Type.Object({
    type: Type.String(),
    message: Type.String(),
  }),
});

export const SuccessResponse = <TData extends TSchema>(dataSchema: TData) =>
  Type.Object({
    data: dataSchema,
    messages: Type.Optional(Type.Array(Type.String())),
  });

export const PagedResponse = <TItem extends TSchema>(itemSchema: TItem) =>
  Type.Object({
    data: Type.Array(itemSchema),
    cursor: Type.Optional(Type.String()),
    messages: Type.Optional(Type.Array(Type.String())),
  });

export type ErrorResponseType = Static<typeof ErrorResponse>;
