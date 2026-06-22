import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PartController } from './presentation/part.controller';
import { PartRepository } from './infrastructure/repositories/part-repository';
import { CreatePartUseCase } from './application/use-cases/create-part.use-case';
import { EditPartUseCase } from './application/use-cases/edit-part.use-case';
import { GetAllActivePartsUseCase } from './application/use-cases/get-all-active-parts.use-case';
import { BlockPartUseCase } from './application/use-cases/block-part.use-case';
import { DeletePartUseCase } from './application/use-cases/delete-part.use-case';
import { ListPartsUseCase } from './application/use-cases/list-parts.use-case';
import { SubscriptionModule } from '../subscription/subscription.module';
import { StorageModule } from '@/shared/infrastructure/storage/storage.module';

import { PrismaModule } from '@/shared/infrastructure/prisma/prisma.module';

import { JobModule } from '../job/job.module';
import { forwardRef } from '@nestjs/common';

import { CheckResourceInUseUseCase } from './application/use-cases/check-resource-in-use.use-case';

@Module({
  imports: [
    AuthModule,
    SubscriptionModule,
    StorageModule,
    PrismaModule,
    forwardRef(() => JobModule),
  ],
  controllers: [PartController],
  providers: [
    {
      provide: 'IPartRepository',
      useClass: PartRepository,
    },
    {
      provide: 'ICreatePartUseCase',
      useClass: CreatePartUseCase,
    },
    {
      provide: 'IEditPartUseCase',
      useClass: EditPartUseCase,
    },
    {
      provide: 'IGetAllActivePartsUseCase',
      useClass: GetAllActivePartsUseCase,
    },
    {
      provide: 'IListPartsUseCase',
      useClass: ListPartsUseCase,
    },
    {
      provide: 'IBlockPartUseCase',
      useClass: BlockPartUseCase,
    },
    {
      provide: 'IDeletePartUseCase',
      useClass: DeletePartUseCase,
    },
    {
      provide: 'ICheckResourceInUseUseCase',
      useClass: CheckResourceInUseUseCase,
    },
  ],
  exports: ['IGetAllActivePartsUseCase', 'ICheckResourceInUseUseCase'],
})
export class PartModule {}
