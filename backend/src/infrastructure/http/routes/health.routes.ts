/**
 * @file src/infrastructure/http/routes/health.routes.ts
 * @description Health check endpoints for liveness and readiness probes.
 *
 * /health  — liveness probe: is the process alive?
 * /ready   — readiness probe: can the app serve traffic? (checks DB connection)
 *
 * Both are used by Docker Compose health checks and Dokploy/Traefik.
 */

import type { FastifyInstance } from 'fastify';
import type { PrismaClient } from '@prisma/client';

export async function registerHealthRoutes(app: FastifyInstance): Promise<void> {
  /** GET /api/v1/health — liveness probe */
  app.get(
    '/health',
    {
      config: { rateLimit: { max: 600, timeWindow: '1 minute' } },
      schema: {
        tags: ['Health'],
        summary: 'Liveness probe',
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string' },
              version: { type: 'string' },
              timestamp: { type: 'string' },
            },
          },
        },
      },
    },
    () => ({
      status: 'ok',
      version: process.env['npm_package_version'] ?? '0.1.0',
      timestamp: new Date().toISOString(),
    }),
  );

  /** GET /api/v1/ready — readiness probe: verifies DB is reachable */
  app.get(
    '/ready',
    {
      config: { rateLimit: { max: 120, timeWindow: '1 minute' } },
      schema: {
        tags: ['Health'],
        summary: 'Readiness probe — verifies database connectivity',
      },
    },
    async (request, reply) => {
      try {
        const prisma = (app as unknown as { prisma: PrismaClient }).prisma;
        await prisma.$queryRaw`SELECT 1`;
        return { status: 'ready', database: 'connected' };
      } catch (err) {
        request.log.error({ err }, 'Readiness probe failed — database unreachable');
        return reply.code(503).send({
          error: {
            code: 'SERVICE_UNAVAILABLE',
            message: 'Database is not reachable.',
            requestId: request.id,
          },
        });
      }
    },
  );
}
