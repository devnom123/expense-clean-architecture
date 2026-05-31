import { Inject, Injectable } from '@nestjs/common';
import { EmailAlreadyExistsException } from '../../domain/exceptions/email-already-exists.exception';
import { AuthResult } from '../dto/auth.result';
import { SignupInput } from '../dto/signup.input';
import { IPasswordHasher } from '../ports/password-hasher.port';
import { ITokenService } from '../ports/token.service.port';
import { IUserRepository } from '../ports/user.repository.port';
import {
  PASSWORD_HASHER,
  TOKEN_SERVICE,
  USER_REPOSITORY,
} from '../tokens/injection.tokens';

@Injectable()
export class SignupUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: IPasswordHasher,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: ITokenService,
  ) {}

  async execute(input: SignupInput): Promise<AuthResult> {
    const email = input.email.trim().toLowerCase();

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new EmailAlreadyExistsException();
    }

    const passwordHash = await this.passwordHasher.hash(input.password);

    const user = await this.userRepository.create({
      name: input.name.trim(),
      email,
      passwordHash,
    });

    const accessToken = await this.tokenService.sign({
      sub: user.id,
      email: user.email,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }
}
