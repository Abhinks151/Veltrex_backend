export interface AdminDashboardRecentShiftDto {
  id: string;
  date: string;
  shiftType: string;
  status: string;
  employeeName: string;
  employeeEmail: string;
  jobsCount: number;
  completedJobsCount: number;
}

export interface AdminDashboardRecentTicketDto {
  id: string;
  issue: string;
  status: string;
  updatedAt: string;
  machine: {
    name: string;
    brand: string;
  } | null;
  assignee: {
    name: string;
  } | null;
}

export interface AdminDashboardStatsDto {
  activeJobsCount: number;
  completedJobsCount: number;
  maintenanceMachinesCount: number;
  recentShifts: AdminDashboardRecentShiftDto[];
  recentTickets: AdminDashboardRecentTicketDto[];
}

export interface IGetAdminDashboardUseCase {
  execute(tenantId: string): Promise<AdminDashboardStatsDto>;
}
