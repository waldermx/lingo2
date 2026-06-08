import type { IUserRepository } from '../../domain/ports/outbound/IUserRepository.js';
import type { User } from '../../domain/entities/User.js';
import { UserNotFoundError } from '../../shared/AppError.js';

export class GetUserProfile {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(userId: string): Promise<User> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new UserNotFoundError();
    return user;
  }
}
