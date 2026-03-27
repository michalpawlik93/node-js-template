import { IN_MEMORY_TRANSPORT, isErr } from '@app/core';
import type { IIdentityFacade } from '@app/integration-contracts';
import type { FastifyReply, FastifyRequest } from 'fastify';
import '../types';
import { extractBearerToken } from '../utils/tokenUtils';

const unauthorizedResponse = (reply: FastifyReply, message: string) =>
  reply.code(401).send({
    error: {
      type: 'UnauthorizedError',
      message,
    },
  });

export const createAuthenticate =
  (identityFacade: IIdentityFacade) =>
  async (request: FastifyRequest, reply: FastifyReply) => {
    const accessToken = extractBearerToken(request);
    if (!accessToken) {
      return unauthorizedResponse(reply, 'Bearer token is required.');
    }

    const result = await identityFacade.getCurrentUser(
      { accessToken },
      { via: IN_MEMORY_TRANSPORT },
    );

    if (isErr(result)) {
      return unauthorizedResponse(reply, result.error.message);
    }

    request.principal = result.value;
    return undefined;
  };
