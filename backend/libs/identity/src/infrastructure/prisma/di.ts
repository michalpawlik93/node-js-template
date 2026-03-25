import { Container } from 'inversify';
import { bindOrRebind } from '@app/core';
import { PrismaModuleConfig } from '@app/core/prisma';
import { PrismaClient } from './generated/prisma';
import { createIdentityPrisma } from './client';
import { setIdentityPrismaClient } from './tx';
import {
  USER_PROFILE_REPOSITORY_KEY,
  IUserProfileRepository,
  UserProfileRepository,
} from './userProfile.repository';
import { IRoleRepository, ROLE_REPOSITORY_KEY, RoleRepository } from './role.repository';
import {
  IPermissionRepository,
  PERMISSION_REPOSITORY_KEY,
  PermissionRepository,
} from './permission.repository';
import { IUserRoleRepository, USER_ROLE_REPOSITORY_KEY, UserRoleRepository } from './userRole.repository';

export const IDENTITY_TOKENS = {
  PRISMA_CONFIG: Symbol.for('IdentityPrismaConfig'),
  PRISMA_CLIENT: Symbol.for('IdentityPrismaClient'),
};

export const registerIdentityPrisma = (
  container: Container,
  config?: PrismaModuleConfig,
): PrismaClient => {
  const client = createIdentityPrisma(config);

  bindOrRebind(container, IDENTITY_TOKENS.PRISMA_CONFIG, () => {
    container
      .bind<PrismaModuleConfig | undefined>(IDENTITY_TOKENS.PRISMA_CONFIG)
      .toConstantValue(config);
  });

  bindOrRebind(container, IDENTITY_TOKENS.PRISMA_CLIENT, () => {
    container.bind<PrismaClient>(IDENTITY_TOKENS.PRISMA_CLIENT).toConstantValue(client);
  });

  setIdentityPrismaClient(client);

  return client;
};

export const registerIdentityRepository = (container: Container): void => {
  bindOrRebind(container, USER_PROFILE_REPOSITORY_KEY, () => {
    container
      .bind<IUserProfileRepository>(USER_PROFILE_REPOSITORY_KEY)
      .to(UserProfileRepository)
      .inSingletonScope();
  });

  bindOrRebind(container, ROLE_REPOSITORY_KEY, () => {
    container.bind<IRoleRepository>(ROLE_REPOSITORY_KEY).to(RoleRepository).inSingletonScope();
  });

  bindOrRebind(container, PERMISSION_REPOSITORY_KEY, () => {
    container
      .bind<IPermissionRepository>(PERMISSION_REPOSITORY_KEY)
      .to(PermissionRepository)
      .inSingletonScope();
  });

  bindOrRebind(container, USER_ROLE_REPOSITORY_KEY, () => {
    container
      .bind<IUserRoleRepository>(USER_ROLE_REPOSITORY_KEY)
      .to(UserRoleRepository)
      .inSingletonScope();
  });
};
