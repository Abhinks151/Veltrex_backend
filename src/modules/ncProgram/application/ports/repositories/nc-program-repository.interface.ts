import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';
import { ITransactionContext } from '@/shared/application/ports/transaction-context.interface';
import { NcProgram } from '@/modules/ncProgram/domain/nc-program.entity';
import { CreateNcProgramDto } from '../../dto/create-nc-program.dto';

export interface INcProgramRepository {
  create(data: CreateNcProgramDto): Promise<NcProgram>;
  findById(
    id: string,
    ctx?: ITransactionContext,
    include?: Record<string, unknown>,
  ): Promise<NcProgram | null>;
  findByName(name: string, tenantId: string): Promise<NcProgram | null>;
  rename(id: string, newName: string): Promise<NcProgram>;
  findAllPaginated(
    tenantId: string,
    query: PaginationQueryDto,
  ): Promise<{ items: NcProgram[]; total: number }>;
  findAllActive(tenantId: string): Promise<NcProgram[]>;
  delete(id: string): Promise<NcProgram>;
}
