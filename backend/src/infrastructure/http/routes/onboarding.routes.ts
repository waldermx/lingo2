import type { FastifyInstance } from 'fastify';

export async function registerOnboardingRoutes(app: FastifyInstance): Promise<void> {
  app.post('/onboarding', { preHandler: [app.authenticate], schema: { tags: ['Onboarding'], summary: 'Complete the mandatory onboarding flow' } },
    async (req, reply) => reply.code(501).send({ error: { code: 'NOT_IMPLEMENTED', message: 'Not yet implemented', requestId: req.id } }));
}
