import { Inject, Injectable } from '@nestjs/common';
import { IChangePasswordUseCase } from '../ports/use-cases/change-password.use-case.interface';
import { IAuthQueryService } from '@/modules/auth/application/ports/services/auth-query.service.interface';
import { User } from '@/modules/auth/domain/entities/user.entity';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import {
  BadRequestError,
  NotFoundError,
} from '@/shared/common/errors/domain-errors';

@Injectable()
export class ChangePasswordUseCase implements IChangePasswordUseCase {
  constructor(
    @Inject('IAuthQueryService')
    private readonly _authQueryService: IAuthQueryService,
  ) {}

  async execute(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<User> {
    const user = await this._authQueryService.findById(userId);
    if (!user) {
      throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND);
    }

    if (user.isBlocked) {
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.USER_IS_BLOCKED);
    }

    return await this._authQueryService.changePassword(
      userId,
      currentPassword,
      newPassword,
    );
  }
}
