import { UserRole } from '@prisma/client';

export interface RegisterUserInput {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
  tenantId?: string;
  isVerified?: boolean;
}
