import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { IValidateUserForTenantCreationUseCase } from '../ports/use-cases/validate-user-for-tenant-creation.use-case.interface';
import { IUserRepository } from '../ports/repositories/user-repository.interface';
import { MESSAGE_CONSTANTS } from '../../../../shared/enums/messageConstants';

@Injectable()
export class ValidateUserForTenantCreationUseCase implements IValidateUserForTenantCreationUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<boolean> {
    const user = await this._userRepository.findByUuid(userId);
    if (!user) {
      throw new BadRequestException(MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND);
    }
    if (!user.canCreateTenant()) {
      throw new UnauthorizedException(
        MESSAGE_CONSTANTS.ERROR.USER_NOT_AUTHORIZED_CREATE_TENANT,
      );
    }
    return true;
  }
}
