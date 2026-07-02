import { Inject, Injectable } from '@nestjs/common';
import { IListShiftTemplatesUseCase } from '../ports/use-cases/list-shift-templates.use-case.interface';
import { IShiftTemplateRepository } from '../ports/repositories/shift-template-repository.interface';
import { ShiftTemplate } from '../../domain/shift.entity';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';

@Injectable()
export class ListShiftTemplatesUseCase implements IListShiftTemplatesUseCase {
  constructor(
    @Inject('IShiftTemplateRepository')
    private readonly _shiftTemplateRepository: IShiftTemplateRepository,
  ) {}

  async execute(
    tenantId: string,
    query: PaginationQueryDto,
  ): Promise<{ items: ShiftTemplate[]; total: number }> {
    return await this._shiftTemplateRepository.findAllPaginated(
      tenantId,
      query,
    );
  }
}
