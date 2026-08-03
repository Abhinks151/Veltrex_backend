export interface ICheckResourceInUseUseCase {
  isMachineInUse(machineId: string): Promise<boolean>;
  isFixtureInUse(fixtureId: string): Promise<boolean>;
  isRawMaterialInUse(rawMaterialId: string): Promise<boolean>;
  isNcProgramInUse(ncProgramId: string): Promise<boolean>;
}
