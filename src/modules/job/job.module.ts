import { Module } from '@nestjs/common';
import { JobController } from './presentation/job.controller';
import { CreateJobUseCase } from './application/use-cases/create-job.use-case';
import { EditJobUseCase } from './application/use-cases/edit-job.use-case';
import { ListJobsUseCase } from './application/use-cases/list-jobs.use-case';
import { DeleteJobUseCase } from './application/use-cases/delete-job.use-case';
import { JobRepository } from './infrastructure/repositories/job-repository';
import { PrismaModule } from '@/shared/infrastructure/prisma/prisma.module';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [PrismaModule, SubscriptionModule],
  controllers: [JobController],
  providers: [
    {
      provide: 'ICreateJobUseCase',
      useClass: CreateJobUseCase,
    },
    {
      provide: 'IEditJobUseCase',
      useClass: EditJobUseCase,
    },
    {
      provide: 'IListJobsUseCase',
      useClass: ListJobsUseCase,
    },
    {
      provide: 'IDeleteJobUseCase',
      useClass: DeleteJobUseCase,
    },
    {
      provide: 'IJobRepository',
      useClass: JobRepository,
    },
  ],
})
export class JobModule {}
