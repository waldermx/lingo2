/**
 * @file src/domain/ports/outbound/IUserRepository.ts
 * @description Outbound port for user persistence.
 */

import type { User } from '../../entities/User.js';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  /** Find a user by their OAuth provider + provider-specific subject ID. */
  findByProviderId(provider: string, providerId: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
  /** Update only the refresh token hash (avoids loading full entity for token rotation). */
  updateRefreshTokenHash(userId: string, hash: string | null): Promise<void>;
  /** Update only onboarding fields after CompleteOnboarding use case. */
  updateOnboarding(
    userId: string,
    data: {
      onboardingCompleted: boolean;
      startingHskLevel: number;
      dailyNewCards: number;
      preferredLocale: string;
    },
  ): Promise<void>;
}
