export interface ISuperAdminDashboardRepository {
  getTotalTenantsCount(): Promise<number>;
  getTenantsCreatedInRange(start: Date, end: Date): Promise<number>;
  getRecentTenants(limit: number): Promise<any[]>;
  getTenantsCreatedByInterval(
    start: Date,
    end: Date,
  ): Promise<{ createdAt: Date }[]>;
  getTotalUsersCount(): Promise<number>;
  getTotalRevenue(): Promise<number>;
  getRevenueInRange(start: Date, end: Date): Promise<number>;
  getPaymentsInRange(start: Date, end: Date): Promise<any[]>;
  getRecentSubscriptions(limit: number): Promise<any[]>;
  getActiveSubscriptionsCount(): Promise<number>;
}
