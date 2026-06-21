import { EditJobDto } from '../../dto/edit-job.dto';
import { Job } from '../../../domain/job.entity';

export interface IEditJobUseCase {
  execute(id: string, dto: EditJobDto): Promise<Job>;
}
