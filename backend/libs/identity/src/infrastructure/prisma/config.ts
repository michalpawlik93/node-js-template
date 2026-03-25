import { PrismaModuleConfig, buildPrismaModuleConfig } from '@app/core/prisma';

export const buildIdentityPrismaConfig = (): PrismaModuleConfig =>
  buildPrismaModuleConfig('identity', 'DATABASE_URL_IDENTITY');
