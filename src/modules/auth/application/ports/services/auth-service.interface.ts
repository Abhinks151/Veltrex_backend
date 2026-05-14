import { User } from '../../../domain/entities/user.entity';

export interface IAuthService {
  validateUser(email: string, password: string): Promise<User | null>;
}
