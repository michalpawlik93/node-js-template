import { create } from 'zustand';
import { AuthService } from '@/features/auth/services/AuthService';
import type {
  AuthPrincipal,
  AuthSession,
  LoginPayload,
  RegisterPayload,
} from '@/features/auth/types/Auth';

const ACCESS_TOKEN_KEY = 'auth.accessToken';
const REFRESH_TOKEN_KEY = 'auth.refreshToken';
const SESSION_KEY = 'auth.session';
const PRINCIPAL_KEY = 'auth.principal';

interface AuthState {
  user: AuthPrincipal | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  hydrate: () => Promise<void>;
}

const persist = (session: AuthSession, user: AuthPrincipal): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken);
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  localStorage.setItem(PRINCIPAL_KEY, JSON.stringify(user));
};

const clearPersisted = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(PRINCIPAL_KEY);
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: false,
  login: async (payload) => {
    set({ isLoading: true });
    try {
      const { session, principal } = await AuthService.login(payload);
      persist(session, principal);
      set({
        user: principal,
        session,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      clearPersisted();
      set({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
      });
      throw error;
    }
  },
  register: async (payload) => {
    set({ isLoading: true });
    try {
      await AuthService.register(payload);
      await get().login(payload);
    } finally {
      set({ isLoading: false });
    }
  },
  logout: async () => {
    try {
      await AuthService.logout();
    } finally {
      clearPersisted();
      set({
        user: null,
        session: null,
        isAuthenticated: false,
      });
    }
  },
  refreshSession: async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      clearPersisted();
      set({ user: null, session: null, isAuthenticated: false });
      return false;
    }

    try {
      const session = await AuthService.refresh(refreshToken);
      const principal = await AuthService.me();
      persist(session, principal);
      set({
        user: principal,
        session,
        isAuthenticated: true,
      });
      return true;
    } catch {
      clearPersisted();
      set({ user: null, session: null, isAuthenticated: false });
      return false;
    }
  },
  hydrate: async () => {
    set({ isLoading: true });
    try {
      const sessionRaw = localStorage.getItem(SESSION_KEY);
      const principalRaw = localStorage.getItem(PRINCIPAL_KEY);
      if (!sessionRaw || !principalRaw) {
        set({ isLoading: false });
        return;
      }

      const session = JSON.parse(sessionRaw) as AuthSession;
      const user = JSON.parse(principalRaw) as AuthPrincipal;
      set({
        session,
        user,
        isAuthenticated: true,
      });

      await get().refreshSession();
    } finally {
      set({ isLoading: false });
    }
  },
}));
