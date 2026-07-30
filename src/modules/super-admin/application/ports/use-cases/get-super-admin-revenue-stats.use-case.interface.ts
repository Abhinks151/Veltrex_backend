import { GetRevenueQueryDto } from '../../../presentation/dto/get-revenue-query.dto';

export interface SuperAdminRevenueStatsResponseDto {
  lifetimeRevenue: number;
  periodRevenue: number;
  revenueGrowthPercentage: number;
  activeSubscriptionsCount: number;
  averageRevenuePerAccount: number;
  recentSubscriptions: any[];
  payments: any[];
  chartData: { label: string; amount: number }[];
}

export interface IGetSuperAdminRevenueStatsUseCase {
  execute(
    query: GetRevenueQueryDto,
  ): Promise<SuperAdminRevenueStatsResponseDto>;
}
