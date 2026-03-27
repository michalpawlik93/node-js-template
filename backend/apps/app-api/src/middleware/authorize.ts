import type { FastifyReply, FastifyRequest } from 'fastify';
import '../types';

const forbidden = (reply: FastifyReply, message: string) =>
  reply.code(403).send({
    error: {
      type: 'ForbiddenError',
      message,
    },
  });

export const requireRole =
  (role: string) => async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.principal?.roles.includes(role)) {
      return forbidden(reply, `Missing role: ${role}`);
    }

    return undefined;
  };

export const requirePermission =
  (permission: string) =>
  async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.principal?.permissions.includes(permission)) {
      return forbidden(reply, `Missing permission: ${permission}`);
    }

    return undefined;
  };
