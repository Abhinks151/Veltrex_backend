import { User } from '@/modules/auth/domain/entities/user.entity';

export interface IToggleUserBlockUseCase {
  execute(id: string): Promise<User>;
}
