import { Plan } from '../../../domain/plan.entity';

export interface IUpdatePlanUseCase {
  execute(id: string, data: Partial<Plan>): Promise<Plan>;
}
