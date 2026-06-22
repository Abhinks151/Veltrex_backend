import { Inject, Injectable } from '@nestjs/common';
import { IGetUserByIdUseCase } from '../ports/use-cases/get-user-by-id.use-case.interface';
import { IUserRepository } from '../ports/repositories/user-repository.interface';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class GetUserByIdUseCase implements IGetUserByIdUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(id: string): Promise<User | null> {
    return this._userRepository.findById(id);
  }
}
