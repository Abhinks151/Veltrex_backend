import { Inject } from '@nestjs/common';
import { IUserRepository } from '../ports/repositories/user-repository.interface';
import { IToggleEmployeeBlockUseCase } from '../ports/use-cases/toggle-employee-block.use-case.interface';
import { User } from '@/modules/auth/domain/entities/user.entity';
import { NotFoundError } from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

export class ToggleEmployeeBlockUseCase implements IToggleEmployeeBlockUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(id: string): Promise<User> {
    const employee = await this._userRepository.findById(id);

    if (!employee) {
      throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND);
    }

    employee.toggleBlock();

    return this._userRepository.updateBlockStatus(id, employee.isBlocked);
  }
}
