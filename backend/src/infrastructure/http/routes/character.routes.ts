import type { FastifyInstance } from 'fastify';

export async function registerCharacterRoutes(app: FastifyInstance): Promise<void> {
  app.get('/characters', { preHandler: [app.authenticate], schema: { tags: ['Characters'], summary: 'List characters by HSK level (paginated)' } },
    async (req, reply) => reply.code(501).send({ error: { code: 'NOT_IMPLEMENTED', message: 'Not yet implemented', requestId: req.id } }));

  app.get('/characters/:id', { preHandler: [app.authenticate], schema: { tags: ['Characters'], summary: 'Get full character details' } },
    async (req, reply) => reply.code(501).send({ error: { code: 'NOT_IMPLEMENTED', message: 'Not yet implemented', requestId: req.id } }));
}
