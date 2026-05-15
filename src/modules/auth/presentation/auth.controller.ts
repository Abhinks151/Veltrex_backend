import {
  Body,
  Controller,
  Get,
  Inject,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RegisterUserRequestDto } from './dto/register-user.request.dto';
import { ApiResponse } from '@/shared/common/apiResponse/api-response';
import { IUserRegisterUseCase } from '../application/ports/use-cases/register-user.use-case.interface';
import { IUserLoginUseCase } from '../application/ports/use-cases/login-user.use-case.interface';
import { IRequestPasswordResetUseCase } from '../application/ports/use-cases/request-password-reset.use-case.interface';
import { RequestForgotPasswordRequestDto } from './dto/request-forgot-password.request.dto';
import { ResetPasswordRequestDto } from './dto/reset-password.request.dto';
import { IUserResetPasswordUseCase } from '../application/ports/use-cases/reset-password.use-case.interface';
import { IVerifyEmailUseCase } from '../application/ports/use-cases/verify-email.use-case.interface';
import { ISendVerificationEmailUseCase } from '../application/ports/use-cases/send-verification-email.use-case.interface';
import { Request, Response } from 'express';
import { User } from '../domain/entities/user.entity';
// import { IsVerifiedGuard } from './guards/is-verified.guard';
import { IRefreshTokenUseCase } from '../application/ports/use-cases/refresh-token.use-case.interface';

import { ResendVerificationCodeRequestDto } from './dto/resend-verification-code.dto';
import { Auth } from './decorators/auth.decorator';
import { IUpdateUserUseCase } from '../application/ports/use-cases/update-user.use-case.interface';
import { UpdateUserRequestDto } from './dto/update-user.request.dto';
import { MESSAGE_CONSTANTS } from '../../../shared/enums/messageConstants';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly _configService: ConfigService,

    // private readonly registerUserUseCase: IUserRegisterUseCase,
    // private readonly loginUserUseCase: IUserLoginUseCase,
    @Inject('IUserRegisterUseCase')
    private readonly _registerUserUseCase: IUserRegisterUseCase,

    @Inject('IUserLoginUseCase')
    private readonly _loginUserUseCase: IUserLoginUseCase,

    @Inject('IRequestPasswordResetUseCase')
    private readonly _requestPasswordResetUseCase: IRequestPasswordResetUseCase,

    @Inject('IUserResetPasswordUseCase')
    private readonly _userResetPasswordUseCase: IUserResetPasswordUseCase,

    @Inject('IVerifyEmailUseCase')
    private readonly _verifyEmailUseCase: IVerifyEmailUseCase,

    @Inject('ISendVerificationEmailUseCase')
    private readonly _sendVerificationEmailUseCase: ISendVerificationEmailUseCase,

    @Inject('IRefreshTokenUseCase')
    private readonly _refreshTokenUseCase: IRefreshTokenUseCase,

    @Inject('IUpdateUserUseCase')
    private readonly _updateUserUseCase: IUpdateUserUseCase,
  ) {}

  @Post('register')
  async register(@Req() req: Request, @Body() reqDto: RegisterUserRequestDto) {
    // const input: RegisterUserRequestDto = {
    //   email: reqDto.email,
    //   password: reqDto.password,
    //   name: reqDto.name,
    // };

    const data = await this._registerUserUseCase.execute(reqDto, req.requestId);
    return new ApiResponse(true, data, MESSAGE_CONSTANTS.SUCCESS.USER_CREATED);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    if (!req.user) {
      throw new UnauthorizedException(MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND);
    }

    const data = await this._loginUserUseCase.execute(
      req.user.userId,
      req.requestId,
    );

    res.cookie('refresh_token', data.refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: this._configService.get<string>('NODE_ENV') === 'production',
      maxAge:
        Number(
          this._configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN'),
        ) || 604800000,
    });

    return new ApiResponse(
      true,
      { access_token: data.access_token, user: data.user },
      MESSAGE_CONSTANTS.SUCCESS.USER_LOGGED_IN,
    );
  }

  //In nest js the guads run in reverse order so the first one that
  //needs to runned should be close to the controller then the same order in which we need
  //to run the guards
  @Auth()
  @Get('profile')
  getProfile(@Req() req: Request) {
    return new ApiResponse(
      true,
      req.user,
      MESSAGE_CONSTANTS.SUCCESS.USER_PROFILE,
    );
  }

  @Auth()
  @Patch('update')
  async update(
    @Req() req: Request & { user: User; requestId: string },
    @Body() reqDto: UpdateUserRequestDto,
  ) {
    const data = await this._updateUserUseCase.execute(reqDto, req.user.userId);
    return new ApiResponse(true, data, MESSAGE_CONSTANTS.SUCCESS.USER_UPDATED);
  }

  @Post('refresh')
  refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    // const token: string | undefined = req.cookies?.refresh_token;
    const cookies = req.cookies as Record<string, string>;
    const token = cookies.refresh_token;
    if (!token) {
      throw new UnauthorizedException(
        MESSAGE_CONSTANTS.ERROR.REFRESH_TOKEN_NOT_FOUND,
      );
    }

    const data = this._refreshTokenUseCase.execute(token);

    res.cookie('refresh_token', data.refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: this._configService.get<string>('NODE_ENV') === 'production',
      maxAge:
        Number(
          this._configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN'),
        ) || 604800000,
    });

    return new ApiResponse(
      true,
      { access_token: data.access_token },
      MESSAGE_CONSTANTS.SUCCESS.TOKEN_REFRESHED,
    );
  }

  @Post('forgot')
  async forgetPassword(
    @Req() req: Request,
    @Body() reqDto: RequestForgotPasswordRequestDto,
  ) {
    // console.log('forgot password');

    const data = await this._requestPasswordResetUseCase.execute(reqDto.email);

    return new ApiResponse(
      true,
      data,
      MESSAGE_CONSTANTS.SUCCESS.PASSWORD_RESET_LINK_SENT,
    );
  }

  @Post('reset')
  async resetPassword(
    @Query('token') token: string,
    @Body() reqDto: ResetPasswordRequestDto,
  ) {
    // console.log('token', token);
    const pass = reqDto.password;
    const response = await this._userResetPasswordUseCase.execute(token, pass);

    return new ApiResponse(
      true,
      response,
      MESSAGE_CONSTANTS.SUCCESS.PASSWORD_RESET,
    );
  }

  @Post('verify')
  async verifyEmail(@Query('token') token: string) {
    await this._verifyEmailUseCase.execute(token);
    console.log(MESSAGE_CONSTANTS.SUCCESS.EMAIL_VERIFIED);
    return new ApiResponse(
      true,
      null,
      MESSAGE_CONSTANTS.SUCCESS.EMAIL_VERIFIED,
    );
  }

  @Post('resend')
  async resendVerificationEmail(
    @Body() body: ResendVerificationCodeRequestDto,
  ) {
    await this._sendVerificationEmailUseCase.execute(body.email);
    return new ApiResponse(
      true,
      null,
      MESSAGE_CONSTANTS.SUCCESS.VERIFICATION_EMAIL_SENT,
    );
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refresh_token');
    return new ApiResponse(
      true,
      null,
      MESSAGE_CONSTANTS.SUCCESS.USER_LOGGED_OUT,
    );
  }
}
