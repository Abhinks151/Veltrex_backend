import { Role } from '@/shared/enums/roles.enum';

export interface AuthenticatedUser {
  userId: string;
  uuid: string;
  email: string;
  role: Role;
  is_verified: boolean;
}
