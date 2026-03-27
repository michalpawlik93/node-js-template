import { apiClient } from '@/shared/lib/apiClient';
import { toAppError } from '@/shared/errors/mapApiError';
import type { ApiSuccessResponse } from '@/shared/types/ApiResponse';
import type {
  AuthPrincipal,
  AuthSession,
  LoginPayload,
  RegisterPayload,
  UserProfile,
} from '@/features/auth/types/Auth';

export class AuthService {
  private static async withErrorMapping<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      throw toAppError(error);
    }
  }

  static async login(payload: LoginPayload): Promise<{
    session: AuthSession;
    principal: AuthPrincipal;
  }> {
    return this.withErrorMapping(async () => {
      const response = await apiClient.post<
        ApiSuccessResponse<{ session: AuthSession; principal: AuthPrincipal }>
      >('/auth/login', payload);
      return response.data.data;
    });
  }

  static async register(payload: RegisterPayload): Promise<{ userId: string; email: string }> {
    return this.withErrorMapping(async () => {
      const response = await apiClient.post<ApiSuccessResponse<{ userId: string; email: string }>>(
        '/auth/register',
        payload,
      );
      return response.data.data;
    });
  }

  static async logout(): Promise<void> {
    return this.withErrorMapping(async () => {
      await apiClient.post('/auth/logout');
    });
  }

  static async refresh(refreshToken: string): Promise<AuthSession> {
    return this.withErrorMapping(async () => {
      const response = await apiClient.post<ApiSuccessResponse<{ session: AuthSession }>>(
        '/auth/refresh',
        { refreshToken },
      );
      return response.data.data.session;
    });
  }

  static async me(): Promise<AuthPrincipal> {
    return this.withErrorMapping(async () => {
      const response = await apiClient.get<ApiSuccessResponse<AuthPrincipal>>('/auth/me');
      return response.data.data;
    });
  }

  static async profile(): Promise<UserProfile> {
    return this.withErrorMapping(async () => {
      const response = await apiClient.get<ApiSuccessResponse<UserProfile>>('/auth/profile');
      return response.data.data;
    });
  }
}
