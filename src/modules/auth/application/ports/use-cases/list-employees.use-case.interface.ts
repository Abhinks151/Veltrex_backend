import { User } from '@/modules/auth/domain/entities/user.entity';

export interface IListEmployeesUseCase {
  execute(
    tenantId: string,
    query: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      sort?: string;
    },
  ): Promise<{ users: User[]; total: number }>;
}
