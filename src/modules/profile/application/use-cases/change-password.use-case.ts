import { Inject, Injectable } from '@nestjs/common';
import { IChangePasswordUseCase } from '../ports/use-cases/change-password.use-case.interface';
import { IChangePasswordUseCase as IAuthChangePasswordUseCase } from '@/modules/auth/application/ports/use-cases/change-password.use-case.interface';
import { IGetUserByIdUseCase } from '@/modules/auth/application/ports/use-cases/get-user-by-id.use-case.interface';
import { User } from '@/modules/auth/domain/entities/user.entity';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import {
  BadRequestError,
  NotFoundError,
} from '@/shared/common/errors/domain-errors';

@Injectable()
export class ChangePasswordUseCase implements IChangePasswordUseCase {
  constructor(
    @Inject('IAuthChangePasswordUseCase')
    private readonly _authChangePasswordUseCase: IAuthChangePasswordUseCase,
    @Inject('IAuthGetUserByIdUseCase')
    private readonly _getUserByIdUseCase: IGetUserByIdUseCase,
  ) {}

  async execute(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<User> {
    const user = await this._getUserByIdUseCase.execute(userId);
    if (!user) {
      throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND);
    }

    if (user.isBlocked) {
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.USER_IS_BLOCKED);
    }

    return await this._authChangePasswordUseCase.execute(
      userId,
      currentPassword,
      newPassword,
    );
  }
}
