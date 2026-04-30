/**
 * @file src/shared/AppError.ts
 * @description Base error hierarchy for the application.
 *
 * All domain and application errors extend AppError so that the HTTP layer
 * can map them to appropriate status codes without importing domain packages.
 *
 * Error code naming convention: SCREAMING_SNAKE_CASE, prefixed by domain.
 *   e.g., AUTH_INVALID_CREDENTIALS, REVIEW_CARD_NOT_FOUND, USER_ALREADY_EXISTS
 */

/** Base class for all application errors. */
export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number = 500,
  ) {
    super(message);
    this.name = this.constructor.name;
    // Fix prototype chain for instanceof checks when compiling to ES5
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// ─── Auth Errors ─────────────────────────────────────────────────────────────

export class AuthError extends AppError {
  constructor(code: string, message: string) {
    super(code, message, 401);
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor() {
    super('AUTH_INVALID_CREDENTIALS', 'Email or password is incorrect.');
  }
}

export class InvalidTokenError extends AuthError {
  constructor() {
    super('AUTH_INVALID_TOKEN', 'The provided token is invalid or has expired.');
  }
}

export class TokenExpiredError extends AuthError {
  constructor() {
    super('AUTH_TOKEN_EXPIRED', 'The session has expired. Please log in again.');
  }
}

// ─── User Errors ─────────────────────────────────────────────────────────────

export class UserAlreadyExistsError extends AppError {
  constructor() {
    super('USER_ALREADY_EXISTS', 'An account with this email already exists.', 409);
  }
}

export class UserNotFoundError extends AppError {
  constructor() {
    super('USER_NOT_FOUND', 'User not found.', 404);
  }
}

export class OnboardingAlreadyCompletedError extends AppError {
  constructor() {
    super('ONBOARDING_ALREADY_COMPLETED', 'Onboarding has already been completed.', 409);
  }
}

// ─── Review / Card Errors ─────────────────────────────────────────────────────

export class CardNotFoundError extends AppError {
  constructor() {
    super('REVIEW_CARD_NOT_FOUND', 'The review card was not found.', 404);
  }
}

export class CardNotOwnedByUserError extends AppError {
  constructor() {
    super('REVIEW_CARD_NOT_OWNED', 'You do not have access to this card.', 403);
  }
}

// ─── Character Errors ────────────────────────────────────────────────────────

export class CharacterNotFoundError extends AppError {
  constructor() {
    super('CHARACTER_NOT_FOUND', 'Character not found.', 404);
  }
}

// ─── Validation Errors ───────────────────────────────────────────────────────

export class ValidationError extends AppError {
  constructor(
    message: string,
    public readonly details?: Record<string, string[]>,
  ) {
    super('VALIDATION_ERROR', message, 400);
  }
}
