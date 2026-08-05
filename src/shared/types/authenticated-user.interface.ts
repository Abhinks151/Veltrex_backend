import { Role } from '@/shared/enums/roles.enum';

export interface IAuthenticatedUser {
  userId: string;
  id: string;
  name: string;
  uuid: string;
  email: string;
  role: Role;
  is_verified: boolean;
  profileImage?: string;
  tenantId?: string;
}

export interface IRequestTenant {
  id: string;
  name: string;
  subdomain: string | null;
  ownerId: string;
  isBlocked: boolean;
  isDeleted: boolean;
  trialUsed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
