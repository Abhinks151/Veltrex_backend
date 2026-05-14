import { Inject, Injectable } from '@nestjs/common';
import { Tenant } from '../../domain/tenant.entity';
import { TenantCreationRequestDto } from '../dto/create-tenant.dto';
import { ICreateTenantUseCase } from '../ports/use-cases/create-tenant.use-cases.interface';
import { ITenantRepository } from '../ports/repositories/tenant-repository.interface';
import { IAuthQueryService } from '@/modules/auth/application/ports/services/auth-query.service.interface';
import { MESSAGE_CONSTANTS } from '../../../../shared/enums/messageConstants';
import { ISubscriptionQueryService } from '@/modules/subscription/application/ports/services/subscription-query.service.interface';
import { SubscriptionStatus } from '@/shared/enums/subscription-status.enum';
import { PlanType } from '@/shared/enums/plan-type.enum';
import { CreateSubscriptionDto } from '@/modules/subscription/application/dto/create-subscription.dto';
import { NotFoundError } from '../../../../shared/common/errors/domain-errors';

@Injectable()
export class CreateTenantUseCase implements ICreateTenantUseCase {
  constructor(
    @Inject('ITenantRepository')
    private readonly tenantRepository: ITenantRepository,

    @Inject('IAuthQueryService')
    private readonly authQueryService: IAuthQueryService,

    @Inject('ISubscriptionQueryService')
    private readonly subscriptionQueryService: ISubscriptionQueryService,
  ) {}

  async execute(
    reqDto: TenantCreationRequestDto,
    ownerId: string,
  ): Promise<Tenant> {
    const user =
      await this.authQueryService.validateUserForTenantCreation(ownerId);
    if (!user) {
      throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND);
    }

    // console.log(ownerId, "ownerId")
    const data = {
      name: reqDto.name,
      // password: reqDto.password,
      ownerId,
    };

    const response = await this.tenantRepository.create(data);
    try {
      const subscriptionData: CreateSubscriptionDto = {
        tenantId: response.id,
        plan: reqDto.plan ?? PlanType.FREE,
        status: SubscriptionStatus.ACTIVE,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        trialUsed: false,
        razorpaySubscriptionId: '',
      };
      await this.subscriptionQueryService.create(subscriptionData);
    } catch (error) {
      console.log(error);
    }

    return response;
  }
}
