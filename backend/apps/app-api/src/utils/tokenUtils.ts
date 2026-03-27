import type { FastifyRequest } from 'fastify';

export function extractBearerToken(
  request: Pick<FastifyRequest, 'headers'>,
): string | null {
  const authorizationHeader = request.headers.authorization;
  const headerValue = Array.isArray(authorizationHeader)
    ? authorizationHeader[0]
    : authorizationHeader;

  if (!headerValue) {
    return null;
  }

  const match = headerValue.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}
