import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TenantModule } from '../tenant/tenant.module';
import { AuthController } from './presentation/auth.controller';
import { EmployeeController } from './presentation/employee.controller';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { LoginUserUseCase } from './application/use-cases/login-user.use-case';
import { UserRepository } from './infrastructure/repositories/user-repository';
import { PasswordService } from './infrastructure/services/password-service';
import { TokenService } from './infrastructure/services/token-service';
import { LocalStrategy } from './infrastructure/strategies/local.strategy';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { StringValue } from 'ms';
import { AuthService } from './infrastructure/services/auth-service';
import { RequestPasswordResetUseCase } from './application/use-cases/request-password.use-case';
import { PasswordResetTokenRepository } from './infrastructure/repositories/password-reset-repository';
import { TokenGenerator } from './infrastructure/services/token-generator';
import { EmailVerificationTokenRepository } from './infrastructure/repositories/email-verification-repository';
import { SendVerificationEmailUseCase } from './application/use-cases/send-verification-email.use-case';
import { VerifyEmailUseCase } from './application/use-cases/verify-email.use-case';
import { EmailService } from './infrastructure/services/email-service';
import { UserResetPasswordUseCase } from './application/use-cases/reset-password.use-case';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.use-case';
import { RolesGuard } from './presentation/guards/roles.guard';
import { IsVerifiedGuard } from './presentation/guards/is-verified.guard';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { ListEmployeesUseCase } from './application/use-cases/list-employees.use-case';
import { UpdateEmployeeUseCase } from './application/use-cases/update-employee.use-case';
import { ToggleEmployeeBlockUseCase } from './application/use-cases/toggle-employee-block.use-case';
import { SoftDeleteEmployeeUseCase } from './application/use-cases/delete-employee.use-case';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { CreateEmployeeUseCase } from './application/use-cases/create-employee.use-case';
import { SendEmployeeInviteUseCase } from './application/use-cases/send-employee-invite.use-case';
import { SubscriptionModule } from '../subscription/subscription.module';

import { ValidateUserForTenantCreationUseCase } from './application/use-cases/validate-user-for-tenant-creation.use-case';
import { ListAllAdminUsersUseCase } from './application/use-cases/list-all-admin-users.use-case';
import { GetUserByIdUseCase } from './application/use-cases/get-user-by-id.use-case';
import { UpdateUserBlockStatusUseCase } from './application/use-cases/update-user-block-status.use-case';
import { ChangePasswordUseCase } from './application/use-cases/change-password.use-case';
import { UpdateProfileImageUseCase } from './application/use-cases/update-profile-image.use-case';

@Module({
  imports: [
    PassportModule,
    forwardRef(() => TenantModule),
    forwardRef(() => SubscriptionModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: configService.get<string>(
            'JWT_ACCESS_TOKEN_EXPIRES_IN',
          ) as StringValue,
        },
      }),
    }),
  ],
  controllers: [AuthController, EmployeeController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RegisterUserUseCase,
    LoginUserUseCase,
    RolesGuard,
    IsVerifiedGuard,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'ILoginUserUseCase',
      useClass: LoginUserUseCase,
    },
    {
      provide: 'IPasswordService',
      useClass: PasswordService,
    },
    {
      provide: 'ITokenService',
      useClass: TokenService,
    },
    {
      provide: 'IUserRegisterUseCase',
      useClass: RegisterUserUseCase,
    },
    {
      provide: 'IUserLoginUseCase',
      useClass: LoginUserUseCase,
    },
    {
      provide: 'IAuthService',
      useClass: AuthService,
    },
    {
      provide: 'IRequestPasswordResetUseCase',
      useClass: RequestPasswordResetUseCase,
    },
    {
      provide: 'IPasswordResetTokenRepository',
      useClass: PasswordResetTokenRepository,
    },
    {
      provide: 'ITokenGenerator',
      useClass: TokenGenerator,
    },
    {
      provide: 'IEmailService',
      useClass: EmailService,
    },
    {
      provide: 'IEmailVerificationTokenRepository',
      useClass: EmailVerificationTokenRepository,
    },
    {
      provide: 'ISendVerificationEmailUseCase',
      useClass: SendVerificationEmailUseCase,
    },
    {
      provide: 'IVerifyEmailUseCase',
      useClass: VerifyEmailUseCase,
    },
    {
      provide: 'IUserResetPasswordUseCase',
      useClass: UserResetPasswordUseCase,
    },
    {
      provide: 'IRefreshTokenUseCase',
      useClass: RefreshTokenUseCase,
    },
    {
      provide: 'IAuthUpdateUserUseCase',
      useClass: UpdateUserUseCase,
    },
    {
      provide: 'ICreateEmployeeUseCase',
      useClass: CreateEmployeeUseCase,
    },
    {
      provide: 'ISendEmployeeInviteUseCase',
      useClass: SendEmployeeInviteUseCase,
    },
    {
      provide: 'IListEmployeesUseCase',
      useClass: ListEmployeesUseCase,
    },
    {
      provide: 'IUpdateEmployeeUseCase',
      useClass: UpdateEmployeeUseCase,
    },
    {
      provide: 'IToggleEmployeeBlockUseCase',
      useClass: ToggleEmployeeBlockUseCase,
    },
    {
      provide: 'ISoftDeleteEmployeeUseCase',
      useClass: SoftDeleteEmployeeUseCase,
    },
    {
      provide: 'IAuthValidateUserForTenantCreationUseCase',
      useClass: ValidateUserForTenantCreationUseCase,
    },
    {
      provide: 'IAuthListAllAdminUsersUseCase',
      useClass: ListAllAdminUsersUseCase,
    },
    {
      provide: 'IAuthGetUserByIdUseCase',
      useClass: GetUserByIdUseCase,
    },
    {
      provide: 'IAuthUpdateUserBlockStatusUseCase',
      useClass: UpdateUserBlockStatusUseCase,
    },
    {
      provide: 'IAuthChangePasswordUseCase',
      useClass: ChangePasswordUseCase,
    },
    {
      provide: 'IAuthUpdateProfileImageUseCase',
      useClass: UpdateProfileImageUseCase,
    },
  ],
  exports: [
    AuthService,
    RolesGuard,
    IsVerifiedGuard,
    'IAuthValidateUserForTenantCreationUseCase',
    'IAuthListAllAdminUsersUseCase',
    'IAuthGetUserByIdUseCase',
    'IAuthUpdateUserBlockStatusUseCase',
    'IAuthChangePasswordUseCase',
    'IAuthUpdateProfileImageUseCase',
    'IAuthUpdateUserUseCase',
  ],
})
export class AuthModule {}
