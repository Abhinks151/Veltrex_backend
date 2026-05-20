import { Inject, Injectable } from '@nestjs/common';
import { IListMachinesUseCase } from '../ports/use-cases/list-machines.use-case.interface';
import { IMachineRepository } from '../ports/repositories/machine-repository.interface';
import { Machine } from '../../domain/machine.entity';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';

@Injectable()
export class ListMachinesUseCase implements IListMachinesUseCase {
  constructor(
    @Inject('IMachineRepository')
    private readonly _machineRepository: IMachineRepository,
  ) {}

  async execute(
    tenantId: string,
    query: PaginationQueryDto,
  ): Promise<{ machines: Machine[]; total: number }> {
    return this._machineRepository.findAllPaginated(tenantId, query);
  }
}
