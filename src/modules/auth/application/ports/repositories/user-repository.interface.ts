// createUser
// findByEmail

import { User } from '../../../domain/entities/user.entity';
import { RegisterUserInput } from '../../dto/register-user-input.dto';
import { UpdateUserInputDto } from '../../dto/update-user-input.dto';
import { IBaseRepository } from '@/shared/infrastructure/repository/base-repository.interface';
import { ITransactionContext } from '@/shared/application/ports/transaction-context.interface';

export interface IUserRepository extends IBaseRepository<
  User,
  RegisterUserInput,
  UpdateUserInputDto
> {
  findByEmail(email: string): Promise<User | null>;
  findByUuid(uuid: string): Promise<User | null>;
  findById(id: string, ctx?: ITransactionContext): Promise<User | null>;
  findAllEmployees(
    tenantId: string,
    query: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      sort?: string;
    },
  ): Promise<{ items: User[]; users: User[]; total: number }>;
  delete(id: string): Promise<User>;
  updateBlockStatus(id: string, isBlocked: boolean): Promise<User>;
  findAllAdminUsers(query: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<{ items: User[]; users: User[]; total: number }>;
}
