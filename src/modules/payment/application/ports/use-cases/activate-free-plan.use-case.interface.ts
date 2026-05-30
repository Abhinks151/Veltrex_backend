import { ActivateFreePlanDto } from '../../dto/activate-free-plan.dto';
import { ActivateFreePlanResponseDto } from '../../dto/activate-free-plan-response.dto';

export interface IActivateFreePlanUseCase {
  execute(data: ActivateFreePlanDto): Promise<ActivateFreePlanResponseDto>;
}
