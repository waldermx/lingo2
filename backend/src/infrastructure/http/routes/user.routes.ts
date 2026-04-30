import type { FastifyInstance } from 'fastify';

export async function registerUserRoutes(app: FastifyInstance): Promise<void> {
  app.get('/users/me', { preHandler: [app.authenticate], schema: { tags: ['Users'], summary: 'Get current user profile' } },
    async (req, reply) => reply.code(501).send({ error: { code: 'NOT_IMPLEMENTED', message: 'Not yet implemented', requestId: req.id } }));

  app.patch('/users/me/settings', { preHandler: [app.authenticate], schema: { tags: ['Users'], summary: 'Update user settings (locale, daily goals)' } },
    async (req, reply) => reply.code(501).send({ error: { code: 'NOT_IMPLEMENTED', message: 'Not yet implemented', requestId: req.id } }));
}
