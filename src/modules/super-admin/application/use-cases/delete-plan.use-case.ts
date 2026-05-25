import { Inject, Injectable } from '@nestjs/common';
import { IPlanRepository } from '../ports/repositories/plan-repository.interface';
import { IDeletePlanUseCase } from '../ports/use-cases/delete-plan.use-case.interface';

@Injectable()
export class DeletePlanUseCase implements IDeletePlanUseCase {
  constructor(
    @Inject('IPlanRepository')
    private readonly _planRepository: IPlanRepository,
  ) {}

  async execute(id: string): Promise<void> {
    await this._planRepository.delete(id);
  }
}
