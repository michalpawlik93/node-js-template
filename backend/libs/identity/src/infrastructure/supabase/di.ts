import { Container } from 'inversify';
import { bindOrRebind } from '@app/core';
import { SupabaseConfig } from './config';
import { IAuthenticationService, SupabaseAuthenticationService } from './supabaseAuthService';

export const AUTH_SERVICE_TOKEN = Symbol.for('IdentityAuthenticationService');
export const SUPABASE_CONFIG_TOKEN = Symbol.for('IdentitySupabaseConfig');

export const registerSupabaseDependencies = (
  container: Container,
  config: SupabaseConfig,
): void => {
  bindOrRebind(container, SUPABASE_CONFIG_TOKEN, () => {
    container.bind<SupabaseConfig>(SUPABASE_CONFIG_TOKEN).toConstantValue(config);
  });

  bindOrRebind(container, AUTH_SERVICE_TOKEN, () => {
    container
      .bind<IAuthenticationService>(AUTH_SERVICE_TOKEN)
      .toDynamicValue(() => new SupabaseAuthenticationService(config))
      .inSingletonScope();
  });
};
