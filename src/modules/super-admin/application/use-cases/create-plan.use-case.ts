import { Inject, Injectable } from '@nestjs/common';
import { IPlanRepository } from '../ports/repositories/plan-repository.interface';
import { ICreatePlanUseCase } from '../ports/use-cases/create-plan.use-case.interface';
import { Plan } from '../../domain/plan.entity';

@Injectable()
export class CreatePlanUseCase implements ICreatePlanUseCase {
  constructor(
    @Inject('IPlanRepository')
    private readonly _planRepository: IPlanRepository,
  ) {}

  async execute(data: Partial<Plan>): Promise<Plan> {
    return await this._planRepository.create(data);
  }
}
