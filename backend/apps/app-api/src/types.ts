import type { UserPrincipalContract } from '@app/integration-contracts';

declare module 'fastify' {
  interface FastifyRequest {
    principal?: UserPrincipalContract;
  }
}
