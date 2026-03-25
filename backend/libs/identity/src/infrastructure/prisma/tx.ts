import { AsyncLocalStorage } from 'node:async_hooks';
import { PrismaClient } from './generated/prisma';

const als = new AsyncLocalStorage<PrismaClient>();
let baseClient: PrismaClient | null = null;

export const setIdentityPrismaClient = (client: PrismaClient): void => {
  if (baseClient && baseClient !== client) {
    throw new Error('Identity Prisma client is already initialized');
  }

  baseClient = client;
};

const getIdentityBaseClient = (): PrismaClient => {
  if (!baseClient) {
    throw new Error('Identity Prisma client has not been initialized');
  }

  return baseClient;
};

export const identityDb = (): PrismaClient => {
  return als.getStore() ?? getIdentityBaseClient();
};

export const runInIdentityTx = async <T>(fn: () => Promise<T>): Promise<T> => {
  return getIdentityBaseClient().$transaction(async (tx) => {
    return als.run(tx as unknown as PrismaClient, fn);
  });
};
