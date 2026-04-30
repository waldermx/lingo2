/**
 * @file src/domain/ports/outbound/IReviewLogRepository.ts
 * @description Outbound port for review audit log persistence.
 */

import type { ReviewLog } from '../../entities/ReviewLog.js';

export interface ReviewActivityDay {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface IReviewLogRepository {
  create(log: ReviewLog): Promise<ReviewLog>;

  /**
   * Count total reviews by a user.
   * Used by GamificationService for achievement checks (e.g., "100 total reviews").
   */
  countByUser(userId: string): Promise<number>;

  /**
   * Return daily review counts for the activity heatmap.
   * Returns only days where at least one review occurred.
   */
  getActivityByUser(userId: string, daysBack: number): Promise<ReviewActivityDay[]>;

  /**
   * Calculate the user's overall retention rate.
   * Retention = (Good reviews) / (total reviews).
   * Returns 0 if no reviews exist.
   */
  getRetentionRateByUser(userId: string): Promise<number>;
}
