import { BasicError, isOk, type Result } from '@app/core';
import type { FastifyReply } from 'fastify';

export function errorTypeToHttpStatus(type: string): number {
  switch (type) {
    case 'NotFoundError':
      return 404;
    case 'UnauthorizedError':
      return 401;
    case 'ForbiddenError':
      return 403;
    case 'ValidationError':
      return 400;
    case 'TimeoutError':
      return 504;
    default:
      return 500;
  }
}

export function mapResultToReply<T>(
  result: Result<T, BasicError>,
  reply: FastifyReply,
  successStatus = 200,
  toPayload: (value: T) => unknown = (value) => ({
    data: value,
    ...(result._tag === 'ok' && result.messages ? { messages: result.messages } : {}),
  }),
) {
  if (isOk(result)) {
    return reply.code(successStatus).send(toPayload(result.value));
  }

  return reply.code(errorTypeToHttpStatus(result.error._type)).send({
    error: {
      type: result.error._type,
      message: result.error.message,
    },
  });
}
