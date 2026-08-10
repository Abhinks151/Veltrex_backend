import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { RawMaterialController } from './presentation/raw-material.controller';
import { RawMaterialRepository } from './infrastructure/repositories/raw-material-repository';
import { CreateRawMaterialUseCase } from './application/use-cases/create-raw-material.use-case';
import { EditRawMaterialUseCase } from './application/use-cases/edit-raw-material.use-case';
import { GetAllActiveRawMaterialsUseCase } from './application/use-cases/get-all-active-raw-materials.use-case';
import { BlockRawMaterialUseCase } from './application/use-cases/block-raw-material.use-case';
import { DeleteRawMaterialUseCase } from './application/use-cases/delete-raw-material.use-case';
import { ListRawMaterialsUseCase } from './application/use-cases/list-raw-materials.use-case';
import { CheckRawMaterialAvailabilityUseCase } from './application/use-cases/check-raw-material-availability.use-case';
import { UpdateRawMaterialStockUseCase } from './application/use-cases/update-raw-material-stock.use-case';

import { SubscriptionModule } from '../subscription/subscription.module';
import { NotificationModule } from '../notification/notification.module';

import { PrismaModule } from '@/shared/infrastructure/prisma/prisma.module';
import { PartModule } from '../part/part.module';
import { forwardRef } from '@nestjs/common';

@Module({
  imports: [
    AuthModule,
    SubscriptionModule,
    PrismaModule,
    forwardRef(() => PartModule),
    NotificationModule,
  ],
  controllers: [RawMaterialController],
  providers: [
    {
      provide: 'IRawMaterialRepository',
      useClass: RawMaterialRepository,
    },
    {
      provide: 'ICreateRawMaterialUseCase',
      useClass: CreateRawMaterialUseCase,
    },
    {
      provide: 'IEditRawMaterialUseCase',
      useClass: EditRawMaterialUseCase,
    },
    {
      provide: 'IGetAllActiveRawMaterialsUseCase',
      useClass: GetAllActiveRawMaterialsUseCase,
    },
    {
      provide: 'IListRawMaterialsUseCase',
      useClass: ListRawMaterialsUseCase,
    },
    {
      provide: 'IBlockRawMaterialUseCase',
      useClass: BlockRawMaterialUseCase,
    },
    {
      provide: 'IDeleteRawMaterialUseCase',
      useClass: DeleteRawMaterialUseCase,
    },
    {
      provide: 'ICheckRawMaterialAvailabilityUseCase',
      useClass: CheckRawMaterialAvailabilityUseCase,
    },
    {
      provide: 'IUpdateRawMaterialStockUseCase',
      useClass: UpdateRawMaterialStockUseCase,
    },
  ],
  exports: [
    'ICheckRawMaterialAvailabilityUseCase',
    'IUpdateRawMaterialStockUseCase',
  ],
})
export class RawMaterialModule {}
