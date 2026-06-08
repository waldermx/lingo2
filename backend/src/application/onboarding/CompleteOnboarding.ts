import type { IUserRepository } from '../../domain/ports/outbound/IUserRepository.js';
import type { ICharacterRepository } from '../../domain/ports/outbound/ICharacterRepository.js';
import type { ICardRepository } from '../../domain/ports/outbound/ICardRepository.js';
import {
  OnboardingAlreadyCompletedError,
  UserNotFoundError,
} from '../../shared/AppError.js';

export interface CompleteOnboardingInput {
  userId: string;
  startingHskLevel: 1 | 2;
  preferredLocale: string;
  dailyNewCards: 5 | 10 | 20;
}

export class CompleteOnboarding {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly characterRepo: ICharacterRepository,
    private readonly cardRepo: ICardRepository,
  ) {}

  async execute(input: CompleteOnboardingInput): Promise<void> {
    const user = await this.userRepo.findById(input.userId);
    if (!user) throw new UserNotFoundError();
    if (user.onboardingCompleted) throw new OnboardingAlreadyCompletedError();

    await this.userRepo.updateOnboarding(input.userId, {
      onboardingCompleted: true,
      startingHskLevel: input.startingHskLevel,
      dailyNewCards: input.dailyNewCards,
      preferredLocale: input.preferredLocale,
    });

    const characterIds = await this.characterRepo.findIdsByHSKLevel(input.startingHskLevel);
    await this.cardRepo.createManyNew(input.userId, characterIds);
  }
}
