import { Inject, Injectable } from '@nestjs/common';
import { IListProductionShiftsUseCase } from '../ports/use-cases/list-production-shifts.use-case.interface';
import { IProductionShiftRepository } from '../ports/repositories/production-shift-repository.interface';
import { ProductionShift } from '../../domain/shift.entity';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';

@Injectable()
export class ListProductionShiftsUseCase implements IListProductionShiftsUseCase {
  constructor(
    @Inject('IProductionShiftRepository')
    private readonly _productionShiftRepository: IProductionShiftRepository,
  ) {}

  async execute(
    tenantId: string,
    query: PaginationQueryDto & {
      date?: string;
      employeeId?: string;
      onlyFutureOrToday?: boolean;
    },
  ): Promise<{ items: ProductionShift[]; total: number }> {
    return await this._productionShiftRepository.findAllPaginated(
      tenantId,
      query,
    );
  }
}
