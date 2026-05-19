import { Inject, Injectable } from '@nestjs/common';
import { IMachineQueryService } from './application/ports/services/machine-query.service.interface';
import { IMachineRepository } from './application/ports/repositories/machine-repository.interface';
import { Machine } from './domain/machine.entity';

@Injectable()
export class MachineQueryService implements IMachineQueryService {
  constructor(
    @Inject('IMachineRepository')
    private readonly _machineRepository: IMachineRepository,
  ) {}

  async getById(id: string): Promise<Machine | null> {
    return this._machineRepository.findById(id);
  }

  async findAllActive(tenantId: string): Promise<Machine[]> {
    return this._machineRepository.findAllActive(tenantId);
  }
}
