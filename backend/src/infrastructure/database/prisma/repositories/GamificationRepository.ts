import type { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';
import type {
  IGamificationRepository,
  IUnlockedAchievement,
} from '../../../../domain/ports/outbound/IGamificationRepository.js';
import { UserGamification } from '../../../../domain/entities/Gamification.js';

export class GamificationRepository implements IGamificationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findOrCreateByUser(userId: string): Promise<UserGamification> {
    const row = await this.prisma.userGamification.upsert({
      where: { userId },
      create: { id: nanoid(), userId },
      update: {},
    });
    return this.toEntity(row);
  }

  async update(gamification: UserGamification): Promise<UserGamification> {
    const row = await this.prisma.userGamification.update({
      where: { id: gamification.id },
      data: {
        xpTotal: gamification.xpTotal,
        streakDays: gamification.streakDays,
        longestStreak: gamification.longestStreak,
        lastActivityDate: gamification.lastActivityDate,
      },
    });
    return this.toEntity(row);
  }

  async unlockAchievement(userId: string, achievementId: string): Promise<void> {
    await this.prisma.userAchievement.upsert({
      where: { userId_achievementId: { userId, achievementId } },
      create: { id: nanoid(), userId, achievementId },
      update: {},
    });
  }

  async getUnlockedAchievementIds(userId: string): Promise<string[]> {
    const rows = await this.prisma.userAchievement.findMany({
      where: { userId },
      select: { achievementId: true },
    });
    return rows.map((r) => r.achievementId);
  }

  async getUnlockedAchievements(userId: string): Promise<IUnlockedAchievement[]> {
    const rows = await this.prisma.userAchievement.findMany({
      where: { userId },
      select: { achievementId: true, unlockedAt: true },
    });
    return rows.map((r) => ({ achievementId: r.achievementId, unlockedAt: r.unlockedAt }));
  }

  private toEntity(row: {
    id: string;
    userId: string;
    xpTotal: number;
    streakDays: number;
    longestStreak: number;
    lastActivityDate: Date | null;
  }): UserGamification {
    return new UserGamification({
      id: row.id,
      userId: row.userId,
      xpTotal: row.xpTotal,
      streakDays: row.streakDays,
      longestStreak: row.longestStreak,
      lastActivityDate: row.lastActivityDate,
    });
  }
}
