import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MachineController } from './presentation/machine.controller';
import { MachineRepository } from './infrastructure/repositories/machine-repository';
import { CreateMachineUseCase } from './application/use-cases/create-machine.use-case';
import { EditMachineUseCase } from './application/use-cases/edit-machine.use-case';
import { GetAllActiveMachinesUseCase } from './application/use-cases/get-all-active-machines.use-case';
import { BlockMachineUseCase } from './application/use-cases/block-machine.use-case';
import { DeleteMachineUseCase } from './application/use-cases/delete-machine.use-case';
import { ListMachinesUseCase } from './application/use-cases/list-machines.use-case';

import { SubscriptionModule } from '../subscription/subscription.module';

import { PrismaModule } from '@/shared/infrastructure/prisma/prisma.module';
import { PartModule } from '../part/part.module';

@Module({
  imports: [AuthModule, SubscriptionModule, PrismaModule, PartModule],
  controllers: [MachineController],
  providers: [
    {
      provide: 'IMachineRepository',
      useClass: MachineRepository,
    },
    {
      provide: 'ICreateMachineUseCase',
      useClass: CreateMachineUseCase,
    },
    {
      provide: 'IEditMachineUseCase',
      useClass: EditMachineUseCase,
    },
    {
      provide: 'IGetAllActiveMachinesUseCase',
      useClass: GetAllActiveMachinesUseCase,
    },
    {
      provide: 'IListMachinesUseCase',
      useClass: ListMachinesUseCase,
    },
    {
      provide: 'IBlockMachineUseCase',
      useClass: BlockMachineUseCase,
    },
    {
      provide: 'IDeleteMachineUseCase',
      useClass: DeleteMachineUseCase,
    },
  ],
})
export class MachineModule {}
