import { Container } from 'inversify';
import {
  type ILogger,
  bindRequestContext,
  registerLogging,
  registerServiceBus,
  type LoggerConfig,
  RequestContext,
} from '@app/core';
import { PrismaModuleConfig, disconnectPrismaClient } from '@app/core/prisma';
import { registerIdentityCommandHandlers } from './application/features';
import { registerIdentityFacades } from './application/facades';
import { registerIdentityLogging } from './infrastructure/logging';
import { registerIdentityPrisma, registerIdentityRepository, IDENTITY_TOKENS } from './infrastructure/prisma';
import { registerSupabaseDependencies, SupabaseConfig } from './infrastructure/supabase';

export interface IdentityDomainConfig {
  prisma?: PrismaModuleConfig;
  supabase: SupabaseConfig;
}

export interface IdentityModuleConfig extends IdentityDomainConfig {
  logger: LoggerConfig;
  coreContainer?: Container;
  requestContext?: RequestContext;
}


export const createIdentityModuleContainer = (
  config: IdentityModuleConfig,
): Container => {
  const container = new Container();
  container.bind<Container>(Container).toConstantValue(container);

  bindRequestContext(container, config.requestContext);
  registerLogging(container, config.logger);
  registerServiceBus(container);

  registerIdentityDomain(container, {
    prisma: config.prisma,
    supabase: config.supabase,
  });

  return container;
};

export const registerIdentityDomain = (
  container: Container,
  config: IdentityDomainConfig,
): void => {
  registerIdentityLogging(container);
  registerIdentityPrisma(container, config.prisma);
  registerIdentityRepository(container);
  registerSupabaseDependencies(container, config.supabase);
  registerIdentityCommandHandlers(container);
  registerIdentityFacades(container);
};

export const connectIdentityInfrastructure = async (
  _container: Container,
  _logger: ILogger,
): Promise<void> => {
  return Promise.resolve();
};

export const disconnectIdentityInfrastructure = async (
  container: Container,
  logger: ILogger,
): Promise<void> => {
  try {
    await disconnectPrismaClient(container, IDENTITY_TOKENS.PRISMA_CLIENT);
  } catch (error) {
    logger.error({ error }, 'Error disconnecting identity infrastructure');
  }
};
