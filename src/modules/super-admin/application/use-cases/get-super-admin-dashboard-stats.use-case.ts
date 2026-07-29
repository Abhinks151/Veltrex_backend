import { Inject, Injectable } from '@nestjs/common';
import {
  IGetSuperAdminDashboardStatsUseCase,
  SuperAdminDashboardStatsResponseDto,
} from '../ports/use-cases/get-super-admin-dashboard-stats.use-case.interface';
import { ISuperAdminDashboardRepository } from '../ports/repositories/super-admin-dashboard.repository.interface';
import { GetDashboardQueryDto } from '../../presentation/dto/get-dashboard-query.dto';
import { BadRequestError } from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

@Injectable()
export class GetSuperAdminDashboardStatsUseCase implements IGetSuperAdminDashboardStatsUseCase {
  constructor(
    @Inject('ISuperAdminDashboardRepository')
    private readonly _dashboardRepository: ISuperAdminDashboardRepository,
  ) {}

  async execute(
    query: GetDashboardQueryDto,
  ): Promise<SuperAdminDashboardStatsResponseDto> {
    const range = query.range || 'month';
    let startDate: Date;
    let endDate: Date;
    let prevStartDate: Date;
    let prevEndDate: Date;
    let chartInterval: 'day' | 'month' = 'day';

    const now = new Date();

    if (range === 'week') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      endDate = now;
      prevStartDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
      prevEndDate = startDate;
      chartInterval = 'day';
    } else if (range === 'month') {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      endDate = now;
      prevStartDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
      prevEndDate = startDate;
      chartInterval = 'day';
    } else if (range === 'lifetime') {
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      endDate = now;

      const startOfCurrentMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        1,
      );
      const startOfPrevMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1,
      );
      prevStartDate = startOfPrevMonth;
      prevEndDate = startOfCurrentMonth;
      chartInterval = 'month';
    } else if (range === 'custom') {
      if (!query.startDate || !query.endDate) {
        throw new BadRequestError(
          MESSAGE_CONSTANTS.ERROR.CUSTOM_RANGE_REQUIRED,
        );
      }
      startDate = new Date(query.startDate);
      endDate = new Date(query.endDate);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.INVALID_DATE_FORMAT);
      }

      if (endDate < startDate) {
        throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.INVALID_CUSTOM_RANGE);
      }

      const durationMs = endDate.getTime() - startDate.getTime();
      prevStartDate = new Date(startDate.getTime() - durationMs);
      prevEndDate = startDate;

      // Determine chart grouping interval
      const durationDays = durationMs / (24 * 60 * 60 * 1000);
      chartInterval = durationDays > 60 ? 'month' : 'day';
    } else {
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.UNSUPPORTED_DATE_RANGE);
    }

    // 1. Total Tenants
    const totalTenants = await this._dashboardRepository.getTotalTenantsCount();

    // 1b. Total Users and Revenue
    const totalUsers = await this._dashboardRepository.getTotalUsersCount();
    const totalRevenue = await this._dashboardRepository.getTotalRevenue();

    // 2. Tenants created in current period & previous period to calculate growth
    let growthCount: number;
    let prevGrowthCount: number;

    if (range === 'lifetime') {
      const startOfCurrentMonth = prevEndDate; // this month start
      growthCount = await this._dashboardRepository.getTenantsCreatedInRange(
        startOfCurrentMonth,
        now,
      );
      prevGrowthCount =
        await this._dashboardRepository.getTenantsCreatedInRange(
          prevStartDate,
          startOfCurrentMonth,
        );
    } else {
      growthCount = await this._dashboardRepository.getTenantsCreatedInRange(
        startDate,
        endDate,
      );
      prevGrowthCount =
        await this._dashboardRepository.getTenantsCreatedInRange(
          prevStartDate,
          prevEndDate,
        );
    }

    let tenantGrowthPercentage = 0;
    if (prevGrowthCount > 0) {
      tenantGrowthPercentage = parseFloat(
        (((growthCount - prevGrowthCount) / prevGrowthCount) * 100).toFixed(2),
      );
    } else if (growthCount > 0) {
      tenantGrowthPercentage = 100;
    }

    // 3. Fetch chart timeseries
    const tenantsForChart =
      await this._dashboardRepository.getTenantsCreatedByInterval(
        startDate,
        endDate,
      );

    // Generate buckets
    const chartData = this.generateChartBuckets(
      tenantsForChart,
      startDate,
      endDate,
      chartInterval,
    );

    // 4. Recent tenants (last 5)
    const recentTenants = await this._dashboardRepository.getRecentTenants(5);

    return {
      totalTenants,
      tenantGrowthPercentage,
      totalUsers,
      totalRevenue,
      recentTenants,
      chartData,
    };
  }

  private generateChartBuckets(
    tenants: { createdAt: Date }[],
    start: Date,
    end: Date,
    interval: 'day' | 'month',
  ): { label: string; count: number }[] {
    const buckets: { label: string; count: number }[] = [];
    const countMap = new Map<string, number>();

    if (interval === 'day') {
      const current = new Date(start);
      // Ensure we include up to the end date
      while (current <= end) {
        const label = this.formatDayLabel(current);
        countMap.set(label, 0);
        current.setDate(current.getDate() + 1);
      }
      // Also add end date just in case of rounding
      const finalLabel = this.formatDayLabel(end);
      if (!countMap.has(finalLabel)) {
        countMap.set(finalLabel, 0);
      }

      for (const t of tenants) {
        const label = this.formatDayLabel(t.createdAt);
        if (countMap.has(label)) {
          countMap.set(label, countMap.get(label)! + 1);
        }
      }
    } else {
      // Monthly breakdown
      const current = new Date(start.getFullYear(), start.getMonth(), 1);
      while (current <= end) {
        const label = this.formatMonthLabel(current);
        countMap.set(label, 0);
        current.setMonth(current.getMonth() + 1);
      }
      const finalLabel = this.formatMonthLabel(end);
      if (!countMap.has(finalLabel)) {
        countMap.set(finalLabel, 0);
      }

      for (const t of tenants) {
        const label = this.formatMonthLabel(t.createdAt);
        if (countMap.has(label)) {
          countMap.set(label, countMap.get(label)! + 1);
        }
      }
    }

    countMap.forEach((count, label) => {
      buckets.push({ label, count });
    });

    return buckets;
  }

  private formatDayLabel(date: Date): string {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  }

  private formatMonthLabel(date: Date): string {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  }
}
