import cors from '@fastify/cors';
import type { FastifyInstance } from 'fastify';

export async function registerCors(
  app: FastifyInstance,
  corsOrigin: string,
): Promise<void> {
  await app.register(cors, {
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  });
}
