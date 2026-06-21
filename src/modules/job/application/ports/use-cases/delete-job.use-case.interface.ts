import { Job } from '../../../domain/job.entity';

export interface IDeleteJobUseCase {
  execute(id: string): Promise<Job>;
}
