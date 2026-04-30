/**
 * @file src/infrastructure/http/middleware/error-handler.ts
 * @description Global Fastify error handler.
 *
 * Responsibility:
 *   1. Map domain AppError subclasses to proper HTTP status codes.
 *   2. Map Zod validation errors to 400 with field-level details.
 *   3. Never expose internal stack traces in production.
 *   4. Always include the `requestId` for log correlation.
 *   5. Log server errors (5xx) at `error` level; client errors at `warn`.
 */

import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { AppError } from '../../../shared/AppError.js';

export function errorHandler(
  error: FastifyError | AppError | ZodError | Error,
  request: FastifyRequest,
  reply: FastifyReply,
): void {
  const isProd = process.env['NODE_ENV'] === 'production';
  const requestId = request.id;

  // ── Zod validation errors ─────────────────────────────────────────────────
  if (error instanceof ZodError) {
    const details: Record<string, string[]> = {};
    for (const issue of error.issues) {
      const path = issue.path.join('.') || 'root';
      details[path] = [...(details[path] ?? []), issue.message];
    }

    request.log.warn({ requestId, details }, 'Validation error');
    reply.code(400).send({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed.',
        details,
        requestId,
      },
    });
    return;
  }

  // ── Domain / Application errors ───────────────────────────────────────────
  if (error instanceof AppError) {
    const level = error.statusCode >= 500 ? 'error' : 'warn';
    request.log[level]({ requestId, code: error.code }, error.message);

    reply.code(error.statusCode).send({
      error: {
        code: error.code,
        message: error.message,
        requestId,
      },
    });
    return;
  }

  // ── Fastify built-in errors (e.g., 404 route not found, 405 method not allowed) ──
  const fastifyError = error as FastifyError;
  if (fastifyError.statusCode && fastifyError.statusCode < 500) {
    request.log.warn({ requestId }, fastifyError.message);
    reply.code(fastifyError.statusCode).send({
      error: {
        code: fastifyError.code ?? 'CLIENT_ERROR',
        message: fastifyError.message,
        requestId,
      },
    });
    return;
  }

  // ── Unexpected server error ───────────────────────────────────────────────
  request.log.error(
    { requestId, err: isProd ? undefined : error },
    'Unexpected server error',
  );

  reply.code(500).send({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: isProd
        ? 'An unexpected error occurred. Our team has been notified.'
        : error.message,
      requestId,
    },
  });
}
