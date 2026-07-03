import { NcProgram } from '../../../domain/nc-program.entity';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';

export interface IGetNcProgramListUseCase {
  execute(
    tenantId: string,
    query: PaginationQueryDto,
  ): Promise<{ items: NcProgram[]; total: number }>;
}
