import { Inject, Injectable } from '@nestjs/common';
import { IPartRepository } from '../ports/repositories/part-repository.interface';
import { IListPartsUseCase } from '../ports/use-cases/list-parts.use-case.interface';
import { Part } from '../../domain/part.entity';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';

@Injectable()
export class ListPartsUseCase implements IListPartsUseCase {
  constructor(
    @Inject('IPartRepository')
    private readonly _partRepository: IPartRepository,
  ) {}

  async execute(
    tenantId: string,
    query: PaginationQueryDto & { priority?: string },
  ): Promise<{ items: Part[]; total: number }> {
    return await this._partRepository.findAllPaginated(tenantId, query);
  }
}
