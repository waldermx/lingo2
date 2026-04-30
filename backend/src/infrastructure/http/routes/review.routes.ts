// Stub routes — implemented in Iter 4/5
import type { FastifyInstance } from 'fastify';

export async function registerReviewRoutes(app: FastifyInstance): Promise<void> {
  app.get('/review/due', { preHandler: [app.authenticate], schema: { tags: ['Review'], summary: 'Get due cards for review session' } },
    async (req, reply) => reply.code(501).send({ error: { code: 'NOT_IMPLEMENTED', message: 'Not yet implemented', requestId: req.id } }));

  app.post('/review/submit', { preHandler: [app.authenticate], schema: { tags: ['Review'], summary: 'Submit binary review result from HanziWriter' } },
    async (req, reply) => reply.code(501).send({ error: { code: 'NOT_IMPLEMENTED', message: 'Not yet implemented', requestId: req.id } }));

  app.get('/review/stats', { preHandler: [app.authenticate], schema: { tags: ['Review'], summary: 'Get review statistics and activity heatmap' } },
    async (req, reply) => reply.code(501).send({ error: { code: 'NOT_IMPLEMENTED', message: 'Not yet implemented', requestId: req.id } }));

  app.get('/review/forecast', { preHandler: [app.authenticate], schema: { tags: ['Review'], summary: 'Get scheduled card count for the next 14 days' } },
    async (req, reply) => reply.code(501).send({ error: { code: 'NOT_IMPLEMENTED', message: 'Not yet implemented', requestId: req.id } }));
}
