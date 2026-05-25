import { Plan } from '../../../domain/plan.entity';

export interface ICreatePlanUseCase {
  execute(data: Partial<Plan>): Promise<Plan>;
}
