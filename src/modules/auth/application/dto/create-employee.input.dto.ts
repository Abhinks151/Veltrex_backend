import { UserRole } from '@prisma/client';

export interface CreateEmployeeInput {
  email: string;
  password?: string;
  name: string;
  role: UserRole;
  tenantId: string;
}
