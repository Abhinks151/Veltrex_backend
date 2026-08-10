import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IRawMaterialRepository } from '../ports/repositories/raw-material-repository.interface';
import { IUpdateRawMaterialStockUseCase } from '../ports/use-cases/update-raw-material-stock.use-case.interface';
import { ICreateNotificationUseCase } from '@/modules/notification/application/ports/use-cases/create-notification.use-case.interface';
import { NotificationType } from '@/modules/notification/domain/notification-type.enum';
import { Role } from '@/shared/enums';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import { RAW_MATERIAL_NOTIFICATION } from '../constants/raw-material_notification.constants';

@Injectable()
export class UpdateRawMaterialStockUseCase implements IUpdateRawMaterialStockUseCase {
  constructor(
    @Inject('IRawMaterialRepository')
    private readonly _rawMaterialRepository: IRawMaterialRepository,
    @Inject('ICreateNotificationUseCase')
    private readonly _createNotificationUseCase: ICreateNotificationUseCase,
  ) {}

  async execute(id: string, quantityDelta: number): Promise<void> {
    const rawMaterial = await this._rawMaterialRepository.findById(id);
    if (!rawMaterial) {
      throw new NotFoundException(
        MESSAGE_CONSTANTS.ERROR.RAW_MATERIAL_NOT_FOUND ||
          'Raw material not found',
      );
    }

    const currentQtyOld = rawMaterial.currentQty ?? 0;
    const newQty = currentQtyOld + quantityDelta;

    await this._rawMaterialRepository.update(id, {
      currentQty: newQty,
    });

    if (newQty < rawMaterial.minQty && currentQtyOld >= rawMaterial.minQty) {
      await this._createNotificationUseCase.execute({
        tenantId: rawMaterial.tenantId,
        role: Role.ADMIN,
        type: NotificationType.RAW_MATERIAL_LOW_STOCK,
        title: RAW_MATERIAL_NOTIFICATION.LOW_STOCK.title,
        message: RAW_MATERIAL_NOTIFICATION.LOW_STOCK.message,
      });
    }
  }
}
