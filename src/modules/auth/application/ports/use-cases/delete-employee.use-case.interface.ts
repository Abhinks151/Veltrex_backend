import { User } from '@/modules/auth/domain/entities/user.entity';

export interface ISoftDeleteEmployeeUseCase {
  execute(id: string): Promise<User>;
}
