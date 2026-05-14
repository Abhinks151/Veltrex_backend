import { User } from '@/modules/auth/domain/entities/user.entity';

export interface IUpdateProfileUseCase {
  execute(userId: string, name: string): Promise<User>;
}
