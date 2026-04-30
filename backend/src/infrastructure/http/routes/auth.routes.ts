/**
 * @file src/infrastructure/http/routes/auth.routes.ts
 * @description Authentication route definitions.
 *
 * POST /auth/register    — Create account with email + password
 * POST /auth/login       — Login with email + password
 * POST /auth/refresh     — Rotate refresh token
 * POST /auth/logout      — Invalidate session (protected)
 * GET  /auth/google      — Redirect to Google consent screen
 * GET  /auth/google/callback — Handle Google OAuth callback
 *
 * NOTE: Full implementation in Iter 4/5. Stubs here for compilation.
 */

import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

const RegisterBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  displayName: z.string().min(1).max(50),
});

const LoginBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function registerAuthRoutes(app: FastifyInstance): Promise<void> {
  /** POST /api/v1/auth/register */
  app.post(
    '/auth/register',
    {
      config: { rateLimit: { max: 10, timeWindow: '1 minute' } },
      schema: {
        tags: ['Auth'],
        summary: 'Register a new account',
        body: {
          type: 'object',
          required: ['email', 'password', 'displayName'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8 },
            displayName: { type: 'string', minLength: 1 },
          },
        },
      },
    },
    async (request, reply) => {
      const _body = RegisterBodySchema.parse(request.body);
      // TODO: wire to RegisterUser use case in Iter 4
      return reply.code(501).send({
        error: { code: 'NOT_IMPLEMENTED', message: 'Register not yet implemented', requestId: request.id },
      });
    },
  );

  /** POST /api/v1/auth/login */
  app.post(
    '/auth/login',
    {
      config: { rateLimit: { max: 10, timeWindow: '1 minute' } },
      schema: {
        tags: ['Auth'],
        summary: 'Login with email and password',
      },
    },
    async (request, reply) => {
      LoginBodySchema.parse(request.body);
      return reply.code(501).send({
        error: { code: 'NOT_IMPLEMENTED', message: 'Login not yet implemented', requestId: request.id },
      });
    },
  );

  /** POST /api/v1/auth/refresh */
  app.post('/auth/refresh', { schema: { tags: ['Auth'], summary: 'Rotate refresh token' } },
    async (request, reply) => {
      return reply.code(501).send({
        error: { code: 'NOT_IMPLEMENTED', message: 'Refresh not yet implemented', requestId: request.id },
      });
    },
  );

  /** POST /api/v1/auth/logout */
  app.post('/auth/logout', {
    preHandler: [app.authenticate],
    schema: { tags: ['Auth'], summary: 'Logout and invalidate session', security: [{ BearerAuth: [] }] },
  }, async (request, reply) => {
    return reply.code(501).send({
      error: { code: 'NOT_IMPLEMENTED', message: 'Logout not yet implemented', requestId: request.id },
    });
  });
}
