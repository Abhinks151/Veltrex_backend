export interface MachinistMachineDto {
  id: string;
  name: string;
  brand: string;
  status: string;
  shiftJobCompleted: boolean;
}

export interface IGetMachinistMachinesUseCase {
  execute(
    tenantId: string,
    machinistId: string,
  ): Promise<MachinistMachineDto[]>;
}
