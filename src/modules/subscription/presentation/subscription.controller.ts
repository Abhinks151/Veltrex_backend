import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ICreateSubscriptionUseCase } from '../application/ports/use-cases/create-subscription.use-case.interface';
import { Roles } from '@/modules/auth/presentation/decorators/roles.decorator';
import { Role } from '@/shared/enums/roles.enum';
import { RolesGuard } from '@/modules/auth/presentation/guards/roles.guard';
import { Auth } from '@/modules/auth/presentation/decorators/auth.decorator';
import { Request } from 'express';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import { ApiResponse } from '@/shared/common/apiResponse/api-response';
import { IGetSubscriptionUseCase } from '../application/ports/use-cases/get-subscription.use-case.interface';
import { IToggleStatusUseCase } from '../application/ports/use-cases/toggle-status.use-case.interface';

import { CreateSubscriptionDto } from '../presentation/dto/create-subscription.dto';

@Controller('subscription')
export class SubscriptionController {
  constructor(
    @Inject('ICreateSubscriptionUseCase')
    private readonly _createSubscriptionUseCase: ICreateSubscriptionUseCase,
    @Inject('IGetSubscriptionUseCase')
    private readonly _getSubscriptionUseCase: IGetSubscriptionUseCase,

    @Inject('IToggleStatusUseCase')
    private readonly _toggleStatusUseCase: IToggleStatusUseCase,
  ) {}

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Auth()
  @Post('create')
  async createSubscription(
    @Req() req: Request,
    @Body() data: CreateSubscriptionDto,
  ) {
    // const userId = "placeholder-user-id";
    if (!req.user) {
      throw new UnauthorizedException(MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND);
    }

    const mappedData = {
      tenantId: data.tenantId,
      planId: data.planId,
      status: data.status,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      trialUsed: data.trialUsed || false,
      razorpaySubscriptionId: data.razorpaySubscriptionId || '',
    };

    const reposnse = await this._createSubscriptionUseCase.execute(
      req.user.userId,
      mappedData,
    );
    return new ApiResponse(
      true,
      reposnse,
      MESSAGE_CONSTANTS.SUCCESS.SUBSCRIPTION_CREATED,
    );
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Auth()
  @Get('get')
  async getSubscription(@Req() req: Request) {
    // const userId = "placeholder-user-id";
    if (!req.user) {
      throw new UnauthorizedException(MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND);
    }

    const reposnse = await this._getSubscriptionUseCase.execute(
      req.user.userId,
    );
    return new ApiResponse(
      true,
      reposnse,
      MESSAGE_CONSTANTS.SUCCESS.SUBSCRIPTION_FETCHED,
    );
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Auth()
  @Patch('toggle-status/:id')
  async toggleStatus(@Req() req: Request, @Param('id') id: string) {
    // console.log(id);
    const reposnse = await this._toggleStatusUseCase.execute(id);
    return new ApiResponse(
      true,
      reposnse,
      MESSAGE_CONSTANTS.SUCCESS.SUBSCRIPTION_UPDATED,
    );
  }
}
