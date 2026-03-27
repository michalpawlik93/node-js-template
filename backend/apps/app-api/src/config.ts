import {
  type LoggerConfig,
  loadEnvironment,
  resolveLogFilePath,
  resolveLogLevel as resolveLogLevelValue,
  resolvePositiveInt,
} from '@app/core';
import type { SupabaseConfig } from '@app/identity';

const environment = loadEnvironment('app-api');

export interface ApiConfig {
  port: number;
  host: string;
  corsOrigin: string;
}

export const resolveLogLevel = (value?: string | null) =>
  resolveLogLevelValue(environment, value);

const LOGS_DIRECTORY = 'logs/app-api';

const buildModuleLoggerConfig = (
  moduleName: string,
  filePath?: string | null,
): LoggerConfig => ({
  level: resolveLogLevelValue(environment, process.env.LOG_LEVEL),
  filePath: resolveLogFilePath(moduleName, filePath, {
    allowAbsolute: true,
    logsDirectory: LOGS_DIRECTORY,
  }),
  prettyInDev: environment !== 'production',
});

export const buildProductsLoggerConfig = (): LoggerConfig =>
  buildModuleLoggerConfig('products', process.env.PRODUCTS_LOG_FILE_PATH);

export const buildIdentityLoggerConfig = (): LoggerConfig =>
  buildModuleLoggerConfig('identity', process.env.IDENTITY_LOG_FILE_PATH);

export const buildCoreLoggerConfig = (): LoggerConfig =>
  buildModuleLoggerConfig(
    'core',
    process.env.CORE_LOG_FILE_PATH ?? process.env.LOG_FILE_PATH,
  );

export const buildSupabaseConfig = (): SupabaseConfig => {
  const url = process.env.SUPABASE_URL?.trim();
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !publishableKey || !serviceRoleKey) {
    throw new Error(
      'Supabase config is not fully configured. Set SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, and SUPABASE_SERVICE_ROLE_KEY.',
    );
  }

  return {
    url,
    publishableKey,
    serviceRoleKey,
  };
};

export const buildApiConfig = (): ApiConfig => ({
  port: resolvePositiveInt(process.env.API_PORT) ?? 3000,
  host: process.env.API_HOST?.trim() || '0.0.0.0',
  corsOrigin: process.env.API_CORS_ORIGIN?.trim() || '*',
});

export const getEnvironment = (): string => environment;
