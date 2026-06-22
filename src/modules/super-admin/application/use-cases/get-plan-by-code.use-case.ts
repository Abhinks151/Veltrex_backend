import { Inject, Injectable } from '@nestjs/common';
import { IGetPlanByCodeUseCase } from '../ports/use-cases/get-plan-by-code.use-case.interface';
import { IPlanRepository } from '../ports/repositories/plan-repository.interface';
import { Plan } from '../../domain/plan.entity';

@Injectable()
export class GetPlanByCodeUseCase implements IGetPlanByCodeUseCase {
  constructor(
    @Inject('IPlanRepository')
    private readonly _planRepository: IPlanRepository,
  ) {}

  async execute(code: string): Promise<Plan | null> {
    return this._planRepository.findByCode(code);
  }
}
