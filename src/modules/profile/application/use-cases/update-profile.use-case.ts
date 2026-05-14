import { Inject, Injectable } from '@nestjs/common';
import { IUpdateProfileUseCase } from '../ports/use-cases/update-profile.use-case.interface';
import { IAuthQueryService } from '@/modules/auth/application/ports/services/auth-query.service.interface';
import { User } from '@/modules/auth/domain/entities/user.entity';

@Injectable()
export class UpdateProfileUseCase implements IUpdateProfileUseCase {
  constructor(
    @Inject('IAuthQueryService')
    private readonly _authQueryService: IAuthQueryService,
  ) {}

  async execute(userId: string, name: string): Promise<User> {
    return await this._authQueryService.updateProfile(userId, name);
  }
}
