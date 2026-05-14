import { Inject } from '@nestjs/common';
import { IListAllAdminUsersUseCase } from '../ports/use-cases/list-all-users.use-case.interface';
import { User } from '@/modules/auth/domain/entities/user.entity';
import { IAuthQueryService } from '@/modules/auth/application/ports/services/auth-query.service.interface';

export class ListAllAdminUsersUseCase implements IListAllAdminUsersUseCase {
  constructor(
    @Inject('IAuthQueryService')
    private readonly authQueryService: IAuthQueryService,
  ) {}

  async execute(query: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<{ users: User[]; total: number }> {
    return await this.authQueryService.findAllAdminUsers(query);
  }
}
