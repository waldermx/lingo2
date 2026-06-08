import bcrypt from 'bcryptjs';
import type { IUserRepository } from '../../domain/ports/outbound/IUserRepository.js';
import { User } from '../../domain/entities/User.js';
import { InvalidCredentialsError } from '../../shared/AppError.js';

export interface LoginUserInput {
  email: string;
  password: string;
}

export class LoginUser {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(input: LoginUserInput): Promise<User> {
    const user = await this.userRepo.findByEmail(input.email);
    if (!user || user.provider !== 'local' || !user.passwordHash) {
      throw new InvalidCredentialsError();
    }

    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) throw new InvalidCredentialsError();

    return user;
  }
}
