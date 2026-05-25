import { Inject, Injectable } from '@nestjs/common';
import { IPlanRepository } from '../ports/repositories/plan-repository.interface';
import { IListAllPlansUseCase } from '../ports/use-cases/list-all-plans.use-case.interface';
import { Plan } from '../../domain/plan.entity';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';

@Injectable()
export class ListAllPlansUseCase implements IListAllPlansUseCase {
  constructor(
    @Inject('IPlanRepository')
    private readonly _planRepository: IPlanRepository,
  ) {}

  async execute(
    query: PaginationQueryDto,
  ): Promise<{ plans: Plan[]; total: number }> {
    return await this._planRepository.findAll(query);
  }
}
