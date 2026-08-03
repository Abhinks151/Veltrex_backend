import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { StorageModule } from '@/shared/infrastructure/storage/storage.module';
import { PrismaModule } from '@/shared/infrastructure/prisma/prisma.module';
import { PartModule } from '../part/part.module';

import { NcProgramController } from './presentation/nc-program.controller';
import { NcProgramRepository } from './infrastructure/repositories/nc-program-repository';
import { ProgramVersionRepository } from './infrastructure/repositories/program-version-repository';

import { CreateNcProgramUseCase } from './application/use-cases/create-nc-program.use-case';
import { UpdateNcProgramUseCase } from './application/use-cases/update-nc-program.use-case';
import { GetNcProgramListUseCase } from './application/use-cases/get-nc-program-list.use-case';
import { DeleteProgramVersionUseCase } from './application/use-cases/delete-program-version.use-case';
import { DeleteNcProgramUseCase } from './application/use-cases/delete-nc-program.use-case';

@Module({
  imports: [
    AuthModule,
    SubscriptionModule,
    StorageModule,
    PrismaModule,
    forwardRef(() => PartModule),
  ],
  controllers: [NcProgramController],
  providers: [
    {
      provide: 'ICreateNcProgramUseCase',
      useClass: CreateNcProgramUseCase,
    },
    {
      provide: 'IUpdateNcProgramUseCase',
      useClass: UpdateNcProgramUseCase,
    },
    {
      provide: 'IGetNcProgramListUseCase',
      useClass: GetNcProgramListUseCase,
    },
    {
      provide: 'IDeleteProgramVersionUseCase',
      useClass: DeleteProgramVersionUseCase,
    },
    {
      provide: 'IDeleteNcProgramUseCase',
      useClass: DeleteNcProgramUseCase,
    },
    {
      provide: 'INcProgramRepository',
      useClass: NcProgramRepository,
    },
    {
      provide: 'IProgramVersionRepository',
      useClass: ProgramVersionRepository,
    },
  ],
  exports: [
    'ICreateNcProgramUseCase',
    'INcProgramRepository',
    'IProgramVersionRepository',
  ],
})
export class NcProgramModule {}
