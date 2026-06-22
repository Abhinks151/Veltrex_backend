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

import { SubscriptionModule } from '../subscription/subscription.module';

import { PrismaModule } from '@/shared/infrastructure/prisma/prisma.module';
import { PartModule } from '../part/part.module';

@Module({
  imports: [AuthModule, SubscriptionModule, PrismaModule, PartModule],
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
  ],
})
export class RawMaterialModule {}
