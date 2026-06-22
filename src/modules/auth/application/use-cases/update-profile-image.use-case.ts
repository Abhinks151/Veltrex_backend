import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { IUpdateProfileImageUseCase } from '../ports/use-cases/update-profile-image.use-case.interface';
import { IUserRepository } from '../ports/repositories/user-repository.interface';
import { User } from '../../domain/entities/user.entity';
import { MESSAGE_CONSTANTS } from '../../../../shared/enums/messageConstants';

@Injectable()
export class UpdateProfileImageUseCase implements IUpdateProfileImageUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(userId: string, url: string, key: string): Promise<User> {
    const user = await this._userRepository.update(userId, {
      profileImage: url,
      profileImageKey: key,
    });
    if (!user) {
      throw new BadRequestException(MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND);
    }
    return user;
  }
}
