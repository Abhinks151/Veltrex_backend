import { Inject, Injectable } from '@nestjs/common';
import { IChangePasswordUseCase } from '../ports/use-cases/change-password.use-case.interface';
import { IAuthQueryService } from '@/modules/auth/application/ports/services/auth-query.service.interface';
import { User } from '@/modules/auth/domain/entities/user.entity';

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
    return await this._authQueryService.changePassword(
      userId,
      currentPassword,
      newPassword,
    );
  }
}
