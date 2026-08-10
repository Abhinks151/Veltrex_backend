import { Inject, Injectable } from '@nestjs/common';
import { IDeleteShiftTemplateUseCase } from '../ports/use-cases/delete-shift-template.use-case.interface';
import { IShiftTemplateRepository } from '../ports/repositories/shift-template-repository.interface';
import { ShiftTemplate } from '../../domain/shift.entity';
import { NotFoundError } from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import { ICreateNotificationUseCase } from '@/modules/notification/application/ports/use-cases/create-notification.use-case.interface';
import { NotificationType } from '@/modules/notification/domain/notification-type.enum';
import { SHIFT_NOTIFICATION } from '../constants/shift-notification.constants';

@Injectable()
export class DeleteShiftTemplateUseCase implements IDeleteShiftTemplateUseCase {
  constructor(
    @Inject('IShiftTemplateRepository')
    private readonly _shiftTemplateRepository: IShiftTemplateRepository,
    @Inject('ICreateNotificationUseCase')
    private readonly _createNotificationUseCase: ICreateNotificationUseCase,
  ) {}

  async execute(id: string, tenantId: string): Promise<ShiftTemplate> {
    const existing = await this._shiftTemplateRepository.findByTenantAndId(
      tenantId,
      id,
    );
    if (!existing) {
      throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.SHIFT_TEMPLATE_NOT_FOUND);
    }

    const deleted = await this._shiftTemplateRepository.delete(id);

    await this._createNotificationUseCase.execute({
      tenantId: deleted.tenantId,
      userId: deleted.employeeId,
      type: NotificationType.SHIFT_DELETED,
      title: SHIFT_NOTIFICATION.DELETED.title,
      message: SHIFT_NOTIFICATION.DELETED.message,
    });

    return deleted;
  }
}
