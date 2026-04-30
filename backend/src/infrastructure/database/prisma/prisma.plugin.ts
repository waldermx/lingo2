/**
 * @file src/infrastructure/database/prisma/prisma.plugin.ts
 * @description Fastify plugin that provides a shared PrismaClient instance.
 *
 * The client is created once per process and decorated onto the Fastify instance.
 * On shutdown (SIGTERM/SIGINT), the client is disconnected gracefully.
 */

import fp from 'fastify-plugin';
import { PrismaClient } from '@prisma/client';
import type { FastifyInstance } from 'fastify';

async function prismaPlugin(app: FastifyInstance): Promise<void> {
  const prisma = new PrismaClient({
    log: process.env['NODE_ENV'] === 'development' ? ['query', 'warn', 'error'] : ['warn', 'error'],
  });

  await prisma.$connect();
  app.log.info('Prisma client connected');

  app.decorate('prisma', prisma);

  app.addHook('onClose', async () => {
    await prisma.$disconnect();
    app.log.info('Prisma client disconnected');
  });
}

export const registerPrismaPlugin = fp(prismaPlugin, {
  name: 'prisma',
  fastify: '5.x',
});

// Augment Fastify types
declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}
