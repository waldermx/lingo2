import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import type { IUserRepository } from '../../domain/ports/outbound/IUserRepository.js';
import type { IGamificationRepository } from '../../domain/ports/outbound/IGamificationRepository.js';
import { User } from '../../domain/entities/User.js';
import { UserAlreadyExistsError } from '../../shared/AppError.js';

export interface RegisterUserInput {
  email: string;
  password: string;
  displayName: string;
}

export class RegisterUser {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly gamificationRepo: IGamificationRepository,
  ) {}

  async execute(input: RegisterUserInput): Promise<User> {
    const existing = await this.userRepo.findByEmail(input.email);
    if (existing) throw new UserAlreadyExistsError();

    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = new User({
      id: nanoid(),
      email: input.email,
      displayName: input.displayName,
      provider: 'local',
      passwordHash,
    });

    const created = await this.userRepo.create(user);
    await this.gamificationRepo.findOrCreateByUser(created.id);
    return created;
  }
}
