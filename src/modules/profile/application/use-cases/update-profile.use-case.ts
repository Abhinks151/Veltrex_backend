import { Inject, Injectable } from '@nestjs/common';
import { IUpdateProfileUseCase } from '../ports/use-cases/update-profile.use-case.interface';
import { IUpdateUserUseCase } from '@/modules/auth/application/ports/use-cases/update-user.use-case.interface';
import { IGetUserByIdUseCase } from '@/modules/auth/application/ports/use-cases/get-user-by-id.use-case.interface';
import { User } from '@/modules/auth/domain/entities/user.entity';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import {
  BadRequestError,
  NotFoundError,
} from '@/shared/common/errors/domain-errors';

@Injectable()
export class UpdateProfileUseCase implements IUpdateProfileUseCase {
  constructor(
    @Inject('IAuthUpdateUserUseCase')
    private readonly _updateUserUseCase: IUpdateUserUseCase,
    @Inject('IAuthGetUserByIdUseCase')
    private readonly _getUserByIdUseCase: IGetUserByIdUseCase,
  ) {}

  async execute(userId: string, name: string): Promise<User> {
    const user = await this._getUserByIdUseCase.execute(userId);
    if (!user) {
      throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND);
    }

    if (user.isBlocked) {
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.USER_IS_BLOCKED);
    }

    const response = await this._updateUserUseCase.execute({ name }, userId);
    return response as unknown as User;
  }
}
