import { Inject, Injectable } from '@nestjs/common';
import { Tenant } from '../../domain/tenant.entity';
import { TenantCreationRequestDto } from '../dto/create-tenant.dto';
import { ICreateTenantUseCase } from '../ports/use-cases/create-tenant.use-cases.interface';
import { ITenantRepository } from '../ports/repositories/tenant-repository.interface';
import { IValidateUserForTenantCreationUseCase } from '@/modules/auth/application/ports/use-cases/validate-user-for-tenant-creation.use-case.interface';
import { MESSAGE_CONSTANTS } from '../../../../shared/enums/messageConstants';
import { ICreateSubscriptionUseCase } from '@/modules/subscription/application/ports/use-cases/create-subscription.use-case.interface';
import { SubscriptionStatus } from '@/shared/enums/subscription-status.enum';
import { CreateSubscriptionDto } from '@/modules/subscription/application/dto/create-subscription.dto';
import { IGetPlanByCodeUseCase } from '@/modules/super-admin/application/ports/use-cases/get-plan-by-code.use-case.interface';
import { IUpdateUserUseCase } from '@/modules/auth/application/ports/use-cases/update-user.use-case.interface';

import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from '../../../../shared/common/errors/domain-errors';
import { RESERVED_SUBDOMAINS } from '@/shared/enums/reserved-subdomains.constants';

@Injectable()
export class CreateTenantUseCase implements ICreateTenantUseCase {
  constructor(
    @Inject('ITenantRepository')
    private readonly _tenantRepository: ITenantRepository,

    @Inject('IAuthValidateUserForTenantCreationUseCase')
    private readonly _validateUserForTenantCreationUseCase: IValidateUserForTenantCreationUseCase,

    @Inject('ISubscriptionCreateUseCase')
    private readonly _createSubscriptionUseCase: ICreateSubscriptionUseCase,

    @Inject('ISuperAdminGetPlanByCodeUseCase')
    private readonly _getPlanByCodeUseCase: IGetPlanByCodeUseCase,

    @Inject('IAuthUpdateUserUseCase')
    private readonly _updateUserUseCase: IUpdateUserUseCase,
  ) {}

  async execute(
    reqDto: TenantCreationRequestDto,
    ownerId: string,
  ): Promise<Tenant> {
    const user =
      await this._validateUserForTenantCreationUseCase.execute(ownerId);
    if (!user) {
      throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND);
    }

    const userHasTenant = await this._tenantRepository.findByOwnerId(ownerId);
    if (userHasTenant) {
      throw new ConflictError(MESSAGE_CONSTANTS.ERROR.USER_ALREADY_HAS_TENANT);
    }

    const nameTaken = await this._tenantRepository.findByName(reqDto.name);
    if (nameTaken) {
      throw new ConflictError(MESSAGE_CONSTANTS.ERROR.TENANT_NAME_TAKEN);
    }

    if (!reqDto.subdomain) {
      throw new BadRequestError('Subdomain is required');
    }

    if (RESERVED_SUBDOMAINS.includes(reqDto.subdomain.toLowerCase())) {
      throw new BadRequestError(
        `The subdomain "${reqDto.subdomain}" is reserved and cannot be used`,
      );
    }

    const subdomainTaken = await this._tenantRepository.findBySubdomain(
      reqDto.subdomain,
    );
    if (subdomainTaken) {
      throw new ConflictError('Subdomain is already taken');
    }

    // Fetch the plan from database
    const planCode = reqDto.plan || 'TRIAL';
    const plan = await this._getPlanByCodeUseCase.execute(planCode);
    if (!plan) {
      throw new NotFoundError(`Plan with code ${planCode} not found`);
    }

    const data = {
      name: reqDto.name,
      subdomain: reqDto.subdomain,
      ownerId,
    };

    const response = await this._tenantRepository.create(data);

    // Link the user to the tenant
    try {
      await this._updateUserUseCase.execute({ tenantId: response.id }, ownerId);
    } catch (error) {
      console.log(
        'Failed to update user tenantId during tenant creation:',
        error,
      );
    }

    try {
      let endDate: Date;
      if (plan.durationDays) {
        endDate = new Date(
          Date.now() + plan.durationDays * 24 * 60 * 60 * 1000,
        );
      } else {
        endDate = new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000);
      }

      const subscriptionData: CreateSubscriptionDto = {
        tenantId: response.id,
        planId: plan.id,
        status:
          plan.price === 0
            ? SubscriptionStatus.ACTIVE
            : SubscriptionStatus.EXPIRED,
        startDate: new Date(),
        endDate: endDate,
        trialUsed: planCode === 'TRIAL',
        razorpaySubscriptionId: '',
      };
      await this._createSubscriptionUseCase.execute(ownerId, subscriptionData);
    } catch (error) {
      console.log(
        'Subscription creation failed during tenant creation:',
        error,
      );
    }

    return response;
  }
}
