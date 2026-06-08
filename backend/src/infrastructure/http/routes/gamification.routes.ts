import type { FastifyInstance } from 'fastify';
import { GamificationRepository } from '../../database/prisma/repositories/GamificationRepository.js';
import { CardRepository } from '../../database/prisma/repositories/CardRepository.js';
import { CharacterRepository } from '../../database/prisma/repositories/CharacterRepository.js';
import { GetGamificationProgress } from '../../../application/gamification/GetGamificationProgress.js';
import { GetAchievements } from '../../../application/gamification/GetAchievements.js';
import { SupportedLocale } from '@lingo2/shared';

export async function registerGamificationRoutes(app: FastifyInstance): Promise<void> {
  const gamificationRepo = new GamificationRepository(app.prisma);
  const cardRepo = new CardRepository(app.prisma);
  const characterRepo = new CharacterRepository(app.prisma);

  app.get(
    '/gamification/progress',
    {
      preHandler: [app.authenticate],
      schema: { tags: ['Gamification'], summary: 'Get user XP, level, streak and HSK progress' },
    },
    async (request, reply) => {
      const useCase = new GetGamificationProgress(gamificationRepo, cardRepo, characterRepo);
      const data = await useCase.execute(request.user.id);
      return reply.send({ data });
    },
  );

  app.get(
    '/gamification/achievements',
    {
      preHandler: [app.authenticate],
      schema: { tags: ['Gamification'], summary: 'Get all achievements (locked and unlocked)' },
    },
    async (request, reply) => {
      const locale = (request.user as { preferredLocale?: string }).preferredLocale === 'en'
        ? 'en'
        : 'es';
      const useCase = new GetAchievements(gamificationRepo);
      const data = await useCase.execute(request.user.id, locale);
      return reply.send({ data });
    },
  );
}
