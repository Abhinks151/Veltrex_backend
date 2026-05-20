import { Inject, Injectable } from '@nestjs/common';
import { IGetAllActiveMachinesUseCase } from '../ports/use-cases/get-all-active-machines.use-case.interface';
import { IMachineRepository } from '../ports/repositories/machine-repository.interface';
import { Machine } from '../../domain/machine.entity';

@Injectable()
export class GetAllActiveMachinesUseCase implements IGetAllActiveMachinesUseCase {
  constructor(
    @Inject('IMachineRepository')
    private readonly _machineRepository: IMachineRepository,
  ) {}

  async execute(tenantId: string): Promise<Machine[]> {
    return this._machineRepository.findAllActive(tenantId);
  }
}
