import { BadRequestException, Inject } from '@nestjs/common';
import { IAuthService } from '../../application/ports/services/auth-service.interface';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../application/ports/repositories/user-repository.interface';
import { IPasswordService } from '../../application/ports/services/password-service.interface';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

export class AuthService implements IAuthService {
  constructor(
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
    @Inject('IPasswordService')
    private readonly _passwordService: IPasswordService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this._userRepository.findByEmail(email);
    if (!user) {
      throw new BadRequestException(MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND);
    }

    const validUser = await this._passwordService.compare(pass, user.password);

    if (!validUser) {
      throw new BadRequestException(
        MESSAGE_CONSTANTS.ERROR.INVALID_CREDENTIALS,
      );
    }

    return user;
  }
}
