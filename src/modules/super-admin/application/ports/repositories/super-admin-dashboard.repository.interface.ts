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
}
