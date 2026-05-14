// import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

// @Injectable()
// export class IsVerifiedGuard implements CanActivate {
//   canActivate(context: ExecutionContext): boolean {
//     const request = context.switchToHttp().getRequest();
//     const user = request.user;

//     if (!user) {
//       return false;
//     }

//     if (!user.is_verified) {
//       throw new ForbiddenException('User email is not verified');
//     }

//     return true;
//   }
// }

import { Request } from 'express';
import { MESSAGE_CONSTANTS } from '../../../../shared/enums/messageConstants';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class IsVerifiedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException(
        MESSAGE_CONSTANTS.ERROR.USER_NOT_AUTHENTICATED,
      );
    }

    if (!user.is_verified) {
      throw new ForbiddenException(
        MESSAGE_CONSTANTS.ERROR.USER_EMAIL_NOT_VERIFIED,
      );
    }

    return true;
  }
}
