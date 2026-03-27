import type { FastifyInstance } from 'fastify';

interface FastifyErrorShape extends Error {
  statusCode?: number;
  code?: string;
  validation?: unknown;
}

export function registerErrorHandler(app: FastifyInstance): void {
  app.setErrorHandler((error, _request, reply) => {
    const fastifyError = error as FastifyErrorShape;

    if (fastifyError.validation) {
      reply.code(400).send({
        error: {
          type: 'ValidationError',
          message: fastifyError.message,
        },
      });
      return;
    }

    if (
      fastifyError.statusCode === 429 ||
      fastifyError.code === 'FST_ERR_RATE_LIMIT'
    ) {
      reply.code(429).send({
        error: {
          type: 'RateLimitError',
          message: fastifyError.message,
        },
      });
      return;
    }

    reply.code(500).send({
      error: {
        type: 'SystemError',
        message: 'Internal Server Error',
      },
    });
  });
}
