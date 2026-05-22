import { Inject } from '@nestjs/common';
import { IUserRepository } from '../ports/repositories/user-repository.interface';
import { IListEmployeesUseCase } from '../ports/use-cases/list-employees.use-case.interface';
import { User } from '@/modules/auth/domain/entities/user.entity';

export class ListEmployeesUseCase implements IListEmployeesUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(
    tenantId: string,
    query: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      sort?: string;
    },
  ): Promise<{ users: User[]; total: number }> {
    return this._userRepository.findAllEmployees(tenantId, query);
  }
}
