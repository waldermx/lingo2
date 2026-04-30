import type { FastifyInstance } from 'fastify';

export async function registerGamificationRoutes(app: FastifyInstance): Promise<void> {
  app.get('/gamification/progress', { preHandler: [app.authenticate], schema: { tags: ['Gamification'], summary: 'Get user XP, level, streak and HSK progress' } },
    async (req, reply) => reply.code(501).send({ error: { code: 'NOT_IMPLEMENTED', message: 'Not yet implemented', requestId: req.id } }));

  app.get('/gamification/achievements', { preHandler: [app.authenticate], schema: { tags: ['Gamification'], summary: 'Get all achievements (locked and unlocked)' } },
    async (req, reply) => reply.code(501).send({ error: { code: 'NOT_IMPLEMENTED', message: 'Not yet implemented', requestId: req.id } }));
}
