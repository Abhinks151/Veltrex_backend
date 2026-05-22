import { Inject } from '@nestjs/common';
import { IUserRepository } from '../ports/repositories/user-repository.interface';
import { IUpdateEmployeeUseCase } from '../ports/use-cases/update-employee.use-case.interface';
import { User } from '@/modules/auth/domain/entities/user.entity';
import { NotFoundError } from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

export class UpdateEmployeeUseCase implements IUpdateEmployeeUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(
    id: string,
    data: {
      name?: string;
      role?: string;
    },
  ): Promise<User> {
    const employee = await this._userRepository.findById(id);

    if (!employee) {
      throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND);
    }

    return this._userRepository.update(id, data);
  }
}
