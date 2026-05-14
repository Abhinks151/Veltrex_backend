// createUser
// findByEmail

import { User } from '../../../domain/entities/user.entity';
import { RegisterUserRequestDto } from '../../../presentation/dto/register-user.request.dto';
import { UpdateUserInputDto } from '../../dto/update-user-input.dto';
import { IBaseRepository } from '@/shared/infrastructure/repository/base-repository.interface';

export interface IUserRepository extends IBaseRepository<
  User,
  RegisterUserRequestDto,
  UpdateUserInputDto
> {
  // create(data: RegisterUserRequestDto): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findByUuid(uuid: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  // update(uuid: string, data: UpdateUserInputDto): Promise<User>
  findAllAdminUsers(query: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<{ users: User[]; total: number }>;
  updateBlockStatus(id: string, isBlocked: boolean): Promise<User>;
}
