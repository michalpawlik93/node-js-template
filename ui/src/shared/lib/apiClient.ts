import axios, {
  AxiosError,
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from 'axios';
import type { ApiSuccessResponse } from '@/shared/types/ApiResponse';
import type { AuthSession } from '@/features/auth/types/Auth';

const ACCESS_TOKEN_KEY = 'auth.accessToken';
const REFRESH_TOKEN_KEY = 'auth.refreshToken';
const SESSION_KEY = 'auth.session';
const PRINCIPAL_KEY = 'auth.principal';

interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const baseURL = import.meta.env.VITE_API_URL;

const refreshClient = axios.create({ baseURL });
let refreshRequest: Promise<string | null> | null = null;

const readAccessToken = (): string | null => localStorage.getItem(ACCESS_TOKEN_KEY);
const readRefreshToken = (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY);

const persistSession = (session: AuthSession): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken);
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

const clearSession = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(PRINCIPAL_KEY);
};

const getRefreshPromise = (): Promise<string | null> => {
  if (refreshRequest) {
    return refreshRequest;
  }

  const refreshToken = readRefreshToken();
  if (!refreshToken) {
    return Promise.resolve(null);
  }

  refreshRequest = refreshClient
    .post<ApiSuccessResponse<{ session: AuthSession }>>('/auth/refresh', { refreshToken })
    .then((response) => {
      const session = response.data.data.session;
      persistSession(session);
      return session.accessToken;
    })
    .catch(() => {
      clearSession();
      return null;
    })
    .finally(() => {
      refreshRequest = null;
    });

  return refreshRequest;
};

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = readAccessToken();
  if (token) {
    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequestConfig | undefined;
    const status = error.response?.status;
    const requestUrl = originalRequest?.url ?? '';

    if (!originalRequest || status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (requestUrl.includes('/auth/login') || requestUrl.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    const nextToken = await getRefreshPromise();

    if (!nextToken) {
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    if (!originalRequest.headers) {
      originalRequest.headers = new AxiosHeaders();
    }
    originalRequest.headers.set('Authorization', `Bearer ${nextToken}`);

    return apiClient.request(originalRequest);
  },
);
