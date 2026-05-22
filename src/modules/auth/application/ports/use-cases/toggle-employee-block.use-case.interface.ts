import { User } from '@/modules/auth/domain/entities/user.entity';

export interface IToggleEmployeeBlockUseCase {
  execute(id: string): Promise<User>;
}
