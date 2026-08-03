import { Inject, Injectable } from '@nestjs/common';
import { IPartRepository } from '../ports/repositories/part-repository.interface';
import { ICheckResourceInUseUseCase } from '../ports/use-cases/check-resource-in-use.use-case.interface';

@Injectable()
export class CheckResourceInUseUseCase implements ICheckResourceInUseUseCase {
  constructor(
    @Inject('IPartRepository')
    private readonly _partRepository: IPartRepository,
  ) {}

  async isMachineInUse(machineId: string): Promise<boolean> {
    const count = await this._partRepository.countActiveByMachineId(machineId);
    return count > 0;
  }

  async isFixtureInUse(fixtureId: string): Promise<boolean> {
    const count = await this._partRepository.countActiveByFixtureId(fixtureId);
    return count > 0;
  }

  async isRawMaterialInUse(rawMaterialId: string): Promise<boolean> {
    const count =
      await this._partRepository.countActiveByRawMaterialId(rawMaterialId);
    return count > 0;
  }

  async isNcProgramInUse(ncProgramId: string): Promise<boolean> {
    const count =
      await this._partRepository.countActiveByNcProgramId(ncProgramId);
    return count > 0;
  }
}
