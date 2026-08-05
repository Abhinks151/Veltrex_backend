import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { IRequest } from '@/shared/types/express-request.interface';
import { Role } from '@/shared/enums/roles.enum';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

@Injectable()
export class TenantValidationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<IRequest>();
    const user = request.user;
    const resolvedTenantId = request.tenantId;

    if (user?.role === Role.SUPER_ADMIN) {
      return true;
    }

    if (resolvedTenantId && user && user.tenantId !== resolvedTenantId) {
      throw new ForbiddenException(
        MESSAGE_CONSTANTS.ERROR.ACCESS_DENIED_SUBDOMAIN,
      );
    }

    return true;
  }
}
