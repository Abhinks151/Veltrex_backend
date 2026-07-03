import { Injectable, Inject } from '@nestjs/common';
import { INcProgramRepository } from '../ports/repositories/nc-program-repository.interface';
import { NcProgram } from '../../domain/nc-program.entity';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';

@Injectable()
export class GetNcProgramListUseCase {
  constructor(
    @Inject('INcProgramRepository')
    private readonly ncProgramRepository: INcProgramRepository,
  ) {}

  async execute(
    tenantId: string,
    query: PaginationQueryDto,
  ): Promise<{ items: NcProgram[]; total: number }> {
    return this.ncProgramRepository.findAllPaginated(tenantId, query);
  }
}
