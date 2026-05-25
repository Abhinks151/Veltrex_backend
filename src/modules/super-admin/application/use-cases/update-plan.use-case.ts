import { Inject, Injectable } from '@nestjs/common';
import { IPlanRepository } from '../ports/repositories/plan-repository.interface';
import { IUpdatePlanUseCase } from '../ports/use-cases/update-plan.use-case.interface';
import { Plan } from '../../domain/plan.entity';

@Injectable()
export class UpdatePlanUseCase implements IUpdatePlanUseCase {
  constructor(
    @Inject('IPlanRepository')
    private readonly _planRepository: IPlanRepository,
  ) {}

  async execute(id: string, data: Partial<Plan>): Promise<Plan> {
    return await this._planRepository.update(id, data);
  }
}
