import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IActivateFreePlanUseCase } from '../ports/use-cases/activate-free-plan.use-case.interface';
import { ActivateFreePlanDto } from '../dto/activate-free-plan.dto';
import { ActivateFreePlanResponseDto } from '../dto/activate-free-plan-response.dto';
import { IPlanRepository } from '@/modules/super-admin/application/ports/repositories/plan-repository.interface';
import { ISubscriptionRepository } from '@/modules/subscription/application/ports/repositories/subscription-repository.interface';
import { ITransactionManager } from '@/shared/application/ports/transaction-manager.interface';
import { SubscriptionStatus } from '@prisma/client';
import { ITenantRepository } from '@/modules/tenant/application/ports/repositories/tenant-repository.interface';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

@Injectable()
export class ActivateFreePlanUseCase implements IActivateFreePlanUseCase {
  constructor(
    @Inject('ITransactionManager')
    private readonly _txManager: ITransactionManager,
    @Inject('IPlanRepository')
    private readonly _planRepository: IPlanRepository,
    @Inject('ISubscriptionRepository')
    private readonly _subscriptionRepository: ISubscriptionRepository,
    @Inject('ITenantRepository')
    private readonly _tenantRepository: ITenantRepository,
  ) {}

  async execute(
    data: ActivateFreePlanDto,
  ): Promise<ActivateFreePlanResponseDto> {
    const plan = await this._planRepository.findById(data.planId);
    if (!plan)
      throw new NotFoundException(MESSAGE_CONSTANTS.ERROR.PLAN_NOT_FOUND);

    if (Number(plan.price) > 0) {
      throw new BadRequestException(MESSAGE_CONSTANTS.ERROR.FREE_PLAN_ONLY);
    }

    const tenant = await this._tenantRepository.findById(data.tenantId);
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

      await this._tenantRepository.markTrialAsUsed(data.tenantId, ctx);

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
