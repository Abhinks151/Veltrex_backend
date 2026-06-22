import { Inject, Injectable } from '@nestjs/common';
import { IListAllAdminUsersUseCase } from '../ports/use-cases/list-all-admin-users.use-case.interface';
import { IUserRepository } from '../ports/repositories/user-repository.interface';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class ListAllAdminUsersUseCase implements IListAllAdminUsersUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(query: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<{ users: User[]; total: number }> {
    return await this._userRepository.findAllAdminUsers(query);
  }
}
