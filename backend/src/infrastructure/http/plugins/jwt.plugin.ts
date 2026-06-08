/**
 * @file src/infrastructure/http/plugins/jwt.plugin.ts
 * @description JWT plugin registration with access + refresh token support.
 *
 * Two separate JWT namespaces:
 *   - Default (`fastify.jwt`): Access tokens (short-lived, 15 minutes)
 *   - Refresh (`fastify.refreshJwt`): Refresh tokens (long-lived, 7 days)
 *
 * Access tokens are sent as Bearer in Authorization header.
 * Refresh tokens are sent in HttpOnly cookie (web) or request body (mobile).
 */

import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fastifyJwt from '@fastify/jwt';

export async function registerJwtPlugin(app: FastifyInstance): Promise<void> {
  // Access token JWT (15 min)
  await app.register(fastifyJwt, {
    secret: app.config.JWT_SECRET,
    sign: { expiresIn: '15m', algorithm: 'HS256' },
    namespace: 'access',
    jwtVerify: 'accessVerify',
    jwtSign: 'accessSign',
  });

  // Refresh token JWT (7 days)
  await app.register(fastifyJwt, {
    secret: app.config.JWT_REFRESH_SECRET,
    sign: { expiresIn: '7d', algorithm: 'HS256' },
    namespace: 'refresh',
    jwtVerify: 'refreshVerify',
    jwtSign: 'refreshSign',
  });

  // Decorator: authenticate(request, reply) — call from protected routes
  app.decorate(
    'authenticate',
    async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
      try {
        await request.accessVerify();
      } catch {
        reply.code(401).send({
          error: {
            code: 'AUTH_INVALID_TOKEN',
            message: 'Invalid or expired access token.',
            requestId: request.id,
          },
        });
      }
    },
  );
}

// Augment Fastify types
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
  interface FastifyRequest {
    accessVerify: () => Promise<{ id: string; email: string; iat: number; exp: number }>;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { id: string; email: string };
    user: { id: string; email: string };
  }
  interface JWT {
    access: {
      sign(payload: object, options?: object): string;
      verify<T = unknown>(token: string, options?: object): Promise<T>;
    };
    refresh: {
      sign(payload: object, options?: object): string;
      verify<T = unknown>(token: string, options?: object): Promise<T>;
    };
  }
}
