import { Role } from '@/shared/enums/roles.enum';
import 'express';

declare global {
  namespace Express {
    interface User {
      userId: string;
      uuid: string;
      email: string;
      role: Role;
      is_verified: boolean;
      tenantId?: string;
    }

    interface Request {
      requestId: string;
      cookies: Record<string, string>;
      user?: User;
    }
  }
}
