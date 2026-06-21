import { CreateJobDto } from '../../dto/create-job.dto';
import { Job } from '../../../domain/job.entity';

export interface ICreateJobUseCase {
  execute(dto: CreateJobDto): Promise<Job>;
}
