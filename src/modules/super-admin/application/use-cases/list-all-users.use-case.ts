import { Inject } from '@nestjs/common';
import { IListAllAdminUsersUseCase } from '../ports/use-cases/list-all-users.use-case.interface';
import { User } from '@/modules/auth/domain/entities/user.entity';
import { IListAllAdminUsersUseCase as IAuthListAllAdminUsersUseCase } from '@/modules/auth/application/ports/use-cases/list-all-admin-users.use-case.interface';

export class ListAllAdminUsersUseCase implements IListAllAdminUsersUseCase {
  constructor(
    @Inject('IAuthListAllAdminUsersUseCase')
    private readonly _authListAllAdminUsersUseCase: IAuthListAllAdminUsersUseCase,
  ) {}

  async execute(query: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<{ users: User[]; total: number }> {
    return await this._authListAllAdminUsersUseCase.execute(query);
  }
}
