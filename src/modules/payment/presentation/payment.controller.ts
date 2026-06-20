import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ICreatePaymentOrderUseCase } from '../application/ports/use-cases/create-payment-order.use-case.interface';
import { IVerifyPaymentUseCase } from '../application/ports/use-cases/verify-payment.use-case.interface';
import { IRetryPaymentUseCase } from '../application/ports/use-cases/retry-payment.use-case.interface';
import { IGetLatestPendingPaymentUseCase } from '../application/ports/use-cases/get-latest-pending-payment.use-case.interface';
import { IActivateFreePlanUseCase } from '../application/ports/use-cases/activate-free-plan.use-case.interface';
import { CreatePaymentOrderRequestDto } from './dto/create-payment-order.request.dto';
import { VerifyPaymentRequestDto } from './dto/verify-payment.request.dto';
import { ActivateFreePlanRequestDto } from './dto/activate-free-plan.request.dto';
import { Roles } from '@/modules/auth/presentation/decorators/roles.decorator';
import { Role } from '@/shared/enums/roles.enum';
import { RolesGuard } from '@/modules/auth/presentation/guards/roles.guard';
import { Auth } from '@/modules/auth/presentation/decorators/auth.decorator';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import { ApiResponse } from '@/shared/common/apiResponse/api-response';
import { Request } from 'express';

@Auth()
@Controller('payment')
export class PaymentController {
  constructor(
    @Inject('ICreatePaymentOrderUseCase')
    private readonly _createPaymentOrderUseCase: ICreatePaymentOrderUseCase,
    @Inject('IVerifyPaymentUseCase')
    private readonly _verifyPaymentUseCase: IVerifyPaymentUseCase,
    @Inject('IRetryPaymentUseCase')
    private readonly _retryPaymentUseCase: IRetryPaymentUseCase,
    @Inject('IGetLatestPendingPaymentUseCase')
    private readonly _getLatestPendingPaymentUseCase: IGetLatestPendingPaymentUseCase,
    @Inject('IActivateFreePlanUseCase')
    private readonly _activateFreePlanUseCase: IActivateFreePlanUseCase,
  ) {}

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Post('create-order')
  async createOrder(
    @Req() req: Request,
    @Body() data: CreatePaymentOrderRequestDto,
  ) {
    if (!req.user) {
      throw new UnauthorizedException(MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND);
    }
    const response = await this._createPaymentOrderUseCase.execute(data);
    return new ApiResponse(
      true,
      response,
      MESSAGE_CONSTANTS.SUCCESS.ORDER_CREATED,
    );
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Post('verify')
  async verifyPayment(
    @Req() req: Request,
    @Body() data: VerifyPaymentRequestDto,
  ) {
    if (!req.user) {
      throw new UnauthorizedException(MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND);
    }
    const response = await this._verifyPaymentUseCase.execute(data);
    return new ApiResponse(
      true,
      response,
      MESSAGE_CONSTANTS.SUCCESS.PAYMENT_VERIFIED,
    );
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Post('retry/:paymentId')
  async retryPayment(
    @Req() req: Request,
    @Param('paymentId') paymentId: string,
  ) {
    if (!req.user) {
      throw new UnauthorizedException(MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND);
    }
    const response = await this._retryPaymentUseCase.execute(paymentId);
    return new ApiResponse(
      true,
      response,
      MESSAGE_CONSTANTS.SUCCESS.RETRY_ORDER_CREATED,
    );
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Get('latest-pending')
  async getLatestPending(@Req() req: Request) {
    if (!req.user?.tenantId) {
      throw new UnauthorizedException(MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND);
    }
    const payment = await this._getLatestPendingPaymentUseCase.execute(
      req.user.tenantId,
    );
    return new ApiResponse(
      true,
      payment,
      MESSAGE_CONSTANTS.SUCCESS.LATEST_PENDING_FETCHED,
    );
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Post('activate-free')
  async activateFreePlan(
    @Req() req: Request,
    @Body() data: ActivateFreePlanRequestDto,
  ) {
    if (!req.user) {
      throw new UnauthorizedException(MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND);
    }
    const response = await this._activateFreePlanUseCase.execute(data);
    return new ApiResponse(
      true,
      response,
      MESSAGE_CONSTANTS.SUCCESS.FREE_PLAN_ACTIVATED,
    );
  }
}
