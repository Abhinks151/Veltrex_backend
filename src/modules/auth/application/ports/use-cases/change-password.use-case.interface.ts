import { User } from '../../../domain/entities/user.entity';

export interface IChangePasswordUseCase {
  execute(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<User>;
}
