import { User } from '../../../domain/entities/user.entity';

export interface IListAllAdminUsersUseCase {
  execute(query: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<{ users: User[]; total: number }>;
}
