import { Inject, Injectable } from '@nestjs/common';
import { IEditMachineUseCase } from '../ports/use-cases/edit-machine.use-case.interface';
import { IMachineRepository } from '../ports/repositories/machine-repository.interface';
import { Machine } from '../../domain/machine.entity';
import { MachineInputDto } from '../dto/create-machine.dto';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

@Injectable()
export class EditMachineUseCase implements IEditMachineUseCase {
  constructor(
    @Inject('IMachineRepository')
    private readonly _machineRepository: IMachineRepository,
  ) {}

  async execute(id: string, dto: MachineInputDto): Promise<Machine> {
    const existing = await this._machineRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.MACHINE_NOT_FOUND);
    }

    if (dto.name) {
      const nameConflict = await this._machineRepository.findByTenantAndName(
        existing.tenantId,
        dto.name,
      );
      if (nameConflict && nameConflict.id !== id) {
        throw new ConflictError(MESSAGE_CONSTANTS.ERROR.MACHINE_NAME_TAKEN);
      }
    }

    try {
      return await this._machineRepository.update(id, dto);
    } catch {
      throw new BadRequestError(
        MESSAGE_CONSTANTS.ERROR.FAILED_TO_UPDATE_MACHINE,
      );
    }
  }
}
