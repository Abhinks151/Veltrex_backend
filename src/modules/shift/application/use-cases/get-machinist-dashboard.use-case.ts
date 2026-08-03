import { Inject, Injectable } from '@nestjs/common';
import {
  IGetMachinistDashboardUseCase,
  MachinistDashboardStatsDto,
} from '../ports/use-cases/get-machinist-dashboard.use-case.interface';
import { IProductionShiftRepository } from '../ports/repositories/production-shift-repository.interface';

@Injectable()
export class GetMachinistDashboardUseCase implements IGetMachinistDashboardUseCase {
  constructor(
    @Inject('IProductionShiftRepository')
    private readonly _productionShiftRepository: IProductionShiftRepository,
  ) {}

  async execute(
    tenantId: string,
    employeeId: string,
  ): Promise<MachinistDashboardStatsDto> {
    const today = new Date();
    return this._productionShiftRepository.getMachinistDashboardStats(
      tenantId,
      employeeId,
      today,
    );
  }
}
