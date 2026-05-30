import { ITransactionContext } from '@/shared/application/ports/transaction-context.interface';

export interface IBaseRepository<
  TEntity,
  TCreateDto,
  TUpdateDto = Partial<TCreateDto>,
> {
  create(data: TCreateDto, ctx?: ITransactionContext): Promise<TEntity>;
  update(
    id: string,
    data: TUpdateDto,
    ctx?: ITransactionContext,
  ): Promise<TEntity>;
}
