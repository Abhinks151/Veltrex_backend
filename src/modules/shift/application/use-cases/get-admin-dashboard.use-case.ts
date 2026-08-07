import { Inject, Injectable } from '@nestjs/common';
import {
  IGetAdminDashboardUseCase,
  AdminDashboardStatsDto,
} from '../ports/use-cases/get-admin-dashboard.use-case.interface';
import { IProductionShiftRepository } from '../ports/repositories/production-shift-repository.interface';

@Injectable()
export class GetAdminDashboardUseCase implements IGetAdminDashboardUseCase {
  constructor(
    @Inject('IProductionShiftRepository')
    private readonly _productionShiftRepository: IProductionShiftRepository,
  ) {}

  async execute(tenantId: string): Promise<AdminDashboardStatsDto> {
    return this._productionShiftRepository.getAdminDashboardStats(tenantId);
  }
}
