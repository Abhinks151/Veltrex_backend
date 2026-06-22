import { User } from '../../../domain/entities/user.entity';

export interface IUpdateProfileImageUseCase {
  execute(userId: string, url: string, key: string): Promise<User>;
}
