import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
// import { AuthService } from '../../application/auth.service';
// import { IUserLoginUseCase } from '../../application/ports/use-cases/login-user.use-case.interface';
import { IAuthService } from '../../application/ports/services/auth-service.interface';
import { MESSAGE_CONSTANTS } from '../../../../shared/enums/messageConstants';
import { ValidatedUserDto } from '../../application/dto/jwt-strategy.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    // private authService: AuthService,
    // @Inject('ILoginUserUseCase')
    // private readonly loginUserUseCase: IUserLoginUseCase,
    @Inject('IAuthService')
    private readonly authService: IAuthService,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(
    email: string,
    password: string,
  ): Promise<Omit<ValidatedUserDto, 'is_verified'>> {
    // const user = await this.authService.validateUser(email, password);
    // const user = await this.loginUserUseCase.validateUser(email, password);
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException(MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND);
    }
    return user;
  }
}
