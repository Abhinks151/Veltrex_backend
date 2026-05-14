import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@/shared/enums/roles.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { MESSAGE_CONSTANTS } from '../../../../shared/enums/messageConstants';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<Request>();

    if (!user) {
      throw new ForbiddenException(
        MESSAGE_CONSTANTS.ERROR.USER_NOT_AUTHENTICATED,
      );
    }

    if (!user.role) {
      throw new ForbiddenException('User role is missing');
    }

    const hasRole = requiredRoles.some((role) => user.role === role);
    if (!hasRole) {
      throw new ForbiddenException(`Access denied for role: ${user.role}`);
    }

    return true;
  }
}
