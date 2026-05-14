import { Inject, Injectable } from '@nestjs/common';
import { IUserRegisterUseCase } from '../ports/use-cases/register-user.use-case.interface';
import { AppLogger } from '../../../../shared/common/logger/logger.service';
import { IPasswordService } from '../ports/services/password-service.interface';
import { IUserRepository } from '../ports/repositories/user-repository.interface';
import { ISendVerificationEmailUseCase } from '../ports/use-cases/send-verification-email.use-case.interface';
import { RegisterUserOutputDto } from '../../presentation/dto/user.response.dto';
import { RegisterUserInput } from '../dto/register-user-input.dto';
import { MESSAGE_CONSTANTS } from '../../../../shared/enums/messageConstants';
import { ConflictError } from '../../../../shared/common/errors/domain-errors';

@Injectable()
export class RegisterUserUseCase implements IUserRegisterUseCase {
  constructor(
    private readonly _logger: AppLogger,
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
    @Inject('IPasswordService')
    private readonly _passwordService: IPasswordService,
    @Inject('ISendVerificationEmailUseCase')
    private readonly sendVerificationEmailUseCase: ISendVerificationEmailUseCase,
  ) {}

  async execute(
    data: RegisterUserInput,
    requestId: string,
  ): Promise<RegisterUserOutputDto> {
    this._logger.info('User registration attempt', {
      requestId,
      email: data.email,
    });

    const userExists = await this._userRepository.findByEmail(data.email);
    if (userExists) {
      throw new ConflictError(MESSAGE_CONSTANTS.ERROR.USER_ALREADY_EXISTS);
    }

    //constant
    const hashedPassword = await this._passwordService.hash(data.password);

    const newUser = await this._userRepository.create({
      ...data,
      password: hashedPassword,
    });

    await this.sendVerificationEmailUseCase.execute(newUser.email);

    // return {
    //   success: true,
    //   statusCode: HttpStatus.CREATED,
    //   message: MESSAGE_CONSTANTS.SUCCESS.USER_REGISTERED,
    //   data: newUser,
    // };

    return {
      id: newUser.uuid,
      email: newUser.email,
      name: newUser.name,
    };
  }
}
