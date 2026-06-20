import { Inject, Injectable } from '@nestjs/common';
import { Tenant } from '../../domain/tenant.entity';
import { TenantCreationRequestDto } from '../dto/create-tenant.dto';
import { ICreateTenantUseCase } from '../ports/use-cases/create-tenant.use-cases.interface';
import { ITenantRepository } from '../ports/repositories/tenant-repository.interface';
import { IAuthQueryService } from '@/modules/auth/application/ports/services/auth-query.service.interface';
import { MESSAGE_CONSTANTS } from '../../../../shared/enums/messageConstants';
import { ISubscriptionQueryService } from '@/modules/subscription/application/ports/services/subscription-query.service.interface';
import { SubscriptionStatus } from '@/shared/enums/subscription-status.enum';
import { CreateSubscriptionDto } from '@/modules/subscription/application/dto/create-subscription.dto';
import { IPlanRepository } from '@/modules/super-admin/application/ports/repositories/plan-repository.interface';
import {
  ConflictError,
  NotFoundError,
} from '../../../../shared/common/errors/domain-errors';

@Injectable()
export class CreateTenantUseCase implements ICreateTenantUseCase {
  constructor(
    @Inject('ITenantRepository')
    private readonly _tenantRepository: ITenantRepository,

    @Inject('IAuthQueryService')
    private readonly _authQueryService: IAuthQueryService,

    @Inject('ISubscriptionQueryService')
    private readonly _subscriptionQueryService: ISubscriptionQueryService,

    @Inject('IPlanRepository')
    private readonly _planRepository: IPlanRepository,
  ) {}

  async execute(
    reqDto: TenantCreationRequestDto,
    ownerId: string,
  ): Promise<Tenant> {
    const user =
      await this._authQueryService.validateUserForTenantCreation(ownerId);
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

    // Fetch the plan from database
    const planCode = reqDto.plan || 'TRIAL';
    const plan = await this._planRepository.findByCode(planCode);
    if (!plan) {
      throw new NotFoundError(`Plan with code ${planCode} not found`);
    }

    const data = {
      name: reqDto.name,
      ownerId,
    };

    const response = await this._tenantRepository.create(data);
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
      await this._subscriptionQueryService.create(subscriptionData);
    } catch (error) {
      console.log(
        'Subscription creation failed during tenant creation:',
        error,
      );
    }

    return response;
  }
}
