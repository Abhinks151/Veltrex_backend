import { Inject } from '@nestjs/common';
import { IUserRepository } from '../ports/repositories/user-repository.interface';
import { ISoftDeleteEmployeeUseCase } from '../ports/use-cases/soft-delete-employee.use-case.interface';
import { User } from '@/modules/auth/domain/entities/user.entity';
import { NotFoundError } from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

export class SoftDeleteEmployeeUseCase implements ISoftDeleteEmployeeUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(id: string): Promise<User> {
    const employee = await this._userRepository.findById(id);

    if (!employee) {
      throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND);
    }

    return this._userRepository.softDelete(id);
  }
}
