import { Inject, Injectable } from '@nestjs/common';
import { IDeleteShiftTemplateUseCase } from '../ports/use-cases/delete-shift-template.use-case.interface';
import { IShiftTemplateRepository } from '../ports/repositories/shift-template-repository.interface';
import { ShiftTemplate } from '../../domain/shift.entity';
import { NotFoundError } from '@/shared/common/errors/domain-errors';

@Injectable()
export class DeleteShiftTemplateUseCase implements IDeleteShiftTemplateUseCase {
  constructor(
    @Inject('IShiftTemplateRepository')
    private readonly _shiftTemplateRepository: IShiftTemplateRepository,
  ) {}

  async execute(id: string, tenantId: string): Promise<ShiftTemplate> {
    const existing = await this._shiftTemplateRepository.findByTenantAndId(
      tenantId,
      id,
    );
    if (!existing) {
      throw new NotFoundError('Shift template not found');
    }

    return await this._shiftTemplateRepository.delete(id);
  }
}
