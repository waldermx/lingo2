/**
 * @file src/domain/ports/outbound/ICardRepository.ts
 * @description Outbound port for FSRS card state persistence.
 */

import type { Card } from '../../entities/Card.js';

export interface ICardRepository {
  /**
   * Find all cards due for review by a user, ordered by due date ascending.
   * `now` is passed explicitly to make the query deterministic in tests.
   */
  findDueByUser(userId: string, limit: number, now: Date): Promise<Card[]>;

  /**
   * Count how many NEW cards were added to the user's deck today.
   * Used to enforce the `dailyNewCards` limit.
   *
   * @param userId - The user's ID.
   * @param todayStart - The start of the user's "today" (midnight in their timezone).
   */
  countNewTodayByUser(userId: string, todayStart: Date): Promise<number>;

  /**
   * Return all NEW (state=0) cards for a given user and HSK level,
   * ordered by the character's frequency_rank (most common first).
   * Used by SchedulerService to fill the daily new card budget.
   */
  findNewByUserAndHSK(userId: string, hskLevel: number, limit: number): Promise<Card[]>;

  /** Find a specific card by its ID. Returns null if not found. */
  findById(id: string): Promise<Card | null>;

  /** Find the card for a specific user × character pair. Returns null if not found. */
  findByUserAndCharacter(userId: string, characterId: string): Promise<Card | null>;

  /** Insert a new card. Throws if a card already exists for this user+character. */
  create(card: Card): Promise<Card>;

  /** Update an existing card's FSRS state. */
  update(card: Card): Promise<Card>;

  /**
   * Upsert: create if not exists, update if exists.
   * Prefer explicit create/update when the intent is clear.
   */
  upsert(card: Card): Promise<Card>;

  /**
   * Count cards by state for a user, keyed by CardState enum value.
   * Used for the progress distribution chart.
   */
  countByStateForUser(userId: string): Promise<Record<number, number>>;

  /**
   * Count how many review-state cards (state=2) exist for a user in a given HSK level.
   * Used for "mastered" progress calculation.
   */
  countMasteredByUserAndHSK(userId: string, hskLevel: number): Promise<number>;
}
