import { Inject, Injectable } from '@nestjs/common';
import {
  IGetSuperAdminRevenueStatsUseCase,
  SuperAdminRevenueStatsResponseDto,
} from '../ports/use-cases/get-super-admin-revenue-stats.use-case.interface';
import { ISuperAdminDashboardRepository } from '../ports/repositories/super-admin-dashboard.repository.interface';
import { GetRevenueQueryDto } from '../../presentation/dto/get-revenue-query.dto';
import { BadRequestError } from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

@Injectable()
export class GetSuperAdminRevenueStatsUseCase implements IGetSuperAdminRevenueStatsUseCase {
  constructor(
    @Inject('ISuperAdminDashboardRepository')
    private readonly _dashboardRepository: ISuperAdminDashboardRepository,
  ) {}

  async execute(
    query: GetRevenueQueryDto,
  ): Promise<SuperAdminRevenueStatsResponseDto> {
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

    // 1. Core overall stats
    const lifetimeRevenue = await this._dashboardRepository.getTotalRevenue();
    const totalTenants = await this._dashboardRepository.getTotalTenantsCount();
    const activeSubscriptionsCount =
      await this._dashboardRepository.getActiveSubscriptionsCount();

    // Calculate Average Revenue Per Account
    const averageRevenuePerAccount =
      totalTenants > 0
        ? parseFloat((lifetimeRevenue / totalTenants).toFixed(2))
        : 0;

    // 2. Revenue in current range vs previous range to calculate growth
    let periodRevenue = 0;
    let prevPeriodRevenue = 0;

    if (range === 'lifetime') {
      const startOfCurrentMonth = prevEndDate; // start of this month
      periodRevenue = await this._dashboardRepository.getRevenueInRange(
        startOfCurrentMonth,
        now,
      );
      prevPeriodRevenue = await this._dashboardRepository.getRevenueInRange(
        prevStartDate,
        startOfCurrentMonth,
      );
    } else {
      periodRevenue = await this._dashboardRepository.getRevenueInRange(
        startDate,
        endDate,
      );
      prevPeriodRevenue = await this._dashboardRepository.getRevenueInRange(
        prevStartDate,
        prevEndDate,
      );
    }

    let revenueGrowthPercentage = 0;
    if (prevPeriodRevenue > 0) {
      revenueGrowthPercentage = parseFloat(
        (
          ((periodRevenue - prevPeriodRevenue) / prevPeriodRevenue) *
          100
        ).toFixed(2),
      );
    } else if (periodRevenue > 0) {
      revenueGrowthPercentage = 100;
    }

    // 3. Payments within range for charts and exports
    const payments = await this._dashboardRepository.getPaymentsInRange(
      startDate,
      endDate,
    );

    // Format chart buckets (revenue sum over intervals)
    const chartData = this.generateChartBuckets(
      payments as { amount: any; createdAt: Date }[],
      startDate,
      endDate,
      chartInterval,
    );

    // 4. Recent subscriptions (last 5)
    const recentSubscriptions =
      await this._dashboardRepository.getRecentSubscriptions(5);

    return {
      lifetimeRevenue,
      periodRevenue,
      revenueGrowthPercentage,
      activeSubscriptionsCount,
      averageRevenuePerAccount,
      recentSubscriptions,
      payments,
      chartData,
    };
  }

  private generateChartBuckets(
    payments: { amount: any; createdAt: Date }[],
    start: Date,
    end: Date,
    interval: 'day' | 'month',
  ): { label: string; amount: number }[] {
    const buckets: { label: string; amount: number }[] = [];
    const sumMap = new Map<string, number>();

    if (interval === 'day') {
      const current = new Date(start);
      while (current <= end) {
        const label = this.formatDayLabel(current);
        sumMap.set(label, 0);
        current.setDate(current.getDate() + 1);
      }
      const finalLabel = this.formatDayLabel(end);
      if (!sumMap.has(finalLabel)) {
        sumMap.set(finalLabel, 0);
      }

      for (const p of payments) {
        const label = this.formatDayLabel(p.createdAt);
        if (sumMap.has(label)) {
          sumMap.set(label, sumMap.get(label)! + Number(p.amount));
        }
      }
    } else {
      // Monthly breakdown
      const current = new Date(start.getFullYear(), start.getMonth(), 1);
      while (current <= end) {
        const label = this.formatMonthLabel(current);
        sumMap.set(label, 0);
        current.setMonth(current.getMonth() + 1);
      }
      const finalLabel = this.formatMonthLabel(end);
      if (!sumMap.has(finalLabel)) {
        sumMap.set(finalLabel, 0);
      }

      for (const p of payments) {
        const label = this.formatMonthLabel(p.createdAt);
        if (sumMap.has(label)) {
          sumMap.set(label, sumMap.get(label)! + Number(p.amount));
        }
      }
    }

    sumMap.forEach((sum, label) => {
      buckets.push({ label, amount: parseFloat(sum.toFixed(2)) });
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
