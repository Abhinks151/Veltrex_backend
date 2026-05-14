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
    }

    interface Request {
      requestId: string;
    }

    interface Request {
      cookies: Record<string, string>;
    }
  }
}
