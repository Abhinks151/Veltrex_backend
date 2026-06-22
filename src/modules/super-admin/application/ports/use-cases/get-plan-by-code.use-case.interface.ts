import { Plan } from '../../../domain/plan.entity';

export interface IGetPlanByCodeUseCase {
  execute(code: string): Promise<Plan | null>;
}
