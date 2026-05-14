import { User } from '../../../domain/entities/user.entity';

export interface IAuthQueryService {
  validateUserForTenantCreation(userId: string): Promise<boolean>;
  findAllAdminUsers(query: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<{ users: User[]; total: number }>;

  updateBlockStatus(id: string, isBlocked: boolean): Promise<User>;
  findById(id: string): Promise<User | null>;
  updateProfile(userId: string, name: string): Promise<User>;
  changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<User>;
  updateProfileImage(userId: string, url: string, key: string): Promise<User>;
}
