import bcrypt from 'bcryptjs';
import type { IUserRepository } from '../../domain/ports/outbound/IUserRepository.js';
import { User } from '../../domain/entities/User.js';
import { InvalidTokenError } from '../../shared/AppError.js';

export interface RotateRefreshTokenInput {
  userId: string;
  rawToken: string;
  newTokenHash: string;
}

export class RotateRefreshToken {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(input: RotateRefreshTokenInput): Promise<User> {
    const user = await this.userRepo.findById(input.userId);
    if (!user || !user.refreshTokenHash) throw new InvalidTokenError();

    const valid = await bcrypt.compare(input.rawToken, user.refreshTokenHash);
    if (!valid) throw new InvalidTokenError();

    await this.userRepo.updateRefreshTokenHash(input.userId, input.newTokenHash);
    return user;
  }
}
