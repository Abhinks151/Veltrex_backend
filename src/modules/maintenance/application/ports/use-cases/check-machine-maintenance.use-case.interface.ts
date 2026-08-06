export interface ICheckMachineMaintenanceUseCase {
  hasActiveTickets(machineId: string): Promise<boolean>;
}
