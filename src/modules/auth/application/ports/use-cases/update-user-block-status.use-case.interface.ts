import { User } from '../../../domain/entities/user.entity';

export interface IUpdateUserBlockStatusUseCase {
  execute(id: string, isBlocked: boolean): Promise<User>;
}
