import { Inject, Injectable } from '@nestjs/common';
import { IGetPlanByIdUseCase } from '../ports/use-cases/get-plan-by-id.use-case.interface';
import { IPlanRepository } from '../ports/repositories/plan-repository.interface';
import { Plan } from '../../domain/plan.entity';

@Injectable()
export class GetPlanByIdUseCase implements IGetPlanByIdUseCase {
  constructor(
    @Inject('IPlanRepository')
    private readonly _planRepository: IPlanRepository,
  ) {}

  async execute(id: string): Promise<Plan | null> {
    return await this._planRepository.findById(id);
  }
}
