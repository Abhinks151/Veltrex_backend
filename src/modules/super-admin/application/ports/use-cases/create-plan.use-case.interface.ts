import { Plan } from '../../../domain/plan.entity';
import { CreatePlanDto } from '../../dto/create-plan.input.dto';

export interface ICreatePlanUseCase {
  execute(data: CreatePlanDto): Promise<Plan>;
}
