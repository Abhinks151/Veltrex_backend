import { forwardRef, Module } from '@nestjs/common';
import { PaymentController } from './presentation/payment.controller';
import { CreatePaymentOrderUseCase } from './application/use-cases/create-payment-order.use-case';
import { VerifyPaymentUseCase } from './application/use-cases/verify-payment.use-case';
import { RetryPaymentUseCase } from './application/use-cases/retry-payment.use-case';
import { GetLatestPendingPaymentUseCase } from './application/use-cases/get-latest-pending-payment.use-case';
import { ActivateFreePlanUseCase } from './application/use-cases/activate-free-plan.use-case';
import { RazorpayGateway } from './infrastructure/services/razorpay-gateway.service';
import { PrismaTransactionManager } from '@/shared/infrastructure/prisma/prisma-transaction-manager';
import { PrismaModule } from '@/shared/infrastructure/prisma/prisma.module';
import { SuperAdminModule } from '../super-admin/super-admin.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { TenantModule } from '../tenant/tenant.module';
import { PaymentRepository } from './infrastructure/repositories/payment.repository';

@Module({
  imports: [
    PrismaModule,
    SuperAdminModule,
    forwardRef(() => SubscriptionModule),
    forwardRef(() => TenantModule),
  ],
  controllers: [PaymentController],
  providers: [
    {
      provide: 'ITransactionManager',
      useClass: PrismaTransactionManager,
    },
    {
      provide: 'ICreatePaymentOrderUseCase',
      useClass: CreatePaymentOrderUseCase,
    },
    {
      provide: 'IVerifyPaymentUseCase',
      useClass: VerifyPaymentUseCase,
    },
    {
      provide: 'IRetryPaymentUseCase',
      useClass: RetryPaymentUseCase,
    },
    {
      provide: 'IGetLatestPendingPaymentUseCase',
      useClass: GetLatestPendingPaymentUseCase,
    },
    {
      provide: 'IActivateFreePlanUseCase',
      useClass: ActivateFreePlanUseCase,
    },
    {
      provide: 'IPaymentGateway',
      useClass: RazorpayGateway,
    },
    {
      provide: 'IPaymentRepository',
      useClass: PaymentRepository,
    },
  ],
  exports: [
    'ITransactionManager',
    'ICreatePaymentOrderUseCase',
    'IVerifyPaymentUseCase',
    'IRetryPaymentUseCase',
    'IGetLatestPendingPaymentUseCase',
    'IActivateFreePlanUseCase',
    'IPaymentGateway',
    'IPaymentRepository',
  ],
})
export class PaymentModule {}
