export interface User {
  id: string;
  email: string;
  createdAt: Date;
  lastLoginAt?: Date;
}

export const createUser = (params: {
  id: string;
  email: string;
  createdAt?: Date;
  lastLoginAt?: Date;
}): User => ({
  id: params.id,
  email: params.email,
  createdAt: params.createdAt ?? new Date(),
  lastLoginAt: params.lastLoginAt,
});
