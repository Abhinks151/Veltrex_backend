import { Inject, Injectable } from '@nestjs/common';
import { IToggleUserBlockUseCase } from '../ports/use-cases/toggle-user-block.use-case.interface';
import { User } from '@/modules/auth/domain/entities/user.entity';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import { NotFoundError } from '@/shared/common/errors/domain-errors';
import { IAuthQueryService } from '@/modules/auth/application/ports/services/auth-query.service.interface';

@Injectable()
export class ToggleUserBlockUseCase implements IToggleUserBlockUseCase {
  constructor(
    @Inject('IAuthQueryService')
    private readonly _authQueryService: IAuthQueryService,
  ) {}

  async execute(id: string): Promise<User> {
    const user = await this._authQueryService.findById(id);
    if (!user) {
      throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND);
    }

    const newBlockStatus = !user.isBlocked;
    return this._authQueryService.updateBlockStatus(id, newBlockStatus);
  }
}
