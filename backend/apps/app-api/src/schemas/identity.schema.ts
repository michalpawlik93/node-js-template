import { Type, type Static } from '@sinclair/typebox';
import { ErrorResponse, SuccessResponse } from './common.schema';

export const LoginBody = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 6 }),
});

export const RegisterBody = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 6 }),
});

export const RefreshTokenBody = Type.Object({
  refreshToken: Type.String(),
});

export const Session = Type.Object({
  accessToken: Type.String(),
  refreshToken: Type.String(),
  expiresAt: Type.Optional(Type.Number()),
});

export const Principal = Type.Object({
  userId: Type.String(),
  email: Type.String({ format: 'email' }),
  roles: Type.Array(Type.String()),
  permissions: Type.Array(Type.String()),
});

export const LoginData = Type.Object({
  session: Session,
  principal: Principal,
});

export const RegisterData = Type.Object({
  userId: Type.String(),
  email: Type.String({ format: 'email' }),
});

export const RefreshTokenData = Type.Object({
  session: Session,
});

export const UserProfileData = Type.Object({
  id: Type.String(),
  email: Type.String({ format: 'email' }),
  createdAt: Type.String({ format: 'date-time' }),
  lastLoginAt: Type.Optional(Type.String({ format: 'date-time' })),
});

export const registerRouteSchema = {
  body: RegisterBody,
  response: {
    200: SuccessResponse(RegisterData),
    400: ErrorResponse,
    500: ErrorResponse,
  },
};

export const loginRouteSchema = {
  body: LoginBody,
  response: {
    200: SuccessResponse(LoginData),
    400: ErrorResponse,
    401: ErrorResponse,
    500: ErrorResponse,
  },
};

export const logoutRouteSchema = {
  response: {
    200: SuccessResponse(Type.Null()),
    401: ErrorResponse,
    500: ErrorResponse,
  },
};

export const refreshTokenRouteSchema = {
  body: RefreshTokenBody,
  response: {
    200: SuccessResponse(RefreshTokenData),
    400: ErrorResponse,
    401: ErrorResponse,
    500: ErrorResponse,
  },
};

export const getCurrentUserRouteSchema = {
  response: {
    200: SuccessResponse(Principal),
    401: ErrorResponse,
  },
};

export const getUserProfileRouteSchema = {
  response: {
    200: SuccessResponse(UserProfileData),
    401: ErrorResponse,
    404: ErrorResponse,
    500: ErrorResponse,
  },
};

export type LoginBodyType = Static<typeof LoginBody>;
export type RegisterBodyType = Static<typeof RegisterBody>;
export type RefreshTokenBodyType = Static<typeof RefreshTokenBody>;
