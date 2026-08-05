import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IActivateFreePlanUseCase } from '../ports/use-cases/activate-free-plan.use-case.interface';
import { ActivateFreePlanDto } from '../dto/activate-free-plan.dto';
import { ActivateFreePlanResponseDto } from '../dto/activate-free-plan-response.dto';
import { IGetPlanByIdUseCase } from '@/modules/super-admin/application/ports/use-cases/get-plan-by-id.use-case.interface';
import { ISubscriptionRepository } from '@/modules/subscription/application/ports/repositories/subscription-repository.interface';
import { ITransactionManager } from '@/shared/application/ports/transaction-manager.interface';
import { SubscriptionStatus } from '@/shared/enums/subscription-status.enum';
import { IGetTenantByIdUseCase } from '@/modules/tenant/application/ports/use-cases/get-tenant-by-id.use-case.interface';
import { ITenantMarkTrialAsUsedUseCase } from '@/modules/tenant/application/ports/use-cases/mark-trial-as-used.use-case.interface';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

@Injectable()
export class ActivateFreePlanUseCase implements IActivateFreePlanUseCase {
  constructor(
    @Inject('ITransactionManager')
    private readonly _txManager: ITransactionManager,
    @Inject('ISuperAdminGetPlanByIdUseCase')
    private readonly _getPlanByIdUseCase: IGetPlanByIdUseCase,
    @Inject('ISubscriptionRepository')
    private readonly _subscriptionRepository: ISubscriptionRepository,
    @Inject('ITenantGetByIdUseCase')
    private readonly _getTenantByIdUseCase: IGetTenantByIdUseCase,
    @Inject('ITenantMarkTrialAsUsedUseCase')
    private readonly _markTrialAsUsedUseCase: ITenantMarkTrialAsUsedUseCase,
  ) {}

  async execute(
    data: ActivateFreePlanDto,
  ): Promise<ActivateFreePlanResponseDto> {
    const plan = await this._getPlanByIdUseCase.execute(data.planId);
    if (!plan)
      throw new NotFoundException(MESSAGE_CONSTANTS.ERROR.PLAN_NOT_FOUND);

    if (Number(plan.price) > 0) {
      throw new BadRequestException(MESSAGE_CONSTANTS.ERROR.FREE_PLAN_ONLY);
    }

    const tenant = await this._getTenantByIdUseCase.execute(data.tenantId);
    if (!tenant)
      throw new NotFoundException(MESSAGE_CONSTANTS.ERROR.TENANT_NOT_FOUND);

    if (tenant.trialUsed) {
      throw new BadRequestException(MESSAGE_CONSTANTS.ERROR.TRIAL_ALREADY_USED);
    }

    const existing = await this._subscriptionRepository.findByTenantId(
      data.tenantId,
    );
    if (existing && existing.status === SubscriptionStatus.ACTIVE) {
      const isFreePlan = !existing.plan || Number(existing.plan.price) === 0;
      if (!isFreePlan) {
        throw new BadRequestException(
          MESSAGE_CONSTANTS.ERROR.FREE_PLAN_ACTIVATION_BLOCKED,
        );
      }
    }

    const startDate = new Date();
    const endDate = new Date();
    if (plan.durationDays) {
      endDate.setDate(endDate.getDate() + plan.durationDays);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 100);
    }

    return this._txManager.run(async (ctx) => {
      const existingActive =
        await this._subscriptionRepository.findActiveByTenantId(
          data.tenantId,
          ctx,
        );
      if (existingActive) {
        await this._subscriptionRepository.expireSubscription(
          existingActive.id,
          ctx,
        );
      }

      await this._markTrialAsUsedUseCase.execute(data.tenantId, ctx);

      const subscription = await this._subscriptionRepository.create(
        {
          tenantId: data.tenantId,
          planId: plan.id,
          status: SubscriptionStatus.ACTIVE,
          startDate,
          endDate,
          trialUsed: true,
        },
        ctx,
      );

      return { subscriptionId: subscription.id };
    });
  }
}
