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
import { ICreateNotificationUseCase } from '../../../notification/application/ports/use-cases/create-notification.use-case.interface';
import { NotificationType } from '../../../notification/domain/notification-type.enum';
import { Role } from '@/shared/enums';

@Injectable()
export class CreateMachineUseCase implements ICreateMachineUseCase {
  constructor(
    @Inject('IMachineRepository')
    private readonly _machineRepository: IMachineRepository,
    @Inject('ICreateNotificationUseCase')
    private readonly _createNotificationUseCase: ICreateNotificationUseCase,
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
      const machine = await this._machineRepository.create(dto);

      await this._createNotificationUseCase.execute({
        tenantId: dto.tenantId,
        role: Role.ADMIN,
        type: NotificationType.MACHINE_CREATED,
        title: 'New Machine Created',
        message: `A new machine '${dto.name}' has been created successfully.`,
      });

      return machine;
    } catch {
      throw new BadRequestError(
        MESSAGE_CONSTANTS.ERROR.FAILED_TO_CREATE_MACHINE,
      );
    }
  }
}
