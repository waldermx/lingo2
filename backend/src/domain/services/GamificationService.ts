/**
 * @file src/domain/services/GamificationService.ts
 * @description Pure domain service for XP, streak, level, and achievement logic.
 *
 * All methods are stateless functions over domain objects — no I/O, no side effects.
 * The application layer is responsible for persisting the results.
 */

import {
  ACHIEVEMENT_CATALOGUE,
  getLevelForXP,
  UserGamification,
  XP_PER_CORRECT,
  XP_PER_INCORRECT,
  XP_PERFECT_SESSION_BONUS,
  type Achievement,
  type AchievementCheckStats,
} from '../entities/Gamification.js';

// ─── Return types ─────────────────────────────────────────────────────────────

export interface ReviewXPResult {
  xpGained: number;
  totalXP: number;
  levelBefore: number;
  levelAfter: number;
  leveledUp: boolean;
}

export interface StreakUpdateResult {
  newStreakDays: number;
  longestStreak: number;
  streakBroken: boolean;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export class GamificationService {
  /**
   * Calculate the XP gained for a review and return the updated totals.
   *
   * @param gamification - Current gamification state (not mutated).
   * @param correct - Whether the review was correct (HanziWriter reported 0 mistakes).
   * @param isPerfectSession - True if the entire session had 0 mistakes (bonus XP).
   *
   * @returns XP gained, new total, and whether a level-up occurred.
   *
   * @example
   * ```ts
   * const xpResult = gamificationService.calculateXP(userGamification, true, false);
   * userGamification.xpTotal = xpResult.totalXP;
   * ```
   */
  calculateXP(
    gamification: UserGamification,
    correct: boolean,
    isPerfectSession = false,
  ): ReviewXPResult {
    const levelBefore = getLevelForXP(gamification.xpTotal);
    const baseXP = correct ? XP_PER_CORRECT : XP_PER_INCORRECT;
    const bonusXP = isPerfectSession ? XP_PERFECT_SESSION_BONUS : 0;
    const xpGained = baseXP + bonusXP;
    const totalXP = gamification.xpTotal + xpGained;
    const levelAfter = getLevelForXP(totalXP);

    return {
      xpGained,
      totalXP,
      levelBefore,
      levelAfter,
      leveledUp: levelAfter > levelBefore,
    };
  }

  /**
   * Update the streak based on today's activity.
   *
   * Streak rules:
   *   - If `lastActivityDate` is today: streak is unchanged (already counted today).
   *   - If `lastActivityDate` is yesterday: streak increments by 1.
   *   - If `lastActivityDate` is null or older: streak resets to 1.
   *
   * "Today" and "yesterday" are relative to the `now` parameter (pass explicitly in tests).
   *
   * @param gamification - Current gamification state (not mutated).
   * @param now - Current timestamp. Defaults to new Date().
   */
  updateStreak(gamification: UserGamification, now: Date = new Date()): StreakUpdateResult {
    const todayStart = this.startOfDay(now);
    const lastActivity = gamification.lastActivityDate;

    if (!lastActivity) {
      return {
        newStreakDays: 1,
        longestStreak: Math.max(1, gamification.longestStreak),
        streakBroken: false,
      };
    }

    const lastActivityStart = this.startOfDay(lastActivity);
    const diffDays = Math.round(
      (todayStart.getTime() - lastActivityStart.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays === 0) {
      // Already reviewed today — no change
      return {
        newStreakDays: gamification.streakDays,
        longestStreak: gamification.longestStreak,
        streakBroken: false,
      };
    }

    if (diffDays === 1) {
      // Continued the streak
      const newStreakDays = gamification.streakDays + 1;
      return {
        newStreakDays,
        longestStreak: Math.max(newStreakDays, gamification.longestStreak),
        streakBroken: false,
      };
    }

    // Streak broken
    return {
      newStreakDays: 1,
      longestStreak: gamification.longestStreak,
      streakBroken: true,
    };
  }

  /**
   * Check which achievements are newly unlocked by this review event.
   *
   * @param stats - Context about the user's overall and session performance.
   * @param alreadyUnlockedIds - Set of achievement IDs already unlocked by the user.
   *
   * @returns The list of newly unlocked achievements (empty if none).
   *
   * @example
   * ```ts
   * const newAchievements = gamificationService.checkAchievements(stats, unlockedIds);
   * for (const ach of newAchievements) {
   *   await gamificationRepo.unlockAchievement(userId, ach.id);
   * }
   * ```
   */
  checkAchievements(
    stats: AchievementCheckStats,
    alreadyUnlockedIds: Set<string>,
  ): Achievement[] {
    return ACHIEVEMENT_CATALOGUE.filter(
      (ach) => !alreadyUnlockedIds.has(ach.id) && ach.condition(stats),
    );
  }

  /** Return the start of a given day (midnight UTC). */
  private startOfDay(date: Date): Date {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    return d;
  }
}
