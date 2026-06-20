import { ITransactionContext } from '@/shared/application/ports/transaction-context.interface';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';

export interface IBaseRepository<TEntity, TCreateData, TUpdateData> {
  create(data: TCreateData, ctx?: ITransactionContext): Promise<TEntity>;
  update(
    id: string,
    data: TUpdateData,
    ctx?: ITransactionContext,
  ): Promise<TEntity>;
  findById(id: string, ctx?: ITransactionContext): Promise<TEntity | null>;
  delete(id: string, ctx?: ITransactionContext): Promise<TEntity>;
  findAll(
    query: PaginationQueryDto,
    ctx?: ITransactionContext,
    where?: Record<string, unknown>,
  ): Promise<{ items: TEntity[]; total: number }>;
}
