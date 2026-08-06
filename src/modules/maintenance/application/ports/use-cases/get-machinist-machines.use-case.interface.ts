export interface MachinistMachineDto {
  id: string;
  name: string;
  brand: string;
  status: string;
}

export interface IGetMachinistMachinesUseCase {
  execute(
    tenantId: string,
    machinistId: string,
  ): Promise<MachinistMachineDto[]>;
}
