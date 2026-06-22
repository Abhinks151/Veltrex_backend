import { Inject } from '@nestjs/common';
import { UpdateUserInputDto } from '../dto/update-user-input.dto';
import { IUpdateUserUseCase } from '../ports/use-cases/update-user.use-case.interface';
import { IUserRepository } from '../ports/repositories/user-repository.interface';
import { UpdateUserOutputDto } from '../../presentation/dto/user.response.dto';
import { MESSAGE_CONSTANTS } from '../../../../shared/enums/messageConstants';
import {
  BadRequestError,
  NotFoundError,
} from '../../../../shared/common/errors/domain-errors';

export class UpdateUserUseCase implements IUpdateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(
    reqDto: UpdateUserInputDto,
    userId: string,
  ): Promise<UpdateUserOutputDto> {
    const user = await this._userRepository.findByUuid(userId);

    if (!user) {
      throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND);
    }

    if (user.isBlocked) {
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.USER_IS_BLOCKED);
    }

    Object.assign(user, reqDto);

    const response = await this._userRepository.update(userId, reqDto);

    if (!response) {
      throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.USER_NOT_UPDATED);
    }

    return {
      id: response.uuid,
      email: response.email,
      name: response.name,
      profileImage: response.profileImage,
      tenantId: response.tenantId,
    };
  }
}
