import { User } from '@/modules/auth/domain/entities/user.entity';

export interface IUpdateEmployeeUseCase {
  execute(
    id: string,
    data: {
      name?: string;
      role?: string;
    },
  ): Promise<User>;
}
