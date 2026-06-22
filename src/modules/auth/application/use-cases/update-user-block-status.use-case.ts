import { Inject, Injectable } from '@nestjs/common';
import { IUpdateUserBlockStatusUseCase } from '../ports/use-cases/update-user-block-status.use-case.interface';
import { IUserRepository } from '../ports/repositories/user-repository.interface';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class UpdateUserBlockStatusUseCase implements IUpdateUserBlockStatusUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(id: string, isBlocked: boolean): Promise<User> {
    return this._userRepository.updateBlockStatus(id, isBlocked);
  }
}
