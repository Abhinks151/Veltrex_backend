import { User } from '../../../domain/entities/user.entity';

export interface IGetUserByIdUseCase {
  execute(id: string): Promise<User | null>;
}
