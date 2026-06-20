import { Plan } from '../../../domain/plan.entity';

export interface ITogglePlanBlockUseCase {
  execute(id: string): Promise<Plan>;
}
