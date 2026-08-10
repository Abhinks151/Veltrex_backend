import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { PrismaModule } from '@/shared/infrastructure/prisma/prisma.module';
import { MachineModule } from '../machine/machine.module';
import { MaintenanceController } from './presentation/maintenance.controller';
import { MaintenanceTicketRepository } from './infrastructure/repositories/maintenance-ticket.repository';
import { CreateMaintenanceTicketUseCase } from './application/use-cases/create-maintenance-ticket.use-case';
import { AssignMaintenanceTicketUseCase } from './application/use-cases/assign-maintenance-ticket.use-case';
import { ReleaseMaintenanceTicketUseCase } from './application/use-cases/release-maintenance-ticket.use-case';
import { CloseMaintenanceTicketUseCase } from './application/use-cases/close-maintenance-ticket.use-case';
import { ListOpenTicketsUseCase } from './application/use-cases/list-open-tickets.use-case';
import { ListMyTicketsUseCase } from './application/use-cases/list-my-tickets.use-case';
import { ListAllTicketsUseCase } from './application/use-cases/list-all-tickets.use-case';
import { ListMachinistTicketsUseCase } from './application/use-cases/list-machinist-tickets.use-case';
import { GetMachinistMachinesUseCase } from './application/use-cases/get-machinist-machines.use-case';
import { CheckMachineMaintenanceUseCase } from './application/use-cases/check-machine-maintenance.use-case';
import { PrismaTransactionManager } from '@/shared/infrastructure/prisma/prisma-transaction-manager';
import { DeleteMaintenanceTicketUseCase } from './application/use-cases/delete-maintenance-ticket.use-case';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    AuthModule,
    SubscriptionModule,
    PrismaModule,
    forwardRef(() => MachineModule),
    NotificationModule,
  ],
  controllers: [MaintenanceController],
  providers: [
    {
      provide: 'ITransactionManager',
      useClass: PrismaTransactionManager,
    },
    {
      provide: 'IMaintenanceTicketRepository',
      useClass: MaintenanceTicketRepository,
    },
    {
      provide: 'ICreateMaintenanceTicketUseCase',
      useClass: CreateMaintenanceTicketUseCase,
    },
    {
      provide: 'IAssignMaintenanceTicketUseCase',
      useClass: AssignMaintenanceTicketUseCase,
    },
    {
      provide: 'IReleaseMaintenanceTicketUseCase',
      useClass: ReleaseMaintenanceTicketUseCase,
    },
    {
      provide: 'ICloseMaintenanceTicketUseCase',
      useClass: CloseMaintenanceTicketUseCase,
    },
    {
      provide: 'IListOpenTicketsUseCase',
      useClass: ListOpenTicketsUseCase,
    },
    {
      provide: 'IListMyTicketsUseCase',
      useClass: ListMyTicketsUseCase,
    },
    {
      provide: 'IListAllTicketsUseCase',
      useClass: ListAllTicketsUseCase,
    },
    {
      provide: 'IListMachinistTicketsUseCase',
      useClass: ListMachinistTicketsUseCase,
    },
    {
      provide: 'IGetMachinistMachinesUseCase',
      useClass: GetMachinistMachinesUseCase,
    },
    {
      provide: 'ICheckMachineMaintenanceUseCase',
      useClass: CheckMachineMaintenanceUseCase,
    },
    {
      provide: 'IDeleteMaintenanceTicketUseCase',
      useClass: DeleteMaintenanceTicketUseCase,
    },
  ],
  exports: ['IMaintenanceTicketRepository', 'ICheckMachineMaintenanceUseCase'],
})
export class MaintenanceModule {}
