import { BasicError } from '@app/core';

export class IdentityAuthError extends Error implements BasicError {
  readonly _type = 'IdentityAuthError';

  constructor(message: string, public readonly cause?: unknown) {
    super(message);
  }
}

export class IdentityNotFoundError extends Error implements BasicError {
  readonly _type = 'IdentityNotFoundError';

  constructor(message: string, public readonly cause?: unknown) {
    super(message);
  }
}

export class IdentityForbiddenError extends Error implements BasicError {
  readonly _type = 'IdentityForbiddenError';

  constructor(message: string, public readonly cause?: unknown) {
    super(message);
  }
}
