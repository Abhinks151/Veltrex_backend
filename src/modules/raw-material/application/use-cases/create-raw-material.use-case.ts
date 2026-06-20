import { Inject, Injectable } from '@nestjs/common';
import { ICreateRawMaterialUseCase } from '../ports/use-cases/create-raw-material.use-case.interface';
import { IRawMaterialRepository } from '../ports/repositories/raw-material-repository.interface';
import { RawMaterial } from '../../domain/raw-material.entity';
import { CreateRawMaterialDto } from '../dto/create-raw-material.dto';
import {
  BadRequestError,
  ConflictError,
} from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

@Injectable()
export class CreateRawMaterialUseCase implements ICreateRawMaterialUseCase {
  constructor(
    @Inject('IRawMaterialRepository')
    private readonly _rawMaterialRepository: IRawMaterialRepository,
  ) {}

  async execute(dto: CreateRawMaterialDto): Promise<RawMaterial> {
    const existing = await this._rawMaterialRepository.findByTenantAndName(
      dto.tenantId,
      dto.name,
    );
    if (existing) {
      throw new ConflictError(MESSAGE_CONSTANTS.ERROR.RAW_MATERIAL_NAME_TAKEN);
    }

    try {
      return await this._rawMaterialRepository.create(dto);
    } catch {
      throw new BadRequestError(
        MESSAGE_CONSTANTS.ERROR.FAILED_TO_CREATE_RAW_MATERIAL,
      );
    }
  }
}
