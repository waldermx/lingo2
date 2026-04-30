/**
 * @file src/infrastructure/http/plugins/env.plugin.ts
 * @description Environment variable validation and type-safe config plugin.
 *
 * Uses @fastify/env with JSON Schema to validate all required env vars at startup.
 * The app will refuse to start if any required variable is missing.
 */

import type { FastifyInstance } from 'fastify';
import fastifyEnv from '@fastify/env';

const schema = {
  type: 'object',
  required: ['DATABASE_URL', 'JWT_SECRET', 'JWT_REFRESH_SECRET'],
  properties: {
    NODE_ENV: { type: 'string', default: 'development' },
    PORT: { type: 'number', default: 3000 },
    LOG_LEVEL: { type: 'string', default: 'info' },
    DATABASE_URL: { type: 'string' },
    JWT_SECRET: { type: 'string', minLength: 32 },
    JWT_REFRESH_SECRET: { type: 'string', minLength: 32 },
    GOOGLE_CLIENT_ID: { type: 'string', default: '' },
    GOOGLE_CLIENT_SECRET: { type: 'string', default: '' },
    GOOGLE_CALLBACK_URL: {
      type: 'string',
      default: 'http://localhost:3000/api/v1/auth/google/callback',
    },
    ALLOWED_ORIGINS: { type: 'string', default: 'http://localhost:5173' },
  },
};

export async function registerEnvPlugin(app: FastifyInstance): Promise<void> {
  await app.register(fastifyEnv, { schema, dotenv: true });
}
