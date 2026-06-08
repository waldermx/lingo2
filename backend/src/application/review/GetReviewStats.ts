import type { ICardRepository } from '../../domain/ports/outbound/ICardRepository.js';
import type { IReviewLogRepository } from '../../domain/ports/outbound/IReviewLogRepository.js';
import type { IGamificationRepository } from '../../domain/ports/outbound/IGamificationRepository.js';

export interface ReviewForecastDay {
  date: string;
  dueCount: number;
}

export interface ReviewStatsOutput {
  totalCards: number;
  cardsByState: Record<number, number>;
  retentionRate: number;
  streakDays: number;
  longestStreak: number;
  activityLast90Days: Array<{ date: string; count: number }>;
  forecast: ReviewForecastDay[];
}

export class GetReviewStats {
  constructor(
    private readonly cardRepo: ICardRepository,
    private readonly reviewLogRepo: IReviewLogRepository,
    private readonly gamificationRepo: IGamificationRepository,
  ) {}

  async execute(userId: string): Promise<ReviewStatsOutput> {
    const [cardsByState, retentionRate, activity, gamification] = await Promise.all([
      this.cardRepo.countByStateForUser(userId),
      this.reviewLogRepo.getRetentionRateByUser(userId),
      this.reviewLogRepo.getActivityByUser(userId, 90),
      this.gamificationRepo.findOrCreateByUser(userId),
    ]);

    const totalCards = Object.values(cardsByState).reduce((sum, n) => sum + n, 0);
    const forecast = await this.buildForecast(userId);

    return {
      totalCards,
      cardsByState,
      retentionRate,
      streakDays: gamification.streakDays,
      longestStreak: gamification.longestStreak,
      activityLast90Days: activity,
      forecast,
    };
  }

  private async buildForecast(userId: string): Promise<ReviewForecastDay[]> {
    const now = new Date();
    const end = new Date(now);
    end.setDate(end.getDate() + 14);

    const cards = await this.cardRepo.findDueByUser(userId, 9999, end);
    const counts = new Map<string, number>();
    for (const card of cards) {
      if (card.due <= now) continue; // already due — not future
      const day = card.due.toISOString().slice(0, 10);
      counts.set(day, (counts.get(day) ?? 0) + 1);
    }

    const result: ReviewForecastDay[] = [];
    for (let i = 1; i <= 14; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() + i);
      const day = d.toISOString().slice(0, 10);
      result.push({ date: day, dueCount: counts.get(day) ?? 0 });
    }
    return result;
  }
}
