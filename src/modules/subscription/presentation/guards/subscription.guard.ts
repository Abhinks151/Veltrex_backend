import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { IGetSubscriptionByTenantIdUseCase } from '../../application/ports/use-cases/get-subscription-by-tenant-id.use-case.interface';
import { SubscriptionStatus } from '@/shared/enums/subscription-status.enum';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import { Request } from 'express';
import { Role } from '@/shared/enums/roles.enum';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(
    @Inject('ISubscriptionGetByTenantIdUseCase')
    private readonly _getSubscriptionByTenantIdUseCase: IGetSubscriptionByTenantIdUseCase,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;

    if (user?.role === Role.SUPER_ADMIN) {
      return true;
    }

    if (!user || !user.tenantId) {
      throw new ForbiddenException(MESSAGE_CONSTANTS.ERROR.TENANT_ID_MISSING);
    }

    const subscription = await this._getSubscriptionByTenantIdUseCase.execute(
      user.tenantId,
    );

    if (!subscription) {
      throw new ForbiddenException(
        MESSAGE_CONSTANTS.ERROR.NO_SUBSCRIPTION_FOUND,
      );
    }

    if (subscription.status !== SubscriptionStatus.ACTIVE) {
      throw new ForbiddenException(
        MESSAGE_CONSTANTS.ERROR.SUBSCRIPTION_RESTRICTED,
      );
    }

    const currentDate = new Date();
    if (subscription.endDate && currentDate > subscription.endDate) {
      throw new ForbiddenException(
        MESSAGE_CONSTANTS.ERROR.SUBSCRIPTION_EXPIRED,
      );
    }

    return true;
  }
}
