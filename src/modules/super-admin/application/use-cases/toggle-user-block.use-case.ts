import { Inject, Injectable } from '@nestjs/common';
import { IToggleUserBlockUseCase } from '../ports/use-cases/toggle-user-block.use-case.interface';
import { User } from '@/modules/auth/domain/entities/user.entity';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import { NotFoundError } from '@/shared/common/errors/domain-errors';
import { IGetUserByIdUseCase } from '@/modules/auth/application/ports/use-cases/get-user-by-id.use-case.interface';
import { IUpdateUserBlockStatusUseCase } from '@/modules/auth/application/ports/use-cases/update-user-block-status.use-case.interface';

@Injectable()
export class ToggleUserBlockUseCase implements IToggleUserBlockUseCase {
  constructor(
    @Inject('IAuthGetUserByIdUseCase')
    private readonly _getUserByIdUseCase: IGetUserByIdUseCase,
    @Inject('IAuthUpdateUserBlockStatusUseCase')
    private readonly _updateUserBlockStatusUseCase: IUpdateUserBlockStatusUseCase,
  ) {}

  async execute(id: string): Promise<User> {
    const user = await this._getUserByIdUseCase.execute(id);
    if (!user) {
      throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND);
    }

    const newBlockStatus = !user.isBlocked;
    return this._updateUserBlockStatusUseCase.execute(id, newBlockStatus);
  }
}
