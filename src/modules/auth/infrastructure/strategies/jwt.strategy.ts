import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IUserRepository } from '../../application/ports/repositories/user-repository.interface';
import { JwtPayload } from '../../application/ports/services/jwt-payload.interface';
import { MESSAGE_CONSTANTS } from '../../../../shared/enums/messageConstants';
import { ValidatedUserDto } from '../../application/dto/jwt-strategy.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,

    private readonly _configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        _configService.get<string>('JWT_SECRET_KEY') ||
        'this is a super hard secret',
    });
  }

  async validate(payload: JwtPayload): Promise<ValidatedUserDto> {
    const user = await this._userRepository.findByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException(MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND);
    }
    return {
      userId: payload.userId,
      name: user.name,
      uuid: payload.userId,
      email: payload.email,
      role: payload.role,
      is_verified: user.isVerified,
      profileImage: user.profileImage,
    };
  }
}
