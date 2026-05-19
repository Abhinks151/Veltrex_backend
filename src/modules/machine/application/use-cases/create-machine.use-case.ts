import { Inject, Injectable } from '@nestjs/common';
import { ICreateMachineUseCase } from '../ports/use-cases/create-machine.use-case.interface';
import { IMachineRepository } from '../ports/repositories/machine-repository.interface';
import { Machine } from '../../domain/machine.entity';
import { CreateMachineDto } from '../dto/create-machine.dto';
import {
  BadRequestError,
  ConflictError,
} from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

@Injectable()
export class CreateMachineUseCase implements ICreateMachineUseCase {
  constructor(
    @Inject('IMachineRepository')
    private readonly _machineRepository: IMachineRepository,
  ) {}

  async execute(dto: CreateMachineDto): Promise<Machine> {
    const existing = await this._machineRepository.findByTenantAndName(
      dto.tenantId,
      dto.name,
    );
    if (existing) {
      throw new ConflictError(MESSAGE_CONSTANTS.ERROR.MACHINE_NAME_TAKEN);
    }

    try {
      return await this._machineRepository.create(dto);
    } catch {
      throw new BadRequestError(
        MESSAGE_CONSTANTS.ERROR.FAILED_TO_CREATE_MACHINE,
      );
    }
  }
}
