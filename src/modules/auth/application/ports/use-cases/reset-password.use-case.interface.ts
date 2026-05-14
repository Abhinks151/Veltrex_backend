import { User } from '../../../domain/entities/user.entity';

export interface IUserResetPasswordUseCase {
  execute(token: string, password: string): Promise<User>;
}
