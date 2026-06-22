import { Inject, Injectable } from '@nestjs/common';
import { IDeleteMachineUseCase } from '../ports/use-cases/delete-machine.use-case.interface';
import { IMachineRepository } from '../ports/repositories/machine-repository.interface';
import { Machine } from '../../domain/machine.entity';
import {
  ConflictError,
  BadRequestError,
  NotFoundError,
} from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import { ICheckResourceInUseUseCase } from '@/modules/part/application/ports/use-cases/check-resource-in-use.use-case.interface';

@Injectable()
export class DeleteMachineUseCase implements IDeleteMachineUseCase {
  constructor(
    @Inject('IMachineRepository')
    private readonly _machineRepository: IMachineRepository,
    @Inject('ICheckResourceInUseUseCase')
    private readonly _checkResourceInUseUseCase: ICheckResourceInUseUseCase,
  ) {}

  async execute(id: string): Promise<Machine> {
    const existing = await this._machineRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.MACHINE_NOT_FOUND);
    }

    if (existing.isDeleted) {
      throw new BadRequestError(
        MESSAGE_CONSTANTS.ERROR.MACHINE_ALREADY_DELETED,
      );
    }

    const isInUse = await this._checkResourceInUseUseCase.isMachineInUse(id);

    if (isInUse) {
      throw new ConflictError(MESSAGE_CONSTANTS.ERROR.MACHINE_IN_USE);
    }

    try {
      return await this._machineRepository.delete(id);
    } catch {
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.INTERNAL_SERVER_ERROR);
    }
  }
}
