import { Plan } from '../../../domain/plan.entity';

export interface IGetPlanByIdUseCase {
  execute(id: string): Promise<Plan | null>;
}
