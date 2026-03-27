export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt?: number;
}

export interface AuthPrincipal {
  userId: string;
  email: string;
  roles: string[];
  permissions: string[];
}

export interface UserProfile {
  id: string;
  email: string;
  createdAt: string;
  lastLoginAt?: string;
}
