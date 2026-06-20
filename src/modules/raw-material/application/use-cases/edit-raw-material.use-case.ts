import { Inject, Injectable } from '@nestjs/common';
import {
  IEditRawMaterialUseCase,
  RawMaterialInputDto,
} from '../ports/use-cases/edit-raw-material.use-case.interface';
import { IRawMaterialRepository } from '../ports/repositories/raw-material-repository.interface';
import { RawMaterial } from '../../domain/raw-material.entity';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

@Injectable()
export class EditRawMaterialUseCase implements IEditRawMaterialUseCase {
  constructor(
    @Inject('IRawMaterialRepository')
    private readonly _rawMaterialRepository: IRawMaterialRepository,
  ) {}

  async execute(id: string, dto: RawMaterialInputDto): Promise<RawMaterial> {
    const existing = await this._rawMaterialRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.RAW_MATERIAL_NOT_FOUND);
    }

    if (dto.name) {
      const nameConflict =
        await this._rawMaterialRepository.findByTenantAndName(
          existing.tenantId,
          dto.name,
        );
      if (nameConflict && nameConflict.id !== id) {
        throw new ConflictError(
          MESSAGE_CONSTANTS.ERROR.RAW_MATERIAL_NAME_TAKEN,
        );
      }
    }

    try {
      return await this._rawMaterialRepository.update(id, dto);
    } catch {
      throw new BadRequestError(
        MESSAGE_CONSTANTS.ERROR.FAILED_TO_UPDATE_RAW_MATERIAL,
      );
    }
  }
}
