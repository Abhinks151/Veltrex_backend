import { Inject } from '@nestjs/common';
import { User } from '@/modules/auth/domain/entities/user.entity';
import { CreateEmployeeInput } from '../dto/create-employee.input.dto';
import { ICreateEmployeeUseCase } from '../ports/use-cases/create-employee.use-case.interface';
import { IUserRepository } from '../ports/repositories/user-repository.interface';
import { IPasswordService } from '../ports/services/password-service.interface';
import { ConflictError } from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import { ISendEmployeeInviteUseCase } from '../ports/use-cases/send-employee-invite.use-case.interface';
import { generateRandomPassword } from '@/shared/utils/auth.utils';

export class CreateEmployeeUseCase implements ICreateEmployeeUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
    @Inject('IPasswordService')
    private readonly _passwordService: IPasswordService,
    @Inject('ISendEmployeeInviteUseCase')
    private readonly _sendEmployeeInviteUseCase: ISendEmployeeInviteUseCase,
  ) {}

  async execute(data: CreateEmployeeInput): Promise<User> {
    const employeeExists = await this._userRepository.findByEmail(data.email);
    if (employeeExists) {
      throw new ConflictError(MESSAGE_CONSTANTS.ERROR.USER_ALREADY_EXISTS);
    }

    const rawPassword = generateRandomPassword();
    const hashedPassword = await this._passwordService.hash(rawPassword);

    const newEmployee = await this._userRepository.create({
      ...data,
      password: hashedPassword,
      isVerified: true,
    });

    await this._sendEmployeeInviteUseCase.execute(newEmployee.email);

    return newEmployee;
  }
}
