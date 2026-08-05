import { Module } from '@nestjs/common';
import { LookupService } from './application/services/lookup.service';
import { LookupController } from './presentation/lookup.controller';
import { PrismaModule } from '@/shared/infrastructure/prisma/prisma.module';
import { PrismaLookupRepository } from './infrastructure/repositories/lookup-repository';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: 'ILookupRepository',
      useClass: PrismaLookupRepository,
    },
    {
      provide: 'ILookupService',
      useClass: LookupService,
    },
  ],
  controllers: [LookupController],
  exports: ['ILookupService'],
})
export class LookupModule {}
