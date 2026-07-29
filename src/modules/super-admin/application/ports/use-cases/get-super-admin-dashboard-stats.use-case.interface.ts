import { GetDashboardQueryDto } from '../../../presentation/dto/get-dashboard-query.dto';

export interface SuperAdminDashboardStatsResponseDto {
  totalTenants: number;
  tenantGrowthPercentage: number;
  totalUsers: number;
  totalRevenue: number;
  recentTenants: any[];
  chartData: { label: string; count: number }[];
}

export interface IGetSuperAdminDashboardStatsUseCase {
  execute(
    query: GetDashboardQueryDto,
  ): Promise<SuperAdminDashboardStatsResponseDto>;
}
