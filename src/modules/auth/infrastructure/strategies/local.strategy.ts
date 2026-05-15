import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IAuthService } from '../../application/ports/services/auth-service.interface';
import { MESSAGE_CONSTANTS } from '../../../../shared/enums/messageConstants';
import { ValidatedUserDto } from '../../application/dto/jwt-strategy.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('IAuthService')
    private readonly _authService: IAuthService,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(
    email: string,
    password: string,
  ): Promise<Omit<ValidatedUserDto, 'is_verified'>> {
    const user = await this._authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException(MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND);
    }
    return user;
  }
}
