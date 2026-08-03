export interface MachinistDashboardJobDto {
  id: string;
  partName: string;
  partNumber: string;
  assignedQuantity: number;
  completedQuantity: number;
  status: string;
  sequence: number;
}

export interface MachinistDashboardTodayShiftDto {
  id: string;
  shiftType: string;
  status: string;
  date: string;
}

export interface MachinistDashboardStatsDto {
  todayShift: MachinistDashboardTodayShiftDto | null;
  totalAssignedParts: number;
  totalCompletedParts: number;
  totalRemainingParts: number;
  pendingJobsCount: number;
  inProgressJobsCount: number;
  completedJobsCount: number;
  jobs: MachinistDashboardJobDto[];
}

export interface IGetMachinistDashboardUseCase {
  execute(
    tenantId: string,
    employeeId: string,
  ): Promise<MachinistDashboardStatsDto>;
}
