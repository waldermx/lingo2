/**
 * @file src/domain/ports/outbound/IGamificationRepository.ts
 * @description Outbound port for gamification state persistence.
 */

import type { UserGamification } from '../../entities/Gamification.js';

export interface IUnlockedAchievement {
  achievementId: string;
  unlockedAt: Date;
}

export interface IGamificationRepository {
  /** Get or create the gamification record for a user. */
  findOrCreateByUser(userId: string): Promise<UserGamification>;

  /** Update XP and streak after a review session. */
  update(gamification: UserGamification): Promise<UserGamification>;

  /**
   * Record an achievement unlock for a user.
   * Safe to call if already unlocked (idempotent — no duplicate insert).
   */
  unlockAchievement(userId: string, achievementId: string): Promise<void>;

  /** Return all achievement IDs already unlocked by the user. */
  getUnlockedAchievementIds(userId: string): Promise<string[]>;

  /** Return all unlocked achievements with their unlock timestamps. */
  getUnlockedAchievements(userId: string): Promise<IUnlockedAchievement[]>;
}
