import { Inject, Injectable } from '@nestjs/common';
import { IPlanRepository } from '../ports/repositories/plan-repository.interface';
import { ITogglePlanBlockUseCase } from '../ports/use-cases/toggle-plan-block.use-case.interface';
import { Plan } from '../../domain/plan.entity';
import { NotFoundError } from '@/shared/common/errors/domain-errors';

@Injectable()
export class TogglePlanBlockUseCase implements ITogglePlanBlockUseCase {
  constructor(
    @Inject('IPlanRepository')
    private readonly _planRepository: IPlanRepository,
  ) {}

  async execute(id: string): Promise<Plan> {
    const plan = await this._planRepository.findById(id);
    if (!plan) {
      throw new NotFoundError('Plan not found');
    }

    return await this._planRepository.update(id, {
      isBlocked: !plan.isBlocked,
    });
  }
}
