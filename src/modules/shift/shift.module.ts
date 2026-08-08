import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { PrismaModule } from '@/shared/infrastructure/prisma/prisma.module';
import { PrismaTransactionManager } from '@/shared/infrastructure/prisma/prisma-transaction-manager';

import { ShiftController } from './presentation/shift.controller';
import { ShiftTemplateRepository } from './infrastructure/repositories/shift-template.repository';
import { ProductionShiftRepository } from './infrastructure/repositories/production-shift.repository';

import { ShiftGeneratorService } from './infrastructure/services/shift-generator.service';
import { ShiftCronService } from './infrastructure/services/shift-cron.service';

import { CreateShiftTemplateUseCase } from './application/use-cases/create-shift-template.use-case';
import { EditShiftTemplateUseCase } from './application/use-cases/edit-shift-template.use-case';
import { DeleteShiftTemplateUseCase } from './application/use-cases/delete-shift-template.use-case';
import { ListShiftTemplatesUseCase } from './application/use-cases/list-shift-templates.use-case';
import { GenerateProductionShiftUseCase } from './application/use-cases/generate-production-shift.use-case';
import { ListProductionShiftsUseCase } from './application/use-cases/list-production-shifts.use-case';
import { UpdateShiftJobProgressUseCase } from './application/use-cases/update-shift-job-progress.use-case';
import { GetMachinistDashboardUseCase } from './application/use-cases/get-machinist-dashboard.use-case';
import { GetAdminDashboardUseCase } from './application/use-cases/get-admin-dashboard.use-case';
import { MachineModule } from '../machine/machine.module';
import { PartModule } from '../part/part.module';

@Module({
  imports: [
    AuthModule,
    SubscriptionModule,
    MachineModule,
    PartModule,
    PrismaModule,
  ],
  controllers: [ShiftController],
  providers: [
    ShiftCronService,
    {
      provide: 'IShiftGeneratorService',
      useClass: ShiftGeneratorService,
    },
    {
      provide: 'ITransactionManager',
      useClass: PrismaTransactionManager,
    },
    {
      provide: 'IShiftTemplateRepository',
      useClass: ShiftTemplateRepository,
    },
    {
      provide: 'IProductionShiftRepository',
      useClass: ProductionShiftRepository,
    },
    {
      provide: 'ICreateShiftTemplateUseCase',
      useClass: CreateShiftTemplateUseCase,
    },
    {
      provide: 'IEditShiftTemplateUseCase',
      useClass: EditShiftTemplateUseCase,
    },
    {
      provide: 'IDeleteShiftTemplateUseCase',
      useClass: DeleteShiftTemplateUseCase,
    },
    {
      provide: 'IListShiftTemplatesUseCase',
      useClass: ListShiftTemplatesUseCase,
    },
    {
      provide: 'IGenerateProductionShiftUseCase',
      useClass: GenerateProductionShiftUseCase,
    },
    {
      provide: 'IListProductionShiftsUseCase',
      useClass: ListProductionShiftsUseCase,
    },
    {
      provide: 'IUpdateShiftJobProgressUseCase',
      useClass: UpdateShiftJobProgressUseCase,
    },
    {
      provide: 'IGetMachinistDashboardUseCase',
      useClass: GetMachinistDashboardUseCase,
    },
    {
      provide: 'IGetAdminDashboardUseCase',
      useClass: GetAdminDashboardUseCase,
    },
  ],
  exports: ['IShiftTemplateRepository', 'IProductionShiftRepository'],
})
export class ShiftModule {}
